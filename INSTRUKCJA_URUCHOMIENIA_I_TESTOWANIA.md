# Instrukcja uruchomienia i testowania projektu

Ten projekt to monorepo z aplikacja mobilna Expo/React Native oraz backendem NestJS.

- Aplikacja mobilna: `apps/mobile`
- API/backend: `apps/api`
- Wspoldzielone typy: `packages/shared`
- Lokalna infrastruktura: PostgreSQL, Redis i Adminer przez Docker Compose

## Wymagania

Zainstaluj lokalnie:

- Node.js 20 LTS
- pnpm
- Docker Desktop
- Expo Go na telefonie, jesli chcesz uruchamiac aplikacje na fizycznym urzadzeniu

Sprawdzenie wersji:

```bash
node -v
pnpm -v
docker --version
```

Projekt mobile po downgrade do Expo SDK 54 najlepiej uruchamiac na Node 20. Na Node 22 Expo CLI moze wywalic blad portu podobny do:

```txt
RangeError [ERR_SOCKET_BAD_PORT]: options.port should be >= 0 and < 65536
```

Jesli uzywasz `nvm`, przelacz Node tak:

```bash
nvm install 20
nvm use
```

W repo jest plik `.nvmrc`, wiec `nvm use` powinno automatycznie wybrac Node 20.

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

Tak, mozesz odpalic ten projekt na swoim telefonie przez Expo Go. Docker dalej dziala tylko na komputerze: trzyma PostgreSQL, Redis i Adminera. Telefon nie laczy sie bezposrednio z Dockerem ani baza danych. Telefon laczy sie z aplikacja Expo oraz z API uruchomionym na komputerze.

Schemat wyglada tak:

```txt
Telefon z Expo Go -> API na komputerze -> PostgreSQL/Redis w Dockerze
```

### 1. Zainstaluj Expo Go

Zainstaluj aplikacje Expo Go:

- iPhone: App Store
- Android: Google Play

### 2. Podlacz telefon i komputer do tej samej sieci

Telefon i komputer musza byc w tej samej sieci Wi-Fi. To najprostszy wariant, bo wtedy telefon moze wejsc na adres IP komputera.

### 3. Sprawdz adres IP komputera

Na macOS uruchom:

```bash
ipconfig getifaddr en0
```

Przykladowy wynik:

```txt
192.168.1.50
```

Ten adres bedzie potrzebny w konfiguracji aplikacji mobilnej.

Jesli ta komenda nic nie zwroci, sproboj:

```bash
ipconfig getifaddr en1
```

### 4. Ustaw API URL dla telefonu

W pliku `apps/mobile/.env` domyslnie jest:

```txt
EXPO_PUBLIC_API_URL=http://localhost:3001
```

Na telefonie `localhost` oznacza telefon, a nie komputer. Dlatego do testowania na fizycznym telefonie zmien `localhost` na IP komputera.

Przyklad:

```txt
EXPO_PUBLIC_API_URL=http://192.168.1.50:3001
```

Zostaw port `3001`, bo na nim dziala backend.

### 5. Uruchom Dockera i backend

W pierwszym terminalu:

```bash
pnpm db:up
pnpm dev:api
```

`pnpm db:up` uruchamia PostgreSQL, Redis i Adminera w Dockerze. `pnpm dev:api` uruchamia backend NestJS lokalnie na komputerze.

### 6. Uruchom Expo

W drugim terminalu:

```bash
pnpm dev:mobile
```

Po starcie Expo zobaczysz kod QR w terminalu.

### 7. Otworz aplikacje na telefonie

- iPhone: zeskanuj QR aparatem albo aplikacja Expo Go.
- Android: zeskanuj QR w aplikacji Expo Go.

Po zeskanowaniu kodu aplikacja powinna uruchomic sie w Expo Go.

## Jesli telefon nie laczy sie z aplikacja

Najpierw sprawdz tryb Expo. W terminalu Expo zwykle widac, czy dziala w trybie `lan`, `localhost` albo `tunnel`.

Najlepszy wariant lokalnie:

```bash
pnpm --filter mobile exec expo start --lan
```

Jesli telefon i komputer nie widza sie w sieci Wi-Fi, uzyj tunelu:

```bash
pnpm --filter mobile exec expo start --tunnel
```

Tunel pomaga z samym polaczeniem Expo Go z projektem. Nadal jednak API URL w `apps/mobile/.env` musi wskazywac na adres dostepny z telefonu. Najczesciej bedzie to IP komputera, np. `http://192.168.1.50:3001`.

## Wersja Expo po downgrade do SDK 54

Projekt mobile jest ustawiony na Expo SDK 54:

```txt
expo: ~54.0.36
react-native: 0.81.5
react: 19.1.0
```

Ta wersja jest wybrana po to, zeby projekt mogl dzialac w Expo Go na fizycznym telefonie.

Po zmianie wersji zaleznosci odpal:

```bash
pnpm install
pnpm --filter mobile typecheck
pnpm --filter mobile lint
```

Uruchamiaj Expo na Node 20:

```bash
nvm use
pnpm --filter mobile exec expo start --clear --lan
```

Jesli Expo Go dalej pokazuje komunikat o niezgodnej wersji:

1. Zatrzymaj Expo w terminalu.
2. Uruchom Expo z wyczyszczeniem cache:

```bash
pnpm --filter mobile exec expo start --clear --lan
```

3. Zamknij Expo Go na telefonie i otworz ponownie.
4. Zeskanuj nowy kod QR.

Stary proces Expo mogl trzymac bundle z poprzedniej wersji SDK, dlatego czyszczenie cache jest wazne po downgrade.

## Jesli aplikacja sie odpala, ale nie laczy sie z API

Jesli telefon dalej nie laczy sie z API, sprawdz:

- czy telefon i komputer sa w tej samej sieci Wi-Fi,
- czy API nadal dziala na porcie `3001`,
- czy firewall na komputerze nie blokuje polaczen przychodzacych,
- czy w adresie API jest IP komputera, a nie `localhost`.

Mozesz tez sprawdzic z telefonu w przegladarce, czy API jest widoczne. Wejdz na adres z IP komputera:

```txt
http://192.168.1.50:3001/api
```

Podmien `192.168.1.50` na swoje IP. Jesli telefon nie moze otworzyc tego adresu, problem jest w sieci, firewallu albo backend nie jest uruchomiony.

Po kazdej zmianie `apps/mobile/.env` zatrzymaj Expo i uruchom ponownie:

```bash
pnpm dev:mobile
```

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
