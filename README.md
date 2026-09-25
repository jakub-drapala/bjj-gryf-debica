# BJJ Gryf Dębica — strona klubowa

Instrukcja pracy z wersjami: [commitowanie zmian i publikacja na Cloudflare](COMMIT-I-PUBLIKACJA.md).

Docelowa strona rozwija wybrany wariant 2 „Klub”: jasne tło, czerwień herbu i żółte akcenty. Publiczny adres: https://bjj-gryf-debica.jakubdrapala.workers.dev/

## Zawartość

- Treningi grupowe: początkujący, młodzież i dorośli, Kids i Junior.
- Marcin Blezień: trener, czarny pas, osiągnięcia i afiliacja ZR Team.
- Treningi indywidualne i grafika promocyjna oparta na prawdziwym zdjęciu Marcina.
- Pełny tygodniowy grafik, filtrowany według grupy.
- Przygotowanie do pierwszego treningu i pytania z rozwijanymi odpowiedziami.
- Telefon, e-mail, mapa oraz trzy profile Facebooka.
- Formularz kontaktowy (imię i nazwisko, telefon lub e-mail, rodzaj treningu, wiadomość) wysyłany przez EmailJS na adres Marcina.
- Menu mobilne i stały pasek szybkiego kontaktu na telefonie.

## Edycja i podgląd

Strona jest statyczna. Pełna treść znajduje się w `dist/index.html` i działa również bez JavaScriptu. `dist/app.js` obsługuje menu, filtry, oznaczenie bieżącego dnia w strefie Europe/Warsaw i aktywną sekcję nawigacji. Styl: `dist/style.css`. Zdjęcia: `dist/assets/`.

```bash
python3 -m http.server 4173 --directory dist
```

Fonty Barlow i Barlow Condensed są hostowane lokalnie jako WOFF2; licencje OFL znajdują się w `dist/assets/fonts/`. Strona nie łączy się z Google Fonts. Zdjęcia i logotypy są dostarczane jako WebP; dla większych zdjęć używane są responsywne źródła. Zestaw 7 dotychczasowych obrazów zmniejszono z 1 268 957 B do 229 302 B (82%). Oryginały pozostały w katalogu assets. Grafika PNG do osobnego wykorzystania: `dist/assets/treningi-indywidualne-gryf.png`.

Poprzednie trzy projekty zachowano jako kopie kodu w `archive/szablony-v1/`. Nie są publikowane. Ich historyczne odwołania do obrazów wskazują na zasoby obecnego `dist/assets/`. Dawne adresy `/klub` i `/trener` przekierowują na stronę główną przez `dist/_redirects`; małe pliki HTML zapewniają też przekierowanie w zwykłym podglądzie statycznym.

## Cloudflare Workers

Worker: `bjj-gryf-debica`, konfiguracja: `wrangler.jsonc`. Publikowany jest wyłącznie katalog `dist`; build nie jest potrzebny. Wymagane logowanie Wrangler do konta Cloudflare użytkownika.

```bash
node --check dist/app.js
npx wrangler@4.92.0 deploy --config wrangler.jsonc
```

Lokalnie można skorzystać z narzędzia zainstalowanego dla sklepu:

```bash
node /home/jakub-drapala/projects/sklep-internetowy/prowadz-premium/node_modules/wrangler/bin/wrangler.js deploy --config wrangler.jsonc
```

Automatyczna obsługa HTML udostępnia stronę główną pod `/`. Hosting Cloudflare jest niezależny od poprzedniego prywatnego podglądu Sites, który nie jest aktualizowany w tym procesie.

## Formularz kontaktowy

Sekcja `#kontakt` zawiera formularz wysyłany z przeglądarki przez EmailJS (to samo konto co Business-website: public key `ZOBwl7GMNRPwk_VRu`, serwis `service_3ae2jx4`). Logika w `dist/app.js`. Szablon **`template_cyeoxc6`** ma w panelu EmailJS adresata `marcinb88@interia.pl` i zmienne `{{name}}`, `{{contact}}`, `{{training}}`, `{{message}}`; pole Reply-To: `{{reply_to}}` (wypełniane tylko, gdy w kontakcie podano e-mail). Bez JavaScriptu formularz nie wysyła wiadomości; telefon i e-mail obok pozostają dostępne.

## Dane

Źródło: `materialy-gryf`, stan 25.09.2026. Środowe No-Gi początkujących o **18:00** potwierdził użytkownik. Godzina zakończenia nie została podana, więc widnieje tylko rozpoczęcie. Pozostałe godziny zgodnie z materiałami. Personalne po umówieniu, bez deklarowania sobót. Telefon: **690 012 036**; jedyny e-mail: **marcinb88@interia.pl**. Bez cytatów z piosenki, wymyślonych cen, opinii lub aktualnego rankingu.

## Sprawdzenie wersji docelowej

Sprawdzono widoki 1440, 900, 780, 720, 390 i 320 px, załadowanie zdjęć, kotwice, menu mobilne (otwieranie, zamykanie, Escape), filtry grafiku i odnośniki z kart grup, FAQ oraz dostępność treści bez JavaScriptu. Grafik zawiera 11 treningów tygodniowo: 2 dla początkujących, 4 dziecięce, 7 młodzieżowo-dorosłych (w tym 2 początkujące).
