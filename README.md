# BJJ Gryf Dębica — strona klubowa

Instrukcja pracy z wersjami: [commitowanie zmian i publikacja na Cloudflare](COMMIT-I-PUBLIKACJA.md).

Docelowa strona rozwija wybrany wariant 2 „Klub”: jasne tło, czerwień herbu i żółte akcenty. Publiczny adres: https://bjjgryfdebica.pl/

## Zawartość

- Treningi grupowe: początkujący, młodzież i dorośli, Kids i Junior.
- Marcin Blezień: trener, czarny pas, osiągnięcia i afiliacja ZR Team.
- Treningi indywidualne i grafika promocyjna oparta na prawdziwym zdjęciu Marcina.
- Pełny tygodniowy grafik, filtrowany według grupy.
- Przygotowanie do pierwszego treningu i pytania z rozwijanymi odpowiedziami.
- Telefon, e-mail, mapa oraz trzy profile Facebooka.
- Samodzielna strona `/formularz` („Formularz zgłoszeniowy”) z formularzem (imię i nazwisko, telefon lub e-mail, rodzaj treningu, wiadomość) wysyłanym przez EmailJS na adres Marcina.
- Menu mobilne i stały pasek szybkiego kontaktu na telefonie.

## Edycja i podgląd

Strona jest statyczna. Pełna treść znajduje się w `dist/index.html` i działa również bez JavaScriptu. `dist/app.js` obsługuje menu, filtry, oznaczenie bieżącego dnia w strefie Europe/Warsaw i aktywną sekcję nawigacji. Styl: `dist/style.css`. Zdjęcia: `dist/assets/`.

```bash
python3 -m http.server 4173 --directory dist
```

Fonty Barlow i Barlow Condensed są hostowane lokalnie jako WOFF2; licencje OFL znajdują się w `dist/assets/fonts/`. Strona nie łączy się z Google Fonts. Zdjęcia i logotypy są dostarczane jako WebP; dla większych zdjęć używane są responsywne źródła. Zestaw 7 dotychczasowych obrazów zmniejszono z 1 268 957 B do 229 302 B (82%). Oryginały pozostały w katalogu assets. Grafika PNG do osobnego wykorzystania: `dist/assets/treningi-indywidualne-gryf.png`.

Poprzednie trzy projekty zachowano jako kopie kodu w `archive/szablony-v1/`. Nie są publikowane. Ich historyczne odwołania do obrazów wskazują na zasoby obecnego `dist/assets/`. Dawne adresy `/klub` i `/trener` przekierowują na stronę główną przez `dist/_redirects`; małe pliki HTML zapewniają też przekierowanie w zwykłym podglądzie statycznym.

## Cloudflare Workers

Worker: `bjj-gryf-debica`, konfiguracja: `wrangler.jsonc`. Pliki strony leżą w `dist/`; build nie jest potrzebny. Mały skrypt `src/index.js` obsługuje każde zapytanie przed plikami (`run_worker_first`):

- `www.bjjgryfdebica.pl` → 301 na `bjjgryfdebica.pl` (ścieżka i parametry zostają);
- adresy `*.workers.dev` (produkcyjny i podglądy z gałęzi `test`) dostają nagłówek `X-Robots-Tag: noindex`, żeby Google indeksował tylko domenę;
- resztę serwuje `env.ASSETS` razem z `dist/_redirects`.

Publikacja idzie automatycznie z GitHuba: `main` → produkcja, `test` → podgląd. Szczegóły: [COMMIT-I-PUBLIKACJA.md](COMMIT-I-PUBLIKACJA.md).

## SEO i podgląd linków

- Tytuł, opis i H1 zawierają „brazylijskie jiu-jitsu” i „Dębica”; nadtytuł w H1 wygląda jak dawny `.eyebrow`.
- Dane strukturalne JSON-LD w `dist/index.html`: `SportsClub` (adres, godziny z grafiku, telefon, logo), `Person` (Marcin) i `WebSite`. Przy zmianie grafiku popraw `openingHoursSpecification`.
- `dist/assets/og-gryf.jpg` (1200×630) — obraz podglądu linku na Facebooku i w komunikatorach, używany przez obie strony.
- `dist/robots.txt` i `dist/sitemap.xml` (strona główna, `/zajecia-dla-dzieci`, `/bjj-dla-doroslych`, `/wyniki` i `/formularz`). Przy nowej podstronie dopisz ją do mapy.
- `dist/bjj-dla-doroslych.html` (adres `/bjj-dla-doroslych`) — podstrona pod „sztuki walki Dębica”, „BJJ od zera”, „samoobrona”: 4 grupy od 14 lat (No-Gi start, Gi, No-Gi zaawansowani, sparingi) z godzinami, dlaczego BJJ, trener i wyniki, pierwszy trening z listą miejscowości, pytania. Przy zmianie grafiku popraw godziny także tutaj.
- Miejscowości, z których dojeżdżają klubowicze (Pilzno, Ropczyce, Sędziszów Małopolski, Brzeźnica, Pustków-Osiedle, Żyraków — podane przez klub 28.09.2026), są w `.travel-note` na trzech stronach i w `areaServed` w schema.org. Bez osobnych podstron na miejscowości.
- `dist/wyniki.html` (adres `/wyniki`) — wyniki zawodników od 2022 r., pogrupowane latami, od najnowszych; przy każdych zawodach źródło (artykuł debica24.pl lub post). Zasada (ustalona z klubem 28.09.2026): dzieci i młodzież tylko z imienia, dorośli z imienia i nazwiska; przy niepewnym wieku — samo imię. Nowe zawody dopisuj na górze właściwego roku (`<article class="result">`), klasy medali: `m1` złoto, `m2` srebro, `m3` brąz, `m-team` miejsce drużynowe. Linkują do niej: sekcja trenera i stopka strony głównej, sekcje trenera na podstronach.
- `dist/zajecia-dla-dzieci.html` (adres `/zajecia-dla-dzieci`) — podstrona pod zapytania rodziców („zajęcia dla dzieci Dębica”, „sztuki walki dla dzieci”): BJJ Kids i Junior z godzinami, korzyści, trener i starty juniorów, pierwszy trening, pytania rodziców. Jedyne zdjęcie z dziećmi to kadr z rolki klubu na FB z 6.08.2026 (`assets/dzieci-trening.webp`) — dzieci siedzą tyłem, bez rozpoznawalnych twarzy. Linkują do niej menu, karta „Dzieci” i FAQ strony głównej. Przy zmianie grafiku dzieci popraw godziny także tutaj. Korzysta z `app.js` (menu); nie używa klasy `.day`, bo `app.js` oznacza nią bieżący dzień w grafiku.

## Formularz zgłoszeniowy

Formularz jest na samodzielnej stronie `dist/formularz.html` (adres `/formularz`, w menu strony głównej „Formularz zgłoszeniowy”). Strona nie ma menu ani sekcji strony głównej — tylko herb z linkiem „← Strona klubu”, formularz i dane kontaktowe — więc link można wysyłać osobno (FB, SMS, kod QR). Sekcja `#kontakt` na stronie głównej prowadzi do niej przyciskiem. Stare adresy `/kontakt` i `/kontakt.html` przekierowują na `/formularz` (z zachowaniem parametrów) przez `dist/_redirects`. Formularz wysyła wiadomość z przeglądarki przez EmailJS (to samo konto co Business-website: public key `ZOBwl7GMNRPwk_VRu`, serwis `service_3ae2jx4`). Logika w `dist/formularz.js` (ładowany tylko na tej stronie, razem z biblioteką EmailJS). Szablon **`template_cyeoxc6`** ma w panelu EmailJS adresata `marcinb88@interia.pl` i zmienne `{{name}}`, `{{contact}}`, `{{training}}`, `{{message}}`; pole Reply-To: `{{reply_to}}` (wypełniane tylko, gdy w kontakcie podano e-mail). Parametr `?trening=<slug>` wybiera od razu opcję z listy (slug z atrybutu `data-slug`: `kids`, `junior`, `nogi-poczatkujacy`, `nogi-zaawansowani`, `gi`, `sparingi`, `indywidualny`, `nie-wiem`); tak działa „Umów trening 1:1” → `/formularz?trening=indywidualny`. Bez JavaScriptu formularz nie wysyła wiadomości; telefon i e-mail obok pozostają dostępne.

Strony nie otworzysz pod `/formularz` przez `python3 -m http.server` (tylko jako `/formularz.html`), a przekierowania z `_redirects` tam nie działają. Zachowanie jak na Cloudflare (razem z `src/index.js`) daje `npx wrangler@4.141.0 dev --port 8791`. Starszy Wrangler 4.92 wymaga dopisania `--compatibility-date 2026-05-22`.

## Dane

Źródło: `materialy-gryf`, stan 25.09.2026. Środowe No-Gi początkujących o **18:00** potwierdził użytkownik. Godzina zakończenia nie została podana, więc widnieje tylko rozpoczęcie. Pozostałe godziny zgodnie z materiałami. Personalne po umówieniu, bez deklarowania sobót. Telefon: **690 012 036**; jedyny e-mail: **marcinb88@interia.pl**. Bez cytatów z piosenki, wymyślonych cen, opinii lub aktualnego rankingu.

## Sprawdzenie wersji docelowej

Sprawdzono widoki 1440, 900, 780, 720, 390 i 320 px, załadowanie zdjęć, kotwice, menu mobilne (otwieranie, zamykanie, Escape), filtry grafiku i odnośniki z kart grup, FAQ oraz dostępność treści bez JavaScriptu. Grafik zawiera 11 treningów tygodniowo: 2 dla początkujących, 4 dziecięce, 7 młodzieżowo-dorosłych (w tym 2 początkujące).
