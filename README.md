# t Snuffeltje React migratie

Deze map bevat nu een nieuwe Next.js codebasis naast de bestaande PHP-site. De bedoeling is:

- eerst de huidige website functioneel overzetten naar een React-framework
- databankverbinding en mailflow behouden
- daarna op deze basis een volledige redesign doen

## Wat is al gemigreerd

- publieke pagina's in React/Next.js
- homepage melding uit `tbl_melding`
- contactformulier met server-side mailverzending
- admin login met sessiecookie
- melding beheren
- gebruikers toevoegen, deactiveren en resetmail versturen
- resetpagina om wachtwoord opnieuw in te stellen

## Beheergedeelte (/admin)

Na het inloggen kan de eigenaar zelf aanpassen:

- **Teksten en foto's** van elke pagina (homepage, wie ben ik, trimsalon, huisregels, contact, footer). Elk veld kan terug naar de originele tekst gezet worden.
- **Afbeeldingen**: foto's uploaden (JPG, PNG, WEBP, GIF, max. 10 MB) en kiezen bij elk fotoveld. Een foto die nog gebruikt wordt kan niet verwijderd worden.
- **Gallerij**: foto's toevoegen, verwijderen, van volgorde veranderen en een beschrijving geven.
- **Popups**: titel, tekst, optionele foto en knop, op alle of gekozen pagina's, met start- en einddatum en hoe vaak een bezoeker ze ziet.
- **Mailtemplates**: onderwerp en tekst van de contactmail, een optionele bevestigingsmail naar de klant en de wachtwoord-resetmail, met voorbeeld en testmail.
- **Gebruikers**: toevoegen, bewerken, deactiveren, opnieuw activeren en een resetmail sturen.

Hoe het werkt:

- Teksten, popups, mailtemplates en gebruikers staan in een Postgres-databank (op Vercel: Storage → Neon, dan staat `DATABASE_URL` automatisch klaar). Alle tabellen worden automatisch aangemaakt bij het eerste gebruik (zie `lib/schema.js`); een lege databank is genoeg.
- De standaardteksten staan in `lib/content-registry.js`. Zolang er niets aangepast is, toont de site die. Als de databank onbereikbaar is, blijft de site werken met de standaardteksten.
- Geüploade afbeeldingen: op **Vercel** in Vercel Blob (maak in het Vercel-project een Blob store aan via Storage; dan staat `BLOB_READ_WRITE_TOKEN` automatisch klaar). Zonder die variabele komen ze in `UPLOAD_DIR` (standaard `./uploads`) en worden ze geserveerd via `/media/<bestand>`. Grote foto's worden in de browser verkleind voor de upload.
- De lijst van bestaande site-afbeeldingen (`lib/site-images.json`) wordt bij `npm run dev` en `npm run build` opnieuw gemaakt.
- Eerste admin aanmaken: stel `ADMIN_SETUP_CODE` in, open `/admin/login` en vul de setupcode in. Dat formulier verschijnt enkel zolang er nog geen enkele gebruiker bestaat.
- Wachtwoord resetten zonder mail: `npm run create-admin -- jouw@email.be Voornaam Achternaam` (gebruikt `DATABASE_URL` uit `.env.local` en vraagt het wachtwoord in de terminal).
- Inloggen gebeurt in `app/api/admin/login/route.js`: wachtwoord controleren en daarna de sessiecookie zetten. Tweestapsverificatie (2FA) kan later tussen die twee stappen worden toegevoegd.

## Benodigd

1. Installeer Node.js 20 of nieuwer.
2. Voer `npm install` uit.
3. Kopieer `.env.example` naar `.env.local`.
4. Vul `DATABASE_URL`, `ADMIN_SETUP_CODE`, `SESSION_SECRET` en de mailinstellingen in.
5. Start lokaal met `npm run dev`.

## Belangrijke notities

- De bestaande PHP-bestanden zijn niet verwijderd en kunnen tijdelijk als fallback blijven bestaan.
- De nieuwe frontend gebruikt afbeeldingen uit `public/images`, gekopieerd uit de oude site.
- Voor mail gebruikt de app SMTP als dat is ingesteld; anders probeert ze lokale mailverzending te gebruiken.

## Volgende stap

De fundamenten zitten nu in React. De volgende fase is de volledige visuele make-over van de website.
