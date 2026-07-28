# Widget Friends App

Monorepo dla aplikacji mobilnej Expo oraz backendu NestJS.

## Stack

- `apps/mobile`: Expo / React Native / TypeScript
- `apps/api`: NestJS / PostgreSQL / Prisma
- `packages/shared`: współdzielone typy i walidacje
- Docker Compose: PostgreSQL, Redis, Adminer

## Start lokalny

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
pnpm install
pnpm db:up
pnpm dev:api
pnpm dev:mobile
```

API działa domyślnie pod adresem:

```txt
http://localhost:3001/api
```

Adminer będzie dostępny pod adresem:

```txt
http://localhost:8080
```

Domyślne dane bazy lokalnej:

```txt
System: PostgreSQL
Server: postgres
Username: postgres
Password: postgres
Database: widget_friends
```

Z hosta lokalnego baza jest dostępna pod `localhost:55432`, żeby nie kolidować z lokalnym PostgreSQL ani innymi projektami.

## Uwagi

Expo uruchamiamy lokalnie poza Dockerem. Docker służy lokalnie do infrastruktury backendowej: PostgreSQL, Redis i narzędzia do podglądu bazy.
