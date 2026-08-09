import type {
  CarClickerCarAsset,
  CarClickerCarAssetId,
  CarClickerCarStageAsset,
  CarClickerLocationAsset,
  CarClickerLocationAssetId,
} from './assets';
import {
  getCarAsset,
  getCarStageAsset,
  getLocationAsset,
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

export type CarClickerGarageUnlockProgress = {
  cash: number;
  selectedCarTier: number;
  totalEarnedCash: number;
};

export type CarClickerGarageViewState = {
  garage: CarClickerGarageState;
  selectedCarTier: number;
};

export type CarClickerCarView = {
  asset: CarClickerCarAsset;
  definition: CarClickerCarDefinition;
  isCurrent: boolean;
  isUnlocked: boolean;
  stageAsset: CarClickerCarStageAsset;
};

export type CarClickerLocationView = {
  asset: CarClickerLocationAsset;
  definition: CarClickerLocationDefinition;
  isCurrent: boolean;
  isUnlocked: boolean;
};

export type CarClickerGarageView = {
  currentCar: CarClickerCarView;
  currentLocation: CarClickerLocationView;
  cars: readonly CarClickerCarView[];
  locations: readonly CarClickerLocationView[];
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

export const CAR_CLICKER_CAR_IDS = CAR_CLICKER_CARS.map(
  (car) => car.id,
) satisfies CarClickerCarId[];

export const CAR_CLICKER_LOCATION_IDS = CAR_CLICKER_LOCATIONS.map(
  (location) => location.id,
) satisfies CarClickerLocationId[];

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

export function isCarClickerCarUnlocked(
  garage: CarClickerGarageState,
  carId: CarClickerCarId,
) {
  return garage.unlockedCars.includes(carId);
}

export function isCarClickerLocationUnlocked(
  garage: CarClickerGarageState,
  locationId: CarClickerLocationId,
) {
  return garage.unlockedLocations.includes(locationId);
}

export function isUnlockRequirementMet(
  requirement: CarClickerUnlockRequirement,
  progress: CarClickerGarageUnlockProgress,
) {
  switch (requirement.type) {
    case 'default':
      return true;
    case 'cash':
      return progress.totalEarnedCash >= requirement.value;
    case 'tier':
      return progress.selectedCarTier >= requirement.value;
  }
}

function mergeUnlockedIds<TId extends string>(
  currentIds: readonly TId[],
  nextIds: readonly TId[],
) {
  return [...new Set([...currentIds, ...nextIds])];
}

export function refreshCarClickerGarageUnlocks(
  garage: CarClickerGarageState,
  progress: CarClickerGarageUnlockProgress,
): CarClickerGarageState {
  const unlockedCars = mergeUnlockedIds(
    garage.unlockedCars,
    CAR_CLICKER_CARS.filter((car) =>
      isUnlockRequirementMet(car.unlockRequirement, progress),
    ).map((car) => car.id),
  );
  const unlockedLocations = mergeUnlockedIds(
    garage.unlockedLocations,
    CAR_CLICKER_LOCATIONS.filter((location) =>
      isUnlockRequirementMet(location.unlockRequirement, progress),
    ).map((location) => location.id),
  );

  return {
    ...garage,
    currentCar: unlockedCars.includes(garage.currentCar)
      ? garage.currentCar
      : DEFAULT_CAR_CLICKER_CAR_ID,
    currentLocation: unlockedLocations.includes(garage.currentLocation)
      ? garage.currentLocation
      : DEFAULT_CAR_CLICKER_LOCATION_ID,
    unlockedCars,
    unlockedLocations,
  };
}

export function selectCarClickerCar(
  garage: CarClickerGarageState,
  carId: CarClickerCarId,
): CarClickerGarageState {
  if (
    garage.currentCar === carId ||
    !isCarClickerCarUnlocked(garage, carId)
  ) {
    return garage;
  }

  return {
    ...garage,
    currentCar: carId,
  };
}

export function selectCarClickerLocation(
  garage: CarClickerGarageState,
  locationId: CarClickerLocationId,
): CarClickerGarageState {
  if (
    garage.currentLocation === locationId ||
    !isCarClickerLocationUnlocked(garage, locationId)
  ) {
    return garage;
  }

  return {
    ...garage,
    currentLocation: locationId,
  };
}

export function getCarClickerGarageView(
  state: CarClickerGarageViewState,
): CarClickerGarageView {
  const cars = CAR_CLICKER_CARS.map((car) => ({
    asset: getCarAsset(car.assetId),
    definition: car,
    isCurrent: car.id === state.garage.currentCar,
    isUnlocked: state.garage.unlockedCars.includes(car.id),
    stageAsset: getCarStageAsset(car.assetId, state.selectedCarTier),
  }));
  const locations = CAR_CLICKER_LOCATIONS.map((location) => ({
    asset: getLocationAsset(location.assetId),
    definition: location,
    isCurrent: location.id === state.garage.currentLocation,
    isUnlocked: state.garage.unlockedLocations.includes(location.id),
  }));

  return {
    currentCar: cars.find((car) => car.isCurrent) ?? cars[0],
    currentLocation:
      locations.find((location) => location.isCurrent) ?? locations[0],
    cars,
    locations,
  };
}
