# BJJ Gryf Dębica — trzy szablony landing page

- `dist/index.html` — Arena: ciemna strona z dużym zdjęciem treningu i żółtym akcentem.
- `dist/klub.html` — Klub: jasny układ z kolażem zdjęć, dla nowych klubowiczów i rodzin.
- `dist/trener.html` — Trener: oferta 1:1 i portret Marcina na pierwszym planie.

Każda wersja ma grafik BJJ, sekcję treningów personalnych, prezentację trenera, kontakt i wszystkie trzy wskazane profile Facebooka. Pasek na górze służy porównaniu projektów; można go usunąć po wyborze wersji docelowej.

## Uruchomienie

Strony są statyczne, bez instalowania zależności. Uruchom `python3 -m http.server 4173 --directory dist`, a następnie otwórz `http://localhost:4173`. Można też otworzyć pliki HTML bezpośrednio. Fonty Barlow i Barlow Condensed są pobierane z Google Fonts; bez sieci użyte będą fonty zastępcze.

## Edycja

Wspólne treści i grafik: `dist/app.js`. Styl i układy wariantów: `dist/style.css`. Zdjęcia i herb: `dist/assets/`. Promocyjny panel treningów 1:1 jest kompozycją HTML/CSS z prawdziwym zdjęciem Marcina. Wersja PNG: `dist/assets/treningi-indywidualne-gryf.png`.

## Dane

Źródło: katalog `materialy-gryf`, stan 25.09.2026. Środowe No-Gi początkujących: **18:00**, potwierdzone przez użytkownika. Godzina zakończenia tych zajęć nie została podana; w grafiku widnieje tylko rozpoczęcie. Pozostałe godziny zgodnie z grafik.md. Treningi personalne po umówieniu, bez deklarowania sobót.

Telefon Marcina: **690 012 036**. Jedyny e-mail: **marcinb88@interia.pl** — potwierdzone przez użytkownika. Brak cytatów z piosenki. Zakres wyłącznie BJJ. Bez wymyślonych cen, opinii i aktualnego rankingu.

Linki telefoniczne i mailowe otwierają odpowiednie aplikacje użytkownika; strona nie zawiera formularza ani systemu rezerwacji.
