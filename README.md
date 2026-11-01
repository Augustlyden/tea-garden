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
