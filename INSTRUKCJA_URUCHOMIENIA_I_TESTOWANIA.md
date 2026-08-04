# Instrukcja uruchomienia i testowania projektu

Ten projekt to monorepo z aplikacja mobilna Expo/React Native oraz backendem NestJS.

- Aplikacja mobilna: `apps/mobile`
- API/backend: `apps/api`
- Wspoldzielone typy: `packages/shared`
- Lokalna infrastruktura: PostgreSQL, Redis i Adminer przez Docker Compose

## Wymagania

Zainstaluj lokalnie:

- Node.js
- pnpm
- Docker Desktop
- Expo Go na telefonie, jesli chcesz uruchamiac aplikacje na fizycznym urzadzeniu

Sprawdzenie wersji:

```bash
node -v
pnpm -v
docker --version
```

## Pierwsze uruchomienie projektu

Wszystkie komendy ponizej uruchamiaj z katalogu glownego projektu.

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
pnpm install
```

Podnies lokalna baze danych, Redis i Adminera:

```bash
pnpm db:up
```

Wygeneruj klienta Prisma i utworz tabele w bazie:

```bash
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate
```

Uruchom API:

```bash
pnpm dev:api
```

W drugim terminalu uruchom aplikacje mobilna:

```bash
pnpm dev:mobile
```

API powinno dzialac pod adresem:

```txt
http://localhost:3001/api
```

Adminer do podgladu bazy danych:

```txt
http://localhost:8080
```

Dane do Adminera:

```txt
System: PostgreSQL
Server: postgres
Username: postgres
Password: postgres
Database: widget_friends
```

## Codzienne uruchamianie

Jesli projekt byl juz skonfigurowany, zwykle wystarcza:

```bash
pnpm db:up
pnpm dev:api
pnpm dev:mobile
```

`pnpm dev:api` i `pnpm dev:mobile` najlepiej trzymac w osobnych terminalach.

Zatrzymanie kontenerow:

```bash
pnpm db:down
```

Podglad logow PostgreSQL:

```bash
pnpm db:logs
```

## Testowanie projektu

Sprawdzenie typow w calym monorepo:

```bash
pnpm typecheck
```

Lint w calym monorepo:

```bash
pnpm lint
```

Testy backendu:

```bash
pnpm --filter api test
```

Testy backendu w trybie watch:

```bash
pnpm --filter api test:watch
```

Pokrycie testami backendu:

```bash
pnpm --filter api test:cov
```

Testy e2e backendu:

```bash
pnpm --filter api test:e2e
```

W aplikacji mobilnej w tym momencie nie ma osobnego skryptu testow jednostkowych. Dla mobile sprawdzaj przede wszystkim:

```bash
pnpm --filter mobile typecheck
pnpm --filter mobile lint
```

oraz manualnie uruchom aplikacje przez Expo.

## Uruchomienie aplikacji na telefonie

Tak, mozesz odpalic ten projekt na swoim telefonie przez Expo.

1. Zainstaluj aplikacje Expo Go:
   - iPhone: App Store
   - Android: Google Play

2. Upewnij sie, ze komputer i telefon sa w tej samej sieci Wi-Fi.

3. Uruchom backend:

```bash
pnpm db:up
pnpm dev:api
```

4. Uruchom Expo w drugim terminalu:

```bash
pnpm dev:mobile
```

5. Po starcie Expo zobaczysz kod QR w terminalu.

6. Otworz aplikacje na telefonie:
   - iPhone: zeskanuj QR aparatem albo aplikacja Expo Go.
   - Android: zeskanuj QR w aplikacji Expo Go.

## Wazna uwaga o API na telefonie

W pliku `apps/mobile/.env` domyslnie jest:

```txt
EXPO_PUBLIC_API_URL=http://localhost:3001
```

Na telefonie `localhost` oznacza telefon, a nie komputer. Jesli aplikacja mobilna ma laczyc sie z API uruchomionym na komputerze, zmien ten adres na lokalny adres IP komputera w sieci Wi-Fi.

Przyklad:

```txt
EXPO_PUBLIC_API_URL=http://192.168.1.50:3001
```

Adres IP komputera sprawdzisz na macOS na przyklad tak:

```bash
ipconfig getifaddr en0
```

Po zmianie `apps/mobile/.env` zatrzymaj Expo i uruchom ponownie:

```bash
pnpm dev:mobile
```

Jesli telefon dalej nie laczy sie z API, sprawdz:

- czy telefon i komputer sa w tej samej sieci Wi-Fi,
- czy API nadal dziala na porcie `3001`,
- czy firewall na komputerze nie blokuje polaczen przychodzacych,
- czy w adresie API jest IP komputera, a nie `localhost`.

## Uruchomienie w przegladarce

Expo pozwala tez uruchomic aplikacje jako web:

```bash
pnpm --filter mobile web
```

To jest przydatne do szybkiego sprawdzania UI, ale najwazniejsze zachowanie aplikacji mobilnej warto testowac na telefonie albo emulatorze.

## Przydatne komendy

```bash
# mobile
pnpm dev:mobile
pnpm --filter mobile ios
pnpm --filter mobile android
pnpm --filter mobile web
pnpm --filter mobile typecheck
pnpm --filter mobile lint

# api
pnpm dev:api
pnpm --filter api test
pnpm --filter api test:e2e
pnpm --filter api typecheck
pnpm --filter api lint
pnpm --filter api prisma:migrate
pnpm --filter api prisma:studio

# infrastruktura
pnpm db:up
pnpm db:down
pnpm db:logs
```
