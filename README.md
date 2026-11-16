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
Alla hemligheter ligger i `backend/.env` (gitignorerad). `.env.example` visar vilka variabler som behövs:

| Tjänst | Konto som behövs | Variabler |
|---|---|---|
| Leverantör | API-nyckel och bransch | `SUPPLIER_API_URL`, `SUPPLIER_API_KEY`, `SUPPLIER_API_TIMEOUT_MS`, `SUPPLIER_BRANSCH` |
| Algolia | Gratiskonto med ett index | `ALGOLIA_APP_ID`, `ALGOLIA_ADMIN_KEY`, `ALGOLIA_SEARCH_KEY`, `ALGOLIA_INDEX` |
| Stripe | Testläge | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| Supabase | Projekt med publik bucket | `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_BUCKET` |
| PostNord | Developer-portalen (sandbox) | `POSTNORD_API_KEY` |
| Google (OAuth) | OAuth-klient av typen Web application i Google Cloud Console | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `SESSION_TOKEN_SECRET`, `CLIENT_URL` |

### Testa integrationerna lokalt
- **Leverantör + Algolia:** Logga in som admin och anropa `POST /api/admin/products/import/csv` (eller `/xml`) för att hämta leverantörens katalog. Produkterna sparas i databasen och indexeras i Algolia. Om indexeringen misslyckas står det i svaret (`searchIndexed: false`), och då kan man köra om den separata omindexeringsrouten.
- **Stripe:** kör `stripe listen --forward-to localhost:<port>/api/stripe/webhook` och använd testkortet 4242 4242 4242 4242.
- **Supabase:** ladda upp en bild som admin på en produkt (JPEG/PNG, max 4 MB).
- **PostNord:** sandbox-nyckeln räcker. Testa med ett giltigt svenskt postnummer, t.ex. 111 22.
- **Google:** lägg callback-adressen (t.ex. `http://localhost:3000/api/auth/google/callback`) som *Authorized redirect URI* i Google Cloud och samma adress i `GOOGLE_CALLBACK_URL`. Gå sedan till shoppen och klicka på "Logga in". Se avsnittet om kundinloggning nedan.

## 2. Reflektion

### Integrationsmodeller och varför de passar
- **Leverantör – fil över HTTP.** Leverantören exponerar hela katalogen som en CSV- eller XML-export med API-nyckel. Servern hämtar filen, tolkar den (CSV i Windows-1252 med semikolon, XML i UTF-8) och upsertar produkterna på artikelnummer. Det är en hel katalog som ändras sällan, så ett svep på admins begäran passar bättre än ett anrop per produkt.
- **Algolia – SDK.** Servern använder `algoliasearch`: en admin-klient för att indexera och radera, en sök-klient för sökning. SDK:n sköter autentisering och format.
- **Stripe – redirect + webhook.** Kunden skickas till Stripes hosted checkout, men betalningsbeskedet kommer via webhook (`/api/stripe/webhook`), som sätter ordern till *Betald*, drar av lagret och uppdaterar indexet. Redirecten är bara navigation och webhooken är sanningen.
- **Supabase Storage – SDK/fil.** Servern laddar upp bildfiler och sparar sökväg och URL på produkten.
- **PostNord – REST.** Servern frågar efter ombud och leveranstid. Det är rena frågor och svar, så REST passar.

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

## Autentisering med Google (Labb 6)

Kunder loggar in med sitt Google-konto via OAuth 2.0 och OpenID Connect. 

### Inloggningsflödet
1. Kunden klickar på "Logga in med Google". Länken går till min server (`/api/auth/google`).
2. Servern skapar `state` och en PKCE-verifier, sparar dem i httpOnly-cookies (10 minuter) och skickar kunden till Google med scope `openid email profile`.
3. Kunden loggar in hos Google, som skickar tillbaka kunden till `/api/auth/google/callback` med en engångskod och `state`.
4. Servern kontrollerar att `state` matchar och byter koden mot tokens, med client secret och PKCE-verifier.
5. Servern läser ID-token och kontrollerar att den är utfärdad av Google (`iss`), till min app (`aud`) och inte har gått ut (`exp`), och validerar uppgifterna med Zod.
6. Kunden hittas via Googles `sub`, eller skapas vid första inloggningen. E-postadressen används inte för att känna igen kunden, och konton slås inte ihop.
7. Servern skapar shoppens egen JWT, lägger den i en httpOnly-cookie och skickar kunden tillbaka till shoppen.

**Jag använder både `state` och PKCE.**
- **`state`** skyddar mot att någon lurar min callback att slutföra en inloggning som kunden aldrig startade (CSRF). Matchar värdet inte det som sparades vid start avvisas inloggningen.
- **PKCE** skyddar mot att en stulen eller avlyssnad kod används av någon annan. Google får bara en hash av verifiern vid start, och originalet visas först när koden byts. Utan verifiern är koden värdelös.

### Tokens
| Token | Används till | Sparas | Giltighet |
|---|---|---|---|
| Googles kod | Bytas mot tokens | Sparas inte | Kort och kan bara användas en gång |
| Googles ID-token (JWT) | Läsa `sub`, e-post och namn | Sparas inte, kastas efter inloggningen | Ca 1 timme (jag använder den bara en gång) |
| Googles access token | Behövs inte, shoppen anropar inga Google-API:er | Sparas inte | Ca 1 timme |
| Shoppens egen JWT | Hålla kunden inloggad | httpOnly-cookie `session` i webbläsaren | 8 timmar |
| `state` och PKCE-verifier | Skydda en inloggning | httpOnly-cookies, raderas i callbacken | 10 minuter |

Jag ber inte om någon refresh token, eftersom shoppen inte behöver Googles data efter inloggningen. Signaturen på ID-token kontrolleras inte separat, eftersom den hämtas direkt från Googles token-endpoint över HTTPS med min client secret, och i stället valideras innehållet enligt punkt 5.

### Session eller JWT
Jag valde en **JWT i en httpOnly-cookie**. Den innehåller kundens eget id från min databas (inte Googles `sub`), e-post och namn. Servern verifierar den vid varje anrop till skyddade routes, och utan giltig cookie svarar Mina sidor 401.

**Varför JWT:**
- **Ingen sessionslagring.** Servern kör på Renders gratisnivå och startar om efter inaktivitet. Sessioner i serverns minne skulle försvinna, och server-sessioner hade krävt en tabell i databasen. JWT kräver bara att servern kan verifiera signaturen.
- **Samma mönster som admin.** Admin använder redan JWT i en httpOnly-cookie, så koden för att verifiera och skydda routes är densamma.
- **Skydd mot XSS.** En httpOnly-cookie kan inte läsas av JavaScript. Den är `secure` i produktion, och eftersom frontend (Vercel) och backend (Render) ligger på olika domäner har den `SameSite=None` där (lokalt `Lax`).

**Nackdel jag har accepterat:** en JWT går inte att återkalla före utgångstiden. Utloggningen raderar cookien i webbläsaren, men en stulen token skulle gälla i upp till 8 timmar. Jag bedömde att det var rimligt eftersom tokenen inte innehåller känsliga uppgifter och kunden bara kan läsa sina egna ordrar. Med server-sessioner hade jag kunnat stänga en session direkt, men det krävde mer komplexitet än butiken motiverar.
