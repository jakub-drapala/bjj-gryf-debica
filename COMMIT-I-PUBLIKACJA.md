# Commitowanie zmian i publikowanie strony Gryfa

## Jak to działa

| Gałąź | Środowisko | Adres |
| --- | --- | --- |
| `test` | podgląd do sprawdzania zmian | https://test-bjj-gryf-debica.jakubdrapala.workers.dev/ |
| `main` | produkcja | https://bjjgryfdebica.pl/ |

Repozytorium: `git@github.com:jakub-drapala/bjj-gryf-debica.git` (katalog `landing-gryf`, nie katalog z materiałami klubu). Cloudflare Workers Builds pilnuje obu gałęzi. **Push wystarczy do publikacji**: po `git push` na `test` Cloudflare uruchamia `npx wrangler preview`, a po pushu na `main` uruchamia `npx wrangler deploy`. Każda z tych publikacji trwa ok. 30–60 s. Ręczny `wrangler deploy` nie jest potrzebny.

Zasada: **zmiany zawsze najpierw na `test`**, a na `main` trafiają tylko sprawdzone commity. `main` przesuwamy bez merge commitów (`--ff-only`), dzięki czemu obie gałęzie mają tę samą historię.

Adresy podglądu (`*.workers.dev`) dostają nagłówek `noindex` (`src/index.js`), więc Google ich nie indeksuje. Do wysyłania ludziom służy tylko domena.

```bash
cd /home/jakub-drapala/projects/stronka-bjjgryf/landing-gryf
```

## 1. Zacznij od aktualnego `test`

```bash
git checkout test
git pull --ff-only
git merge --ff-only origin/main   # na wypadek poprawki wrzuconej prosto na main
```

## 2. Zmień pliki

| Plik | Zawartość |
| --- | --- |
| `dist/index.html` | Treść, grafik, kontakt, metadane, dane strukturalne JSON-LD |
| `dist/formularz.html` | Samodzielna strona `/formularz` — „Formularz zgłoszeniowy” |
| `dist/formularz.js` | Wysyłka formularza przez EmailJS i wybór treningu z `?trening=` |
| `dist/style.css` | Kolory, układ, typografia, wersja mobilna |
| `dist/app.js` | Menu, filtry grafiku, bieżący dzień, film z YouTube po kliknięciu |
| `dist/assets/` | Zdjęcia (WebP), herb, okładka filmu, `og-gryf.jpg`, fonty |
| `dist/_redirects` | Stare adresy szablonów i `/kontakt` → `/formularz` |
| `dist/robots.txt`, `dist/sitemap.xml` | Dla Google; nową podstronę dopisz do mapy |
| `src/index.js` | Przekierowanie `www` → domena i `noindex` na workers.dev |
| `wrangler.jsonc` | Konfiguracja Workera, domeny i podglądów (blok `previews` jest wymagany) |

Przy zmianie CSS lub JS zwiększ numer w odnośniku, np. `style.css?v=12` → `?v=13` — **w obu plikach HTML**, bo `formularz.html` też ładuje `style.css`. Zmienione zdjęcie najlepiej zapisać pod nową nazwą.

Przy zmianie grafiku zaktualizuj też: licznik zajęć w HTML, `openingHoursSpecification` w JSON-LD i sekcję „Dane” w README.

## 3. Sprawdź lokalnie

```bash
git status --short
git diff
git diff --check
for f in dist/app.js dist/formularz.js src/index.js; do node --check "$f"; done
npx -y wrangler@4.141.0 dev --port 8791
```

Otwórz http://localhost:8791 (tak jak na Cloudflare, razem z `/formularz` i przekierowaniami). Zatrzymanie: `Ctrl+C`.

Przy większych zmianach sprawdź:

- komputer i telefon, bez poziomego przewijania;
- menu mobilne, kotwice, rozwijane pytania, film (odtwarza się po kliknięciu);
- filtry grafiku: wszystkie — 11, początkujący — 2, dzieci — 4, młodzież i dorośli — 7;
- telefon **690 012 036**, e-mail i linki Facebooka.

## 4. Commit i push na `test`

```bash
git add <zmienione pliki>
git diff --cached
git commit -m "Opis efektu, np. Popraw grafik na telefonach"
git push
```

Po ok. minucie sprawdź podgląd: https://test-bjj-gryf-debica.jakubdrapala.workers.dev/ (`Ctrl+Shift+R`, jeśli widać starą wersję). Status i logi buildów: Cloudflare → Workers & Pages → `bjj-gryf-debica` → **Deployments** / **Builds**.

Na podglądzie **formularz wysyła prawdziwe maile do Marcina** — testowe zgłoszenie opisz jako test albo go nie wysyłaj.

## 5. Publikacja na produkcję

Gdy podgląd jest w porządku:

```bash
git checkout main
git pull --ff-only
git merge --ff-only test
git push
git checkout test
```

Jeśli `merge --ff-only` odmawia, `main` ma commit, którego nie ma na `test` — najpierw wróć na `test`, zrób `git merge --ff-only origin/main` (albo zwykły merge), sprawdź podgląd i powtórz.

## 6. Sprawdź produkcję

Po ok. minucie:

```bash
curl -fsSL https://bjjgryfdebica.pl/ | cmp - dist/index.html && echo "index.html zgodny"
curl -sI https://www.bjjgryfdebica.pl/ | grep -i -E '^(HTTP|location)'
```

Pierwsze polecenie bez błędu oznacza, że produkcja ma dokładnie lokalny `index.html`. Drugie powinno pokazać `301` i `location: https://bjjgryfdebica.pl/`. Zmieniony CSS/JS porównaj analogicznie, podając aktualny `?v=`.

Podgląd linku na Facebooku odświeżysz w [Sharing Debugger](https://developers.facebook.com/tools/debug/) → „Scrape Again” (Facebook trzyma stary obrazek w pamięci).

## Jak cofnąć błędną zmianę

```bash
git checkout test
git revert SHA_BLEDNEGO_COMMITA
git push
# sprawdź podgląd, potem krok 5
```

Revert zachowuje historię. Nie używaj `git reset --hard` ani `push --force` na `main`.

Awaryjnie, gdy strona produkcyjna jest zepsuta i nie ma czasu na revert: Cloudflare → `bjj-gryf-debica` → **Deployments** → przy poprzedniej wersji **Rollback**. Potem i tak zrób revert w Gicie, bo kolejny push na `main` nadpisze rollback.

## Nie commituj

Tokenów, haseł ani plików `.env` / `.dev.vars` (są w `.gitignore`). Repozytorium jest publiczne. Klucz EmailJS w `formularz.js` jest publiczny z założenia.
