# Car Clicker Game Assets

Ten katalog zawiera runtime assety gry Car Clicker. UI pozostaje implementowany w React Native, a obrazy sa tylko materialem gry: auta, lokacje, ulepszenia i referencje.

## Struktura

```text
assets/game/
  cars/<car-id>/stage-<level>-<name>.png
  locations/<location-id>.png
  upgrades/<upgrade-id>.png
  effects/<effect-id>.png
  references/ui/<reference-name>.png
```

`references/` nie jest zrodlem runtime UI. To tylko material porownawczy dla kierunku wizualnego.

## Nazewnictwo

- Uzywamy kebab-case w nazwach plikow i folderow.
- Id w TypeScript uzywa snake_case, jesli wynika z modelu gry, np. `better_tires`.
- Pliki samochodu trzymaja progres wizualny w nazwie: `stage-0-stock.png`, `stage-1-sport-wheels.png`.
- Pliki ulepszen odpowiadaja `CarClickerUpgradeId`, ale w kebab-case: `chip_tuning` -> `chip-tuning.png`.
- Pliki lokacji odpowiadaja `CarClickerLocationAssetId`: `old_garage` -> `old-garage.png`.

## Kontrakt Expo

Assety musza byc dodawane do `apps/mobile/src/features/car-clicker/assets.ts` przez statyczne `require`. Nie uzywamy dynamicznych stringow sciezek, bo Metro/Expo musi znac assety podczas bundlowania.

Kazde nowe auto powinno miec wpis w `CAR_CLICKER_CAR_ASSETS`:

- `id`
- `label`
- `stages`

Kazda lokacja powinna miec wpis w `CAR_CLICKER_LOCATION_ASSETS`:

- `id`
- `label`
- `passiveIncomeBonus`
- `source`

Kazde ulepszenie powinno miec wpis w `CAR_CLICKER_UPGRADE_ASSETS`:

- `id`
- `label`
- `source`

## Minimalny zestaw MVP

Pierwsze auto `starter`:

- `stage-0-stock.png`
- `stage-1-sport-wheels.png`
- `stage-2-lowered-stance.png`
- `stage-3-rear-wing.png`
- `stage-4-body-kit.png`
- `stage-max-track-tuned.png`

Pierwsza lokacja docelowa `old_garage`:

- `locations/old-garage.png`
- wpis `old_garage` w `CarClickerLocationAssetId`
- wpis `old_garage` w `CAR_CLICKER_LOCATION_ASSETS`

Aktualnie dostepny jest asset `dealership.png`, wiec `old_garage` pozostaje brakujacym runtime assetem do wygenerowania lub dodania w kolejnej iteracji.
