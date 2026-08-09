import * as SecureStore from 'expo-secure-store';

import { recalculateCarClickerState } from './economy';
import {
  CAR_CLICKER_UPGRADE_IDS,
  INITIAL_CAR_CLICKER_UPGRADE_LEVELS,
} from './upgrades';
import {
  CAR_CLICKER_CAR_IDS,
  CAR_CLICKER_LOCATION_IDS,
  DEFAULT_CAR_CLICKER_CAR_ID,
  DEFAULT_CAR_CLICKER_LOCATION_ID,
  INITIAL_CAR_CLICKER_GARAGE_STATE,
  type CarClickerCarId,
  type CarClickerGarageState,
  type CarClickerLocationId,
} from './garage';
import type {
  CarClickerLoadedSaveData,
  CarClickerPersistedGameState,
  CarClickerSaveData,
  CarClickerState,
  CarClickerUpgradeLevels,
} from './types';

const CAR_CLICKER_SAVE_KEY = 'car-clicker-save-v1';

export const CAR_CLICKER_SAVE_VERSION = 1;

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toNonNegativeNumber(value: unknown, fallback = 0) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(value, 0);
}

function toNonNegativeInteger(value: unknown, fallback = 0) {
  return Math.floor(toNonNegativeNumber(value, fallback));
}

function isKnownCarClickerCarId(value: unknown): value is CarClickerCarId {
  return (
    typeof value === 'string' &&
    CAR_CLICKER_CAR_IDS.includes(value as CarClickerCarId)
  );
}

function isKnownCarClickerLocationId(
  value: unknown,
): value is CarClickerLocationId {
  return (
    typeof value === 'string' &&
    CAR_CLICKER_LOCATION_IDS.includes(value as CarClickerLocationId)
  );
}

function parseUpgradeLevels(value: unknown): CarClickerUpgradeLevels {
  const source = isRecord(value) ? value : {};

  return CAR_CLICKER_UPGRADE_IDS.reduce(
    (levels, upgradeId) => ({
      ...levels,
      [upgradeId]: toNonNegativeInteger(source[upgradeId]),
    }),
    { ...INITIAL_CAR_CLICKER_UPGRADE_LEVELS },
  );
}

function parseGarageState(value: unknown): CarClickerGarageState {
  if (!isRecord(value)) {
    return INITIAL_CAR_CLICKER_GARAGE_STATE;
  }

  const currentCar = isKnownCarClickerCarId(value.currentCar)
    ? value.currentCar
    : DEFAULT_CAR_CLICKER_CAR_ID;
  const currentLocation = isKnownCarClickerLocationId(value.currentLocation)
    ? value.currentLocation
    : DEFAULT_CAR_CLICKER_LOCATION_ID;
  const unlockedCars = Array.isArray(value.unlockedCars)
    ? value.unlockedCars.filter(
        (carId): carId is CarClickerCarId => isKnownCarClickerCarId(carId),
      )
    : [];
  const unlockedLocations = Array.isArray(value.unlockedLocations)
    ? value.unlockedLocations.filter(
        (locationId): locationId is CarClickerLocationId =>
          isKnownCarClickerLocationId(locationId),
      )
    : [];

  return {
    currentCar,
    currentLocation,
    unlockedCars: unlockedCars.length > 0
      ? [...new Set(unlockedCars)]
      : [DEFAULT_CAR_CLICKER_CAR_ID],
    unlockedLocations: unlockedLocations.length > 0
      ? [...new Set(unlockedLocations)]
      : [DEFAULT_CAR_CLICKER_LOCATION_ID],
  };
}

function parseGameState(value: unknown): CarClickerState | null {
  if (!isRecord(value)) {
    return null;
  }

  return recalculateCarClickerState({
    cash: toNonNegativeNumber(value.cash),
    totalEarnedCash: toNonNegativeNumber(value.totalEarnedCash),
    upgrades: parseUpgradeLevels(value.upgrades),
    perClick: 1,
    perSecond: 0,
    selectedCarTier: toNonNegativeInteger(value.selectedCarTier, 1),
    garage: parseGarageState(value.garage),
  });
}

function createPersistedGameState(
  game: CarClickerState,
): CarClickerPersistedGameState {
  return {
    cash: game.cash,
    totalEarnedCash: game.totalEarnedCash,
    upgrades: game.upgrades,
    selectedCarTier: game.selectedCarTier,
    garage: game.garage,
  };
}

export function createCarClickerSaveData(
  game: CarClickerState,
  savedAt = Date.now(),
): CarClickerSaveData {
  return {
    saveVersion: CAR_CLICKER_SAVE_VERSION,
    savedAt,
    game: createPersistedGameState(game),
  };
}

export function serializeCarClickerSaveData(
  game: CarClickerState,
  savedAt = Date.now(),
) {
  return JSON.stringify(createCarClickerSaveData(game, savedAt));
}

export function parseCarClickerSaveData(
  rawSave: string | null,
): CarClickerLoadedSaveData | null {
  if (!rawSave) {
    return null;
  }

  try {
    const saveData: unknown = JSON.parse(rawSave);

    if (!isRecord(saveData) || saveData.saveVersion !== CAR_CLICKER_SAVE_VERSION) {
      return null;
    }

    const game = parseGameState(saveData.game);

    if (!game) {
      return null;
    }

    return {
      saveVersion: CAR_CLICKER_SAVE_VERSION,
      savedAt: toNonNegativeNumber(saveData.savedAt),
      game,
    };
  } catch {
    return null;
  }
}

export async function loadCarClickerSave() {
  return (await loadCarClickerSaveData())?.game ?? null;
}

export async function loadCarClickerSaveData() {
  try {
    const rawSave = await SecureStore.getItemAsync(CAR_CLICKER_SAVE_KEY);

    return parseCarClickerSaveData(rawSave);
  } catch {
    return null;
  }
}

export async function saveCarClickerState(game: CarClickerState) {
  try {
    await SecureStore.setItemAsync(
      CAR_CLICKER_SAVE_KEY,
      serializeCarClickerSaveData(game),
    );

    return true;
  } catch {
    return false;
  }
}
