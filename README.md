# Tea Garden

Webbshop för te med kundsida och adminsida. Frontend i React + TypeScript (Vite), backend i Node.js/Express + TypeScript med PostgreSQL.

## 1. Kom igång

**Deployad shop:** https://tea-garden-three.vercel.app/
**Backend:** https://te-butik-server.onrender.com (gratisnivå, första anropet kan ta en stund pga. kallstart)

### Starta lokalt
```bash
# Server
cd backend
npm install
cp .env.example .env   # fyll i nycklar, se nedan
npm run dev

# Klient
cd frontend
npm install
cp .env.example .env   # VITE_API_URL måste sluta på /api
npm run dev
```

### Nycklar och testkonton
Alla hemligheter ligger i `backend/.env`. `.env.example` visar vilka variabler som behövs:

| Tjänst | Konto som behövs | Variabler |
|---|---|---|
| Leverantör | API-nyckel och bransch | `SUPPLIER_API_URL`, `SUPPLIER_API_KEY`, `SUPPLIER_API_TIMEOUT_MS`, `SUPPLIER_BRANSCH` |
| Algolia | Gratiskonto med ett index | `ALGOLIA_APP_ID`, `ALGOLIA_ADMIN_KEY`, `ALGOLIA_SEARCH_KEY`, `ALGOLIA_INDEX` |
| Stripe | Testläge | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| Supabase | Projekt med publik bucket | `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_BUCKET` |
| PostNord | Developer-portalen (sandbox) | `POSTNORD_API_KEY` |
| Google (OAuth) | OAuth-klient av typen Web application i Google Cloud Console | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `SESSION_TOKEN_SECRET`, `CLIENT_URL` |
| GitHub (OAuth) | OAuth App (Settings → Developer settings) och en fine-grained token med *Issues: Read and write* för shoppens repo | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_CALLBACK_URL`, `ADMIN_GITHUB_LOGINS`, `GITHUB_TOKEN`, `GITHUB_REPO` |
| Resend | API-nyckel med *Sending access* | `RESEND_API_KEY`, `EMAIL_FROM` |

### Testa integrationerna lokalt
- **Leverantör + Algolia:** Logga in som admin och anropa `POST /api/admin/products/import/csv` (eller `/xml`) för att hämta leverantörens katalog. Produkterna sparas i databasen och indexeras i Algolia. Om indexeringen misslyckas står det i svaret (`searchIndexed: false`), och då kan man köra om den separata omindexeringsrouten.
- **Stripe:** kör `stripe listen --forward-to localhost:<port>/api/stripe/webhook` och använd testkortet 4242 4242 4242 4242.
- **Supabase:** ladda upp en bild som admin på en produkt (JPEG/PNG, max 4 MB).
- **PostNord:** sandbox-nyckeln räcker. Testa med ett giltigt svenskt postnummer, t.ex. 111 22.
- **Google:** lägg callback-adressen (t.ex. `http://localhost:3000/api/auth/google/callback`) som *Authorized redirect URI* i Google Cloud och samma adress i `GOOGLE_CALLBACK_URL`. Gå sedan till shoppen och klicka på "Logga in". Se avsnittet om kundinloggning nedan.
- **GitHub:** lägg callback-adressen (`http://localhost:3000/api/admin/github/callback`) som Redirect URI i OAuth Appen, och ditt GitHub-användarnamn i `ADMIN_GITHUB_LOGINS`. Logga in från adminsidan och skapa en issue under Issues.
- **Resend:** utan egen domän skickar `onboarding@resend.dev` bara till e-postadressen på ditt Resend-konto. Lägg en order med den adressen, betala med testkortet och kontrollera under *Emails* i Resend.

## 2. Reflektion

### Integrationsmodeller och varför de passar
- **Leverantör – fil över HTTP.** Leverantören exponerar hela katalogen som en CSV- eller XML-export med API-nyckel. Servern hämtar filen, tolkar den (CSV i Windows-1252 med semikolon, XML i UTF-8) och upsertar produkterna på artikelnummer. Det är en hel katalog som ändras sällan, så ett svep på admins begäran passar bättre än ett anrop per produkt.
- **Algolia – SDK.** Servern använder `algoliasearch`: en admin-klient för att indexera och radera, en sök-klient för sökning. SDK:n sköter autentisering och format.
- **Stripe – redirect + webhook.** Kunden skickas till Stripes hosted checkout, men betalningsbeskedet kommer via webhook (`/api/stripe/webhook`), som sätter ordern till *Betald*, drar av lagret och uppdaterar indexet. Redirecten är bara navigation och webhooken är sanningen.
- **Supabase Storage – SDK/fil.** Servern laddar upp bildfiler och sparar sökväg och URL på produkten.
- **PostNord – REST.** Servern frågar efter ombud och leveranstid. Det är rena frågor och svar, så REST passar.
- **Resend – REST.** Servern skickar orderbekräftelsen med ett anrop till Resend. Det är ett enkelt anrop utan svar som shoppen är beroende av, så REST passar. Bara `emailAdapter.ts` känner till adressen och nyckeln.

### Varför via Express och inte direkt från React?
Allt i React kan läsas av vem som helst, så nycklarna för Stripe, Supabase, PostNord och Algolias admin-nyckel måste ligga på servern. Servern validerar också data (Zod mot PostNords svar, filtyp och storlek på bilder), räknar ut priser (fraktpriset skickas aldrig från React, annars kan kunden ändra det) och ger felen ett enhetligt format. Vill vi byta leverantör ändras bara servern.

### Varför integrera istället för att bygga själv?
- **Leverantör:** Data, priser och lagersaldo ägs av leverantören. Annars hade allt behövt matas in för hand. Att tolka två filformat med olika teckenkodning och decimaltecken ("12,50") och sortera bort trasiga rader är ett eget arbete som importen redan gör.
- **Algolia:** Felstavningstolerans, relevansrankning och snabb paginering är ett stort projekt. Med `LIKE` i SQL får vi inget av det.
- **Stripe:** Att hantera kortuppgifter själv kräver PCI-DSS, bedrägeriskydd, 3D Secure och avtal med banker. Med hosted checkout rör kortdata aldrig vår server.
- **Supabase:** Egen bildlagring kräver filserver, backup, CDN och åtkomstkontroll.
- **PostNord:** Ombudsregister och leveranstider bygger på PostNords eget nät. Vi kan inte producera den datan.

### Vad händer när tjänsterna är nere?
- **Leverantör:** Anropet har timeout och vid fel svarar importen 502 med ett felmeddelande. Kunderna märker inget, eftersom shopen visar sista importerade data. Rader som inte klarar valideringen eller har okänd kategori hoppas över och listas med orsak, så en trasig rad stoppar inte hela importen.
- **Algolia** är den känsligaste. Både söken och hela produktlistan hämtas från Algolia, eftersom paginering och sökning då löses på ett ställe. Är Algolia nere visar shopen ett felmeddelande istället för produkter, medan kundvagn, order och admin fungerar eftersom de använder databasen. Ingen data går förlorad, eftersom databasen är sanningen och indexet kan byggas om via en adminroute. Importen och produktborttagning fortsätter också att fungera när Algolia är nere, och svaret markeras med `searchIndexed: false` så att admin ser att indexet inte kunde uppdateras.
- **Stripe:** Misslyckas skapandet av sessionen svarar servern 502 och kunden stannar kvar i kassan. Ordern är *Väntande* tills webhooken bekräftar betalning, så en order markeras aldrig som betald av misstag.
- **Supabase:** Uppladdning har 10 sekunders timeout och admin får ett tydligt 502-meddelande. Vid bildbyte laddas den nya upp först och den gamla tas bort efteråt, så produkten behåller sin gamla bild om något går fel.
- **PostNord:** 5 sekunders timeout. Okänt postnummer (PostNord svarar 400) blir 404 med eget meddelande och övriga fel blir 502, så klienten kan skilja "fel indata" från "tjänsten är nere".
- **Resend:** Anropet har timeout och svaret valideras. Misslyckas mejlet loggas felet, men ordern är fortfarande betald och webhooken svarar 200. Stripe skickar alltså inte om webhooken i onödan, men kunden får då ingen bekräftelse (ordern syns fortfarande under Mina sidor).

### Risker med beroendena
Med **Stripe** är kostnaden en andel av varje köp, och prissättning och villkor kan ändras utan att vi kan påverka det. Byter vi leverantör måste webhook-flödet skrivas om. Det är begränsat eftersom Stripe ligger bakom en egen adapter.

Med **Algolia** har jag valt ett medvetet beroende: listan är beroende av tjänsten för att slippa bygga paginering och sök i SQL. Vinsten är enklare kod och snabb sökning, priset är att Algolias avbrott blir shopens avbrott. En fallback mot databasen vore möjlig men dubblerar logiken, och för en shop av den här storleken bedömde jag att det inte var värt det.

Med **PostNord** skickas kundens postnummer till en extern part, och adress och valt ombud sparas på ordern. Det är personuppgifter enligt GDPR, så vi behöver laglig grund och information i en integritetspolicy. Ändrar PostNord sitt API går fraktflödet sönder tills adaptern uppdaterats, men Zod-valideringen gör att det syns som ett tydligt fel istället för en tyst bugg.


## Frakt med PostNord – hur jag använde AI (Labb 5)

**Verktyg:** Claude i webbläsaren. Jag klistrade in de filer som behövdes.

**Prompter (sammanfattade):**
1. Labbinstruktionen och lärarens adapter-mall, med bakgrund om min stack. Jag bad AI:n skriva adaptern och routen för ombud.
2. Portalens dokumentation för Transit Time (V2) och ett råsvar från Postman. Jag bad om en adapter för leveranstid.
3. `createOrder`, `Order.create` och typerna. Jag bad om hjälp att spara frakten på ordern och lägga den som en egen rad i Stripe.

**Vad AI:n föreslog:** en adapter per tjänst med 5 s timeout och Zod-validering, routerna `/api/shipping/service-points` och `/api/shipping/delivery-estimates`, en prislista på servern (59 kr ombud, 99 kr hemleverans, fri frakt från 500 kr), kontroll av valt ombud mot PostNord och frakten som egen Stripe-rad. React skickar aldrig ett pris.

**Skillnader mot PostNords dokumentation och hur jag löste dem:**

| Skillnad | Lösning |
|---|---|
| AI:n hittade först en gammal endpoint (V1, Legacy). | Portalen visar V2 som gällande, så jag byggde mot `/rest/transport/v2/transittime/addresstoaddress`. |
| Portalens exempel har `startTime` 2024-12-01 och gav "Could not calculate ETA" på allt. | Servern skickar dagens tid i svensk tidszon, och då kom datum. |
| `additionalServices` är ett objekt i exemplet men en lista i svaret, och tjänstenamnen skiljer sig. | Schemat tillåter båda formerna. Jag filtrerar på `basicServiceCode` (17 hemleverans, 19 ombud) och skickar `serviceCodes=17,19`. |
| V2 returnerar även misslyckade beräkningar. | Ankomstfälten är valfria, och saknas datum visas ingen leveranstid. Beställningen blockeras aldrig. |
| Okänt postnummer ger 400 och fel nyckel ger 403. | 400 blir 404 med ett begripligt meddelande, och övriga fel blir 502. |

**Kontroll:** Jag jämförde med portalen och körde varje anrop i Postman, både mot PostNord och via min server, inklusive felfall (fel nyckel, okänt postnummer, ombud som inte hör till postnumret). Servern sparar ombudets namn och adress från PostNords svar, aldrig från React.

**Reflektion:** AI:n gav en bra struktur snabbt, men koden var inte färdig. Den hade en namnkrock och saknade fält i mina typer, och den byggde på en föråldrad endpoint tills jag läste portalen. Därför är kontrollen mot dokumentationen den viktigaste delen. Nästa gång läser jag dokumentationen först och ber sedan AI:n skriva koden.

## Konton och autentisering (Inlämningsuppgift 2)

Shoppen har två inloggningar, och båda går via backend med OAuth 2.0.

| | Kunder | Admin |
|---|---|---|
| Tjänst | Google (OpenID Connect) | GitHub (OAuth 2.0) |
| Scope | `openid email profile` | `read:user` |
| Vem får logga in | Alla med Google-konto | Bara användarna i `ADMIN_GITHUB_LOGINS` |
| Identifieras på | Googles `sub` | GitHubs `id` |
| Shoppens inloggning | JWT i httpOnly-cookie `session`, 8 h | JWT i httpOnly-cookie `token`, 8 h (24 h lokalt) |

### Inloggningsflödet
1. Användaren klickar på "Logga in med Google/GitHub". Länken går till min server.
2. Servern skapar `state` och en PKCE-verifier, sparar dem i httpOnly-cookies (10 minuter) och skickar användaren till tjänsten med minsta möjliga scope.
3. Användaren loggar in hos tjänsten, som skickar tillbaka hen till callback-routen med en engångskod och `state`.
4. Servern kontrollerar `state` och byter koden mot token, med client secret och PKCE-verifier.
5. Servern tar reda på vem användaren är och validerar svaret med Zod. Hos Google läses ID-token och `iss`, `aud` och `exp` kontrolleras. Hos GitHub anropas `GET /user`.
6. Användaren hittas via `sub` (Google) eller `id` (GitHub), eller skapas vid första inloggningen. Admin måste dessutom finnas i `ADMIN_GITHUB_LOGINS`, annars får hen ett felmeddelande.
7. Servern skapar shoppens egen JWT, lägger den i en httpOnly-cookie och skickar tillbaka användaren till shoppen. Avbruten inloggning och fel från tjänsterna ger ett begripligt meddelande.

**Jag använder både `state` och PKCE.** `state` skyddar mot att någon lurar min callback att slutföra en inloggning som användaren aldrig startade (CSRF). PKCE skyddar mot att en stulen kod används av någon annan, eftersom koden är värdelös utan den hemliga verifiern.

### Tokens
| Token | Används till | Sparas | Giltighet |
|---|---|---|---|
| Kod från Google/GitHub | Bytas mot token | Sparas inte | Kort, engångs |
| Googles ID-token och access token | Läsa `sub`, e-post och namn. Access-token behövs inte. | Sparas inte | Ca 1 timme |
| GitHubs access token | Ett anrop till `GET /user` | Sparas inte | Används en gång och kastas |
| Shoppens JWT | Hålla användaren inloggad | httpOnly-cookie | 8 h (admin 24 h lokalt) |
| `state` och PKCE-verifier | Skydda en inloggning | httpOnly-cookies, raderas i callbacken | 10 minuter |
| Shoppens GitHub-token | Skapa och lista issues | Bara i `.env`/Render | 30 dagar |

Jag ber inte om någon refresh token, eftersom shoppen inte behöver tjänsternas data efter inloggningen. Signaturen på Googles ID-token kontrolleras inte separat, eftersom den hämtas direkt från Googles token-endpoint över HTTPS med min client secret. Innehållet valideras i stället.

### Session eller JWT
Jag valde **JWT i en httpOnly-cookie**, med samma 8 timmar för kunder och admin.
- **Ingen sessionslagring.** Servern kör på Renders gratisnivå och startar om efter inaktivitet, så sessioner i minnet skulle försvinna. Server-sessioner hade krävt en tabell i databasen.
- **Admin hade redan JWT**, så samma kod skyddar båda.
- **httpOnly** gör att JavaScript inte kan läsa cookien (XSS). Den är `secure` i produktion, och eftersom Vercel och Render ligger på olika domäner har den `SameSite=None` där.

**Nackdel jag har accepterat:** en JWT går inte att återkalla före utgångstiden. Utloggning raderar cookien i webbläsaren, men en stulen token fortsätter att gälla.

### Risker och spärrning
- **Stulen JWT.** Den gäller tills den går ut. För en kund är skadan liten, eftersom hen bara ser sina egna betalda ordrar. För admin är den större, eftersom admin ser alla ordrar och kan skapa issues, och därför är livslängden kort. `SameSite=None` gör att cookien skickas även från andra sajter, vilket jag väger upp med att CORS bara släpper in `CLIENT_URL` och att API:et tar JSON.
- **Spärra en JWT.** Det går inte att spärra en enskild token. `authenticateAdmin` verifierar bara signaturen och slår inte upp admin i databasen, så att ta bort någon ur `ADMIN_GITHUB_LOGINS` stoppar bara nya inloggningar. Det enda som stänger befintliga tokens direkt är att byta `SESSION_TOKEN_SECRET`, vilket loggar ut alla.
- **Tjänsternas tokens** sparas aldrig, så det finns inget att stjäla ur databasen. Stjäls shoppens GitHub-token spärras den direkt på GitHub. Skadan är redan begränsad, eftersom den bara har *Issues: Read and write* på ett repo och går ut efter 30 dagar. Läcker en client secret återställs den hos Google respektive GitHub och byts i Render.
- **Identitet.** GitHub-användarnamn kan byta ägare, så admin sparas och känns igen på GitHubs `id`. Kunder känns igen på Googles `sub` och inte på e-postadressen.
- **Session eller JWT.** Session passar när åtkomst måste kunna stängas direkt, till exempel för admin, och när det finns en databas att lagra den i. JWT passar när servern ska vara tillståndslös eller köra på flera instanser, och när en kort livslängd räcker. För admin hade en session varit starkare, men en JWT med 8 timmars livslängd räcker för en butik av den här storleken.

### Kundkonton
Kunder kan bara logga in med Google. Det finns ingen inloggning med lösenord för kunder, så en Google-inloggning kan inte krocka med ett befintligt konto. Kunden känns igen på Googles `sub` och inte på e-postadressen, eftersom en e-postadress inte bevisar vem som äger kontot. Lägger jag senare till ett andra sätt att logga in slås inte konton ihop automatiskt på e-postadressen. Admin har kvar sin inloggning med lösenord vid sidan av GitHub.

### Issues från adminsidan
Admin rapporterar fel via ett formulär. Servern skapar issuen via GitHubs REST-API med shoppens egen token, så GitHub visar shoppens konto som författare. Därför skriver servern in vilken admin som rapporterade den. Adminsidan listar repots öppna issues med länk till GitHub. Båda routerna kräver admininloggning (401 annars), och fel från GitHub blir ett begripligt meddelande (502).

### Orderbekräftelse via e-post (Labb 8)
När Stripes webhook har markerat en order som betald skickar servern en bekräftelse via Resend, med ordernummer i ämnesraden, kundens namn, produkter med antal och pris samt totalsumma, som html och text. Kundens uppgifter escapas i HTML:en.
- **En bekräftelse per order:** mejlet skickas bara första gången ordern markeras som betald, och dessutom har varje utskick `Idempotency-Key: order-confirmation/<orderns id>`. Skickar Stripe samma webhook igen får kunden inget nytt mejl.
- **Misslyckat mejl stoppar inte ordern:** felet loggas och webhooken svarar ändå 200.
- **Timeout och validering:** anropet har timeout och Resends svar valideras med Zod. Bara `emailAdapter.ts` känner till Resends adress och nyckel.
