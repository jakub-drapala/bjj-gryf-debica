# Commitowanie zmian i publikowanie strony Gryfa

## Gdzie pracować

Repozytorium strony znajduje się w podkatalogu `landing-gryf`, a nie w katalogu z materiałami klubu. Wszystkie poniższe polecenia wykonuj stąd:

```bash
cd /home/jakub-drapala/projects/stronka-bjjgryf/landing-gryf
```

Strona produkcyjna: [bjj-gryf-debica.jakubdrapala.workers.dev](https://bjj-gryf-debica.jakubdrapala.workers.dev/).

Konfiguracja Cloudflare: `wrangler.jsonc`. Nazwa Workera: `bjj-gryf-debica`. Publikowany jest katalog `dist/`. To strona statyczna: pliki w `dist/` są tutaj **źródłem strony**, należy je commitować i nie trzeba uruchamiać builda.

Stan sprawdzony 25.09.2026: gałąź `main`, brak skonfigurowanego zdalnego repozytorium Git. Istnieją niezatwierdzone zmiany obejmujące rozwiniętą stronę i konfigurację Cloudflare. Wcześniejsze wdrożenia Cloudflare wykonywano bezpośrednio z plików roboczych, więc ostatni commit nie odzwierciedla jeszcze całej opublikowanej strony.

## 1. Zmień odpowiednie pliki

| Plik | Zawartość |
| --- | --- |
| `dist/index.html` | Treść, grafik, kontakt, metadane i struktura strony |
| `dist/style.css` | Kolory, układ, typografia i wersja mobilna |
| `dist/app.js` | Menu, filtry grafiku i oznaczenie bieżącego dnia |
| `dist/fonts.css` | Lokalne fonty |
| `dist/assets/` | Zdjęcia, herb, grafika promocyjna i fonty z licencjami |
| `dist/_redirects` | Przekierowania starych adresów szablonów |
| `wrangler.jsonc` | Konfiguracja wdrożenia na Cloudflare |

Przy zmianie CSS lub JavaScriptu zwiększ numer przy odpowiednim odnośniku w `dist/index.html`, np. `style.css?v=4` na `style.css?v=5`. Numery CSS i JS mogą być różne. Dla zmienianych zdjęć lub fontów można użyć nowej nazwy pliku i zaktualizować odnośniki.

## 2. Sprawdź zmiany lokalnie

```bash
git status --short
git diff --stat
git diff
git diff --check
node --check dist/app.js
python3 -m http.server 4173 --directory dist
```

Otwórz [lokalny podgląd](http://localhost:4173). Serwer zatrzymasz skrótem `Ctrl+C`. `node --check` sprawdza składnię JS, nie zastępuje kontroli działania strony.

Zakres kontroli dopasuj do zmiany. Przy większych zmianach sprawdź:

- wygląd na komputerze i telefonie, bez poziomego przewijania;
- menu mobilne, kotwice i rozwijane pytania;
- filtry grafiku: wszystkie — 11 treningów, początkujący — 2, dzieci — 4, młodzież i dorośli — 7;
- środowe No-Gi początkujących o **18:00**;
- telefon **690 012 036**, e-mail **marcinb88@interia.pl** i linki Facebooka;
- ładowanie zdjęć i fontów.

Powyższe liczby zajęć opisują obecny grafik; przy jego zmianie zaktualizuj także tekst domyślnego licznika w HTML i dokumentację. `git diff` nie pokazuje treści nowych, nieśledzonych plików — obejrzyj je osobno albo w podglądzie zmian przygotowanych do commita.

## 3. Zapisz commit

Najpierw przygotuj tylko pliki należące do danej zmiany. Przykład dla poprawki wyglądu:

```bash
git add dist/index.html dist/style.css
git diff --cached --stat
git diff --cached
git diff --cached --check
git commit -m "Przyciemnij sekcję kontaktową"
git status --short
git log -1 --oneline
```

Jeśli zmieniasz zdjęcia, skrypty lub dokumentację, dodaj również te pliki. Commit powinien opisywać konkretny efekt, np. `Popraw grafik BJJ na telefonach`.

### Pierwszy commit obecnego stanu

Ponieważ aktualna strona ma dużo dotąd niezatwierdzonych zmian, po ich przeglądzie można zapisać cały obecny stan:

```bash
git add .gitignore wrangler.jsonc README.md COMMIT-I-PUBLIKACJA.md dist/ archive/
git diff --cached --stat
git diff --cached --check
git diff --cached
git commit -m "Rozwiń wariant Klub i skonfiguruj publikację na Cloudflare"
git status --short
```

`archive/` zawiera kod poprzednich projektów i nie jest publikowane. `.gitignore` wyklucza m.in. `.wrangler/`, `node_modules/` i lokalne pliki środowiska. Nie dodawaj tokenów ani danych logowania do repozytorium.

## 4. Opublikuj na Cloudflare

Commit i wdrożenie to osobne czynności. **Wrangler publikuje aktualne pliki z dysku, nie zawartość wskazanego commita.** Przed publikacją upewnij się, że wszystkie zmiany do wdrożenia są zatwierdzone i nie edytuj ich do zakończenia wdrożenia.

```bash
git status --short
git rev-parse HEAD
npx wrangler@4.92.0 whoami
npx wrangler@4.92.0 deploy --dry-run --config wrangler.jsonc
npx wrangler@4.92.0 deploy --config wrangler.jsonc
```

Brak wyniku `git status --short` oznacza czyste drzewo robocze. `whoami` powinno pokazać konto Cloudflare używane do strony Gryfa. Jeżeli nie jesteś zalogowany:

```bash
npx wrangler@4.92.0 login
```

`npx` może pobrać podaną wersję Wranglera. Na obecnym komputerze można zamiast tego korzystać z narzędzia już zainstalowanego dla sklepu — zastąp `npx wrangler@4.92.0` poniższym początkiem polecenia:

```bash
node /home/jakub-drapala/projects/sklep-internetowy/prowadz-premium/node_modules/wrangler/bin/wrangler.js
```

Przykładowe pełne polecenie publikacji:

```bash
node /home/jakub-drapala/projects/sklep-internetowy/prowadz-premium/node_modules/wrangler/bin/wrangler.js deploy --config wrangler.jsonc
```

Poczekaj na zakończenie z kodem 0, komunikat `Deployed bjj-gryf-debica`, publiczny adres i `Current Version ID`. Zapisz identyfikator wersji razem z SHA commita w notatce wydania, jeśli potrzebujesz później powiązać wdrożenie z kodem. Sam komunikat o przesłaniu plików nie potwierdza zakończenia wdrożenia.

## 5. Sprawdź opublikowaną wersję

Otwórz publiczną stronę i sprawdź zmienioną sekcję. Przy problemie z pamięcią przeglądarki użyj twardego odświeżenia `Ctrl+Shift+R`.

Możesz też porównać pliki produkcyjne z lokalnymi:

```bash
curl -fsSL 'https://bjj-gryf-debica.jakubdrapala.workers.dev/' -o /tmp/gryf-live-index.html
cmp dist/index.html /tmp/gryf-live-index.html
curl -fsSL 'https://bjj-gryf-debica.jakubdrapala.workers.dev/style.css?v=4' -o /tmp/gryf-live-style.css
cmp dist/style.css /tmp/gryf-live-style.css
```

Zmień `v=4` na wartość aktualnie wpisaną w HTML. `cmp` bez komunikatu i z kodem 0 oznacza identyczne pliki. Jeśli pobieranie się nie powiedzie, nie traktuj pozostawionego wcześniej pliku w `/tmp` jako aktualnego wyniku. Dla zmienionego JS lub zdjęcia wykonaj analogiczne porównanie.

## Git push i automatyzacja

Obecnie `git remote -v` nie zwraca żadnego adresu. **Nie ma skonfigurowanego `origin` ani automatycznego wdrożenia po pushu.** Sam commit zapisuje historię lokalnie; publikacja odbywa się poleceniem Wrangler opisanym wyżej.

Jeśli później powstanie repozytorium GitHub, dodaj jego rzeczywisty adres jako `origin`, a następnie wykonaj `git push -u origin main`. Nie używaj adresu repozytorium sklepu. Automatyczne wdrożenie wymaga osobnej konfiguracji workflow i sekretów Cloudflare — sam push go nie uruchomi.

Plik `.openai/hosting.json` dotyczy wcześniejszego prywatnego podglądu Sites. Nie służy do tego procesu publikacji i wdrożenie Wrangler go nie aktualizuje.

## Jak cofnąć błędną zmianę

Najpierw upewnij się, że drzewo robocze jest czyste. Jeśli błąd pochodzi z pojedynczego zwykłego commita, znajdź jego SHA i utwórz commit odwracający zmianę:

```bash
git status --short
git log -5 --oneline
git revert SHA_BLEDNEGO_COMMITA
```

`SHA_BLEDNEGO_COMMITA` zastąp rzeczywistym SHA z historii. W razie konfliktów rozwiąż je przed dalszą pracą. Następnie sprawdź stronę i ponownie wykonaj publikację oraz weryfikację z kroków 4–5. Revert zachowuje historię. Nie używaj `git reset --hard` do rutynowego wycofywania wdrożeń.

**Zalecana kolejność:** edycja → lokalna kontrola → przegląd zmian → commit → deploy → kontrola strony publicznej.
