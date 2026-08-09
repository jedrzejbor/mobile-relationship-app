import type {
  CarClickerCarAssetId,
  CarClickerLocationAssetId,
} from './assets';

export type CarClickerCarId = 'starter';
export type CarClickerLocationId = 'dealership';

export type CarClickerUnlockRequirement =
  | {
      type: 'default';
    }
  | {
      type: 'cash';
      value: number;
    }
  | {
      type: 'tier';
      value: number;
    };

export type CarClickerCarDefinition = {
  id: CarClickerCarId;
  name: string;
  description: string;
  assetId: CarClickerCarAssetId;
  unlockRequirement: CarClickerUnlockRequirement;
};

export type CarClickerLocationDefinition = {
  id: CarClickerLocationId;
  name: string;
  description: string;
  assetId: CarClickerLocationAssetId;
  passiveIncomeMultiplier: number;
  unlockRequirement: CarClickerUnlockRequirement;
};

export type CarClickerGarageState = {
  currentCar: CarClickerCarId;
  currentLocation: CarClickerLocationId;
  unlockedCars: readonly CarClickerCarId[];
  unlockedLocations: readonly CarClickerLocationId[];
};

export const DEFAULT_CAR_CLICKER_CAR_ID = 'starter' satisfies CarClickerCarId;
export const DEFAULT_CAR_CLICKER_LOCATION_ID =
  'dealership' satisfies CarClickerLocationId;

export const CAR_CLICKER_CARS = [
  {
    id: 'starter',
    name: 'Starter Hatch',
    description: 'Pierwsza fura gracza, gotowa do podstawowego tuningu.',
    assetId: 'starter',
    unlockRequirement: { type: 'default' },
  },
] as const satisfies readonly CarClickerCarDefinition[];

export const CAR_CLICKER_LOCATIONS = [
  {
    id: 'dealership',
    name: 'Salon dealera',
    description: 'Pierwsza dostepna lokacja runtime do testowania bonusow.',
    assetId: 'dealership',
    passiveIncomeMultiplier: 1.45,
    unlockRequirement: { type: 'default' },
  },
] as const satisfies readonly CarClickerLocationDefinition[];

export const INITIAL_CAR_CLICKER_GARAGE_STATE = {
  currentCar: DEFAULT_CAR_CLICKER_CAR_ID,
  currentLocation: DEFAULT_CAR_CLICKER_LOCATION_ID,
  unlockedCars: [DEFAULT_CAR_CLICKER_CAR_ID],
  unlockedLocations: [DEFAULT_CAR_CLICKER_LOCATION_ID],
} as const satisfies CarClickerGarageState;

export const CAR_CLICKER_CARS_BY_ID = CAR_CLICKER_CARS.reduce(
  (carsById, car) => ({
    ...carsById,
    [car.id]: car,
  }),
  {} as Record<CarClickerCarId, CarClickerCarDefinition>,
);

export const CAR_CLICKER_LOCATIONS_BY_ID = CAR_CLICKER_LOCATIONS.reduce(
  (locationsById, location) => ({
    ...locationsById,
    [location.id]: location,
  }),
  {} as Record<CarClickerLocationId, CarClickerLocationDefinition>,
);

export function getCarClickerCarById(carId: CarClickerCarId) {
  return CAR_CLICKER_CARS_BY_ID[carId];
}

export function getCarClickerLocationById(locationId: CarClickerLocationId) {
  return CAR_CLICKER_LOCATIONS_BY_ID[locationId];
}
