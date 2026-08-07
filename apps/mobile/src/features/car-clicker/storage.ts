import * as SecureStore from 'expo-secure-store';

import { recalculateCarClickerState } from './economy';
import {
  CAR_CLICKER_UPGRADE_IDS,
  INITIAL_CAR_CLICKER_UPGRADE_LEVELS,
} from './upgrades';
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
