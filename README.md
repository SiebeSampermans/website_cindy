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

## Benodigd

1. Installeer Node.js 20 of nieuwer.
2. Voer `npm install` uit.
3. Kopieer `.env.example` naar `.env.local`.
4. Vul de databank- en mailinstellingen in.
5. Start lokaal met `npm run dev`.

## Belangrijke notities

- De bestaande PHP-bestanden zijn niet verwijderd en kunnen tijdelijk als fallback blijven bestaan.
- De nieuwe frontend gebruikt afbeeldingen uit `public/images`, gekopieerd uit de oude site.
- Voor mail gebruikt de app SMTP als dat is ingesteld; anders probeert ze lokale mailverzending te gebruiken.

## Volgende stap

De fundamenten zitten nu in React. De volgende fase is de volledige visuele make-over van de website.
