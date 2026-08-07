import * as SecureStore from 'expo-secure-store';

import { recalculateCarClickerState } from './economy';
import {
  CAR_CLICKER_UPGRADE_IDS,
  INITIAL_CAR_CLICKER_UPGRADE_LEVELS,
} from './upgrades';
import type {
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
    perClick: toNonNegativeNumber(value.perClick, 1),
    perSecond: toNonNegativeNumber(value.perSecond),
    upgrades: parseUpgradeLevels(value.upgrades),
    selectedCarTier: toNonNegativeInteger(value.selectedCarTier, 1),
  });
}

export function createCarClickerSaveData(
  game: CarClickerState,
): CarClickerSaveData {
  return {
    saveVersion: CAR_CLICKER_SAVE_VERSION,
    savedAt: Date.now(),
    game,
  };
}

export function parseCarClickerSaveData(
  rawSave: string | null,
): CarClickerSaveData | null {
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
  try {
    const rawSave = await SecureStore.getItemAsync(CAR_CLICKER_SAVE_KEY);

    return parseCarClickerSaveData(rawSave)?.game ?? null;
  } catch {
    return null;
  }
}

export async function saveCarClickerState(game: CarClickerState) {
  try {
    await SecureStore.setItemAsync(
      CAR_CLICKER_SAVE_KEY,
      JSON.stringify(createCarClickerSaveData(game)),
    );
  } catch {
    // Storage failure should not block the gameplay loop.
  }
}
