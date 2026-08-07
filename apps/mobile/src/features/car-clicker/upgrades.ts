import type {
  CarClickerUpgradeDefinition,
  CarClickerUpgradeId,
  CarClickerUpgradeLevels,
} from './types';

export const CAR_CLICKER_UPGRADES: readonly CarClickerUpgradeDefinition[] = [
  {
    id: 'better_tires',
    name: 'Lepsze opony',
    description: 'Wieksza przyczepnosc daje stabilny bonus za kazde klikniecie.',
    category: 'power',
    baseCost: 25,
    costMultiplier: 1.18,
    perClickBonus: 1,
  },
  {
    id: 'chip_tuning',
    name: 'Chip tuning',
    description: 'Podkreca silnik i mocno zwieksza zarobek z klikniecia.',
    category: 'power',
    baseCost: 120,
    costMultiplier: 1.25,
    perClickBonus: 5,
  },
  {
    id: 'turbo',
    name: 'Turbo',
    description: 'Drogi upgrade dla wyraznego skoku mocy.',
    category: 'power',
    baseCost: 600,
    costMultiplier: 1.32,
    perClickBonus: 25,
  },
  {
    id: 'mechanic',
    name: 'Mechanik',
    description: 'Pracuje w garazu i generuje pierwszy dochod pasywny.',
    category: 'garage',
    baseCost: 80,
    costMultiplier: 1.2,
    perSecondBonus: 1,
  },
  {
    id: 'workshop',
    name: 'Warsztat',
    description: 'Rozbudowany garaz zwieksza staly przychod.',
    category: 'garage',
    baseCost: 450,
    costMultiplier: 1.28,
    perSecondBonus: 8,
  },
  {
    id: 'dealer',
    name: 'Dealer',
    description: 'Siec sprzedazy daje wysoki dochod pasywny w pozniejszej grze.',
    category: 'garage',
    baseCost: 2500,
    costMultiplier: 1.35,
    perSecondBonus: 45,
  },
] as const;

export const CAR_CLICKER_UPGRADE_IDS = CAR_CLICKER_UPGRADES.map(
  (upgrade) => upgrade.id,
) satisfies CarClickerUpgradeId[];

export const CAR_CLICKER_UPGRADES_BY_ID = CAR_CLICKER_UPGRADES.reduce(
  (upgradesById, upgrade) => ({
    ...upgradesById,
    [upgrade.id]: upgrade,
  }),
  {} as Record<CarClickerUpgradeId, CarClickerUpgradeDefinition>,
);

export const INITIAL_CAR_CLICKER_UPGRADE_LEVELS =
  CAR_CLICKER_UPGRADE_IDS.reduce(
    (levels, upgradeId) => ({
      ...levels,
      [upgradeId]: 0,
    }),
    {} as CarClickerUpgradeLevels,
  );
