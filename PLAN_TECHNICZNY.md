# Plan techniczny aplikacji React Native / Expo

## 1. Cel aplikacji

Aplikacja mobilna dla par i znajomych, w której użytkownicy mogą:

- założyć konto i stworzyć swój profil,
- dodać drugą osobę do znajomych lub sparować się kodem/linkiem,
- wysyłać krótkie wiadomości, statusy, emoji lub małe notatki,
- udostępniać treść drugiej osobie w formie widgetu na ekranie głównym,
- docelowo obsługiwać wybrane funkcje systemowe iOS/Android, np. widgety, powiadomienia push, deep linki.

Pierwszy etap powinien skupić się na stabilnym fundamencie technicznym, ponieważ widgety wymagają integracji natywnej i nie powinny być projektowane jako zwykły ekran React Native.

## 2. Ważna decyzja: Expo, ale nie tylko Expo Go

Projekt warto postawić na Expo, ale od początku zakładać użycie development buildów.

Powód:

- Expo Go jest dobre do szybkiego prototypowania ekranów.
- Widgety, powiadomienia push, natywne rozszerzenia i integracje systemowe wymagają development builda.
- iOS widgety są realizowane przez WidgetKit / app extensions.
- Android widgety są realizowane przez Android App Widgets.
- Logika widgetu działa poza główną aplikacją, więc trzeba zaplanować współdzielone dane i odświeżanie.

Rekomendacja: Expo managed workflow z Continuous Native Generation, EAS Build i własnym development clientem.

Oficjalne punkty odniesienia:

- Tworzenie projektu Expo: https://docs.expo.dev/get-started/create-a-project/
- `create-expo-app`: https://docs.expo.dev/more/create-expo/
- Expo project workflow: https://docs.expo.dev/workflow/overview/
- Expo Router: https://docs.expo.dev/router/introduction/
- EAS Build: https://docs.expo.dev/build/introduction/
- Development builds: https://docs.expo.dev/eas/workflows/examples/create-development-builds/
- Expo Widgets dla iOS: https://docs.expo.dev/versions/latest/sdk/widgets/
- iOS app extensions w Expo/EAS: https://docs.expo.dev/build-reference/app-extensions/
- Config plugins: https://docs.expo.dev/modules/config-plugin-and-native-module-tutorial/

## 3. Proponowany stack

### Aplikacja mobilna

- Expo + React Native
- TypeScript
- Expo Router do nawigacji
- React Query / TanStack Query do danych z backendu
- Zustand do prostego stanu lokalnego
- React Hook Form + Zod do formularzy i walidacji
- Expo SecureStore na tokeny i dane wrażliwe
- Expo Notifications do powiadomień push
- Expo Linking / deep links do zaproszeń
- EAS Build do buildów Android/iOS

### Backend

Ponieważ aplikacja nie potrzebuje części webowej, lepszym wyborem niż Next.js będzie typowy backend API.

Rekomendacja: NestJS + PostgreSQL + Prisma.

Uzasadnienie:

- NestJS jest frameworkiem backendowym, a nie webowym,
- dobrze porządkuje większy backend przez moduły, serwisy i kontrolery,
- ma dobre wsparcie dla REST API, WebSocketów, kolejek i walidacji,
- PostgreSQL dobrze pasuje do relacji: użytkownicy, znajomi, zaproszenia, wiadomości, widgety,
- Prisma przyspiesza pracę z bazą i migracjami,
- łatwiej będzie później dodać panel admina jako osobny projekt, jeśli będzie potrzebny.

Proponowany backend:

- NestJS
- PostgreSQL
- Prisma ORM
- JWT auth + refresh tokens
- bcrypt/argon2 do haseł, jeśli robimy własne logowanie
- WebSocket Gateway do realtime, jeżeli będzie potrzebny
- Expo Push Notifications do powiadomień mobilnych
- Redis opcjonalnie do kolejek, rate limitów i sesji
- BullMQ opcjonalnie do zadań w tle, np. push notifications

Alternatywy:

- Supabase jako gotowy auth + Postgres, jeśli chcemy maksymalnie skrócić MVP.
- Firebase, jeśli priorytetem będzie offline-first i dokumentowa synchronizacja danych.
- Express + PostgreSQL, jeśli chcemy lżejszy backend, ale NestJS da lepszą strukturę przy rosnącej aplikacji.

### Widgety

#### iOS

Opcje:

- `expo-widgets` dla prostszych iOS home screen widgets oraz Live Activities.
- Własna app extension przez config plugin, jeśli `expo-widgets` okaże się zbyt ograniczone.

Ograniczenia:

- Widget iOS nie jest pełną aplikacją i nie może działać jak czat w czasie rzeczywistym.
- Widget pokazuje ostatnio zsynchronizowaną treść.
- Odświeżanie widgetu jest kontrolowane przez system iOS.
- Ekran blokady na iOS ma osobne ograniczenia rozmiaru i interakcji.

#### Android

Opcje:

- własny natywny moduł / config plugin dla Android App Widget,
- ewentualnie biblioteka community, ale trzeba ją sprawdzić przed decyzją produkcyjną.

Ograniczenia:

- Android widget wymaga natywnej konfiguracji XML/Kotlin/Java.
- Widget powinien czytać dane lokalnie zapisane przez aplikację.
- Interakcje są ograniczone do akcji typu tap/deep link/refresh.

### Synchronizacja danych dla widgetów

Widgety nie powinny bezpośrednio polegać na pełnym runtime React Native. Proponowany przepływ:

1. Użytkownik dostaje wiadomość od znajomego.
2. Backend zapisuje wiadomość.
3. Aplikacja odbiera zmianę przez realtime lub push notification.
4. Aplikacja zapisuje ostatnią treść widgetu do współdzielonego storage.
5. Aplikacja prosi system o odświeżenie widgetu, jeśli platforma to wspiera.
6. Widget renderuje ostatni zapisany stan.

To oznacza, że od początku trzeba rozdzielić:

- dane aplikacji,
- dane widoczne w widgetach,
- dane lokalne potrzebne offline,
- powiadomienia i odświeżanie.

## 4. Struktura projektu

Proponowana struktura repo:

```txt
apps/
  mobile/
  api/
packages/
  shared/
docs/
  decisions/
  api/
```

`apps/mobile` to aplikacja Expo, `apps/api` to backend NestJS, a `packages/shared` może później trzymać współdzielone typy, walidacje Zod i kontrakty API.

Proponowana struktura aplikacji mobilnej:

```txt
app/
  (auth)/
    sign-in.tsx
    sign-up.tsx
  (tabs)/
    index.tsx
    friends.tsx
    widget.tsx
    settings.tsx
  invite/
    [code].tsx
src/
  api/
    client.ts
    queries/
  components/
    ui/
    friends/
    messages/
    widget-preview/
  features/
    auth/
    friends/
    invites/
    messages/
    widgets/
  hooks/
  lib/
  stores/
  types/
  validation/
assets/
  images/
  icons/
docs/
  decisions/
  api/
```

Proponowana struktura backendu NestJS:

```txt
src/
  app.module.ts
  main.ts
  common/
    guards/
    decorators/
    filters/
    pipes/
  config/
  database/
    prisma.service.ts
  modules/
    auth/
    users/
    profiles/
    friendships/
    invites/
    messages/
    widgets/
    push-notifications/
  realtime/
prisma/
  schema.prisma
  migrations/
```

Na późniejszym etapie w aplikacji mobilnej, gdy dojdą natywne widgety:

```txt
modules/
  app-widget/
plugins/
  withAndroidWidget.ts
  withIosWidgetExtension.ts
```

W Expo managed workflow foldery `ios/` i `android/` najlepiej generować przez `expo prebuild`, a nie edytować ręcznie jako podstawowy sposób pracy. Jeśli natywnych zmian będzie dużo, można później świadomie przejść na bardziej bare workflow.

## 5. Komendy startowe projektu

Zakładany start aplikacji mobilnej:

```bash
npx create-expo-app@latest . --template default@sdk-57
npx expo install expo-dev-client
npx expo install expo-router react-native-safe-area-context react-native-screens
npm install @tanstack/react-query zustand zod react-hook-form
npx expo install expo-secure-store expo-notifications expo-linking expo-constants
npx eas-cli@latest login
npx eas-cli@latest build:configure
```

Jeżeli projekt ma używać npm, zostać przy npm. Jeżeli wolisz pnpm, decyzję trzeba podjąć od razu i trzymać jeden package manager.

Uwaga: w czasie przejściowym wersji Expo SDK warto podać szablon jawnie. Aktualna dokumentacja Expo zaleca `default@sdk-57`, jeśli nie zależy nam na Expo Go i od początku zakładamy development buildy.

Po konfiguracji:

```bash
npx expo start
npx eas-cli@latest build --profile development --platform android
npx eas-cli@latest build --profile development --platform ios
```

Do lokalnego builda iOS potrzebny jest macOS + Xcode. Do Androida potrzebny jest Android Studio + emulator lub fizyczne urządzenie.

Zakładany start backendu:

```bash
npm i -g @nestjs/cli
nest new apps/api
cd apps/api
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt
npm install argon2 class-validator class-transformer
npm install prisma @prisma/client
npx prisma init
```

Jeżeli projekt będzie monorepo, warto rozważyć pnpm workspaces albo npm workspaces. Na start można też prościej: najpierw utworzyć `apps/mobile`, potem `apps/api`, a workspace skonfigurować po pierwszym commicie.

## 6. Konfiguracja bazowa

### Pliki, które powinny powstać na starcie

- `app.json` albo `app.config.ts`
- `eas.json`
- `.env.example`
- `.gitignore`
- `tsconfig.json`
- `eslint.config.js`
- `prettier.config.js`
- `README.md`
- `docs/ARCHITEKTURA.md`
- `docs/DECYZJE_TECHNICZNE.md`

### Zmienne środowiskowe

Przykład:

```env
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_APP_SCHEME=
```

Przykład backendu:

```env
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
EXPO_ACCESS_TOKEN=
REDIS_URL=
```

W aplikacji mobilnej nie trzymamy sekretów backendowych. Mobile ma znać tylko publiczny adres API i publiczny scheme deep linków.

## 7. Model danych MVP

Minimalne tabele:

### `profiles`

- `id`
- `display_name`
- `avatar_url`
- `created_at`

### `friendships`

- `id`
- `requester_id`
- `receiver_id`
- `status`: `pending`, `accepted`, `blocked`
- `created_at`
- `accepted_at`

### `invites`

- `id`
- `created_by`
- `code`
- `expires_at`
- `used_by`
- `used_at`

### `messages`

- `id`
- `sender_id`
- `receiver_id`
- `body`
- `kind`: `text`, `emoji`, `status`
- `created_at`
- `read_at`

### `widget_states`

- `id`
- `owner_id`
- `source_user_id`
- `message_id`
- `display_text`
- `display_emoji`
- `theme`
- `updated_at`

`widget_states` to celowo osobny model. Widget nie powinien sam analizować całej historii czatu. Ma dostać gotowy, mały stan do wyświetlenia.

## 8. Ekrany MVP

1. Onboarding
2. Logowanie / rejestracja
3. Ekran główny z ostatnią wiadomością
4. Dodawanie znajomego kodem lub linkiem
5. Lista znajomych
6. Widok znajomego / partnera
7. Composer krótkiej wiadomości
8. Podgląd widgetu
9. Ustawienia widgetu
10. Ustawienia konta

Na MVP nie robić rozbudowanego chatu. Lepiej zbudować prosty, szybki przepływ: wybierz osobę, wpisz krótką wiadomość, wyślij, druga osoba widzi ją w aplikacji i docelowo w widgetcie.

## 9. Kolejność prac

### Etap 0: Fundament projektu

- utworzyć projekt Expo z TypeScript,
- skonfigurować Expo Router,
- dodać linting i formatting,
- skonfigurować EAS,
- utworzyć development build dla Androida i iOS,
- dodać `.env.example`,
- przygotować strukturę `src/`.

Efekt: aplikacja uruchamia się lokalnie i da się zbudować przez EAS.

### Etap 1: Auth i profile

- moduł `auth` w NestJS,
- rejestracja i logowanie przez REST API,
- JWT access token + refresh token,
- bezpieczne przechowywanie tokenów w Expo SecureStore,
- ekran logowania,
- ekran rejestracji,
- tabela `profiles`,
- automatyczne tworzenie profilu po rejestracji,
- ochrona ekranów zalogowanych.

Efekt: użytkownik może założyć konto i wejść do aplikacji.

### Etap 2: Zaproszenia i znajomi

- generowanie kodu zaproszenia,
- obsługa deep linku,
- akceptacja znajomości,
- lista znajomych,
- kontrola dostępu w backendzie przez guardy i zapytania po `userId`.

Efekt: dwie osoby mogą się połączyć.

### Etap 3: Wiadomości

- wysyłanie krótkiej wiadomości,
- odbieranie ostatniej wiadomości,
- realtime update,
- oznaczanie jako przeczytane,
- push notification po otrzymaniu wiadomości.

Efekt: aplikacja działa jako prosty kanał przesyłania krótkich treści.

### Etap 4: Widget preview w aplikacji

- ekran konfiguracji widgetu,
- wybór osoby,
- wybór stylu,
- podgląd stanu widgetu,
- zapis do `widget_states`.

Efekt: zanim powstanie natywny widget, mamy gotowy model danych i UI.

### Etap 5: Natywny widget iOS

- sprawdzić, czy `expo-widgets` wystarcza dla oczekiwanego UX,
- dodać widget na ekran główny iOS,
- zapisywać dane do storage dostępnego dla widgetu,
- odświeżać widget po zmianie wiadomości,
- przetestować warianty rozmiaru.

Efekt: iOS pokazuje ostatnią wiadomość w widgetcie.

### Etap 6: Natywny widget Android

- przygotować Android App Widget,
- dodać config plugin lub natywny moduł,
- zapisywać dane lokalne dla widgetu,
- obsłużyć tap w widget i przejście do aplikacji,
- przetestować różne launchery Androida.

Efekt: Android pokazuje ostatnią wiadomość w widgetcie.

### Etap 7: Stabilizacja

- testy jednostkowe logiki,
- testy flows auth/invites/messages,
- obsługa offline/error states,
- monitoring błędów,
- polityka prywatności,
- przygotowanie store listingów.

## 10. Ryzyka techniczne

### Widgety nie są realtime

Widgety systemowe nie są pełnym realtime UI. System może ograniczać częstotliwość odświeżania. Trzeba projektować UX tak, żeby był odporny na opóźnienia.

### Expo Go nie wystarczy

Od momentu wejścia w widgety, push notifications i app extensions trzeba używać development buildów.

### Różnice iOS/Android

Widget na iOS i widget na Androidzie będą miały wspólny model danych, ale osobną implementację natywną.

### Prywatność

Aplikacja będzie pokazywać prywatne wiadomości na ekranie głównym lub blokady. Trzeba dodać ustawienia:

- ukrywaj treść na zablokowanym ekranie,
- pokazuj tylko emoji,
- pokazuj tylko nadawcę,
- tryb prywatny,
- blokowanie użytkownika.

### Moderacja i nadużycia

Nawet aplikacja dla par/znajomych potrzebuje:

- blokowania osoby,
- usuwania znajomości,
- zgłoszenia nadużycia,
- limitów wysyłania wiadomości,
- zabezpieczenia przed spamem zaproszeń.

## 11. Proponowany MVP

Najmniejsza sensowna wersja:

- logowanie,
- profil,
- dodanie znajomego kodem,
- wysłanie krótkiej wiadomości,
- lista ostatnich wiadomości,
- push notification,
- ekran podglądu widgetu,
- pierwszy natywny widget tylko dla jednej platformy, najlepiej iOS albo Android, nie obu naraz.

Po MVP:

- druga platforma widgetu,
- motywy widgetów,
- emoji/reactions,
- zdjęcia,
- harmonogram wiadomości,
- streaks/liczniki,
- Live Activities na iOS, jeśli ma to sens produktowo.

## 12. Definition of Ready przed kodowaniem

Przed właściwym developmentem trzeba ustalić:

- nazwa aplikacji,
- bundle id iOS, np. `com.twojadomena.app`,
- package name Android, np. `com.twojadomena.app`,
- package manager: npm/pnpm/yarn,
- backend: NestJS + PostgreSQL + Prisma,
- hosting API i bazy danych,
- czy pierwszym widgetem ma być iOS czy Android,
- czy aplikacja ma być tylko dla par, czy ogólnie dla znajomych,
- czy wiadomości mają być ulotne, czy z historią,
- jakie dane można pokazywać na ekranie blokady.

## 13. Rekomendowana decyzja na start

Najrozsądniejszy start techniczny:

- Expo + TypeScript + Expo Router,
- EAS development builds od początku,
- NestJS + PostgreSQL + Prisma jako backend,
- najpierw aplikacyjny podgląd widgetu,
- potem natywny widget iOS,
- następnie Android App Widget,
- trzymać wspólny model `widget_states`, żeby implementacje platformowe były tylko rendererami gotowego stanu.

Taki układ pozwala szybko zacząć pracę nad aplikacją, ale nie zamyka drogi do natywnych funkcji, które będą kluczowe dla tego produktu.
