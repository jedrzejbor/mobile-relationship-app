import {
  CAR_CLICKER_UPGRADES,
  INITIAL_CAR_CLICKER_UPGRADE_LEVELS,
} from './upgrades';
import type {
  CarClickerState,
  CarClickerUpgradeDefinition,
  CarClickerUpgradeId,
  CarClickerUpgradeLevels,
  CarClickerUpgradePurchaseResult,
} from './types';

const BASE_PER_CLICK = 1;
const BASE_PER_SECOND = 0;
const BASE_CAR_TIER = 1;

const CAR_TIER_THRESHOLDS = [0, 8, 20, 40, 70] as const;

export function createInitialCarClickerState(): CarClickerState {
  return recalculateCarClickerState({
    cash: 0,
    totalEarnedCash: 0,
    perClick: BASE_PER_CLICK,
    perSecond: BASE_PER_SECOND,
    upgrades: { ...INITIAL_CAR_CLICKER_UPGRADE_LEVELS },
    selectedCarTier: BASE_CAR_TIER,
  });
}

export function calculateUpgradeCost(
  upgrade: CarClickerUpgradeDefinition,
  currentLevel: number,
) {
  return Math.floor(upgrade.baseCost * upgrade.costMultiplier ** currentLevel);
}

export function getCarClickerUpgradeById(upgradeId: CarClickerUpgradeId) {
  return CAR_CLICKER_UPGRADES.find((upgrade) => upgrade.id === upgradeId);
}

export function getCarClickerUpgradeLevel(
  levels: CarClickerUpgradeLevels,
  upgradeId: CarClickerUpgradeId,
) {
  return levels[upgradeId] ?? 0;
}

export function calculatePerClick(levels: CarClickerUpgradeLevels) {
  return CAR_CLICKER_UPGRADES.reduce(
    (perClick, upgrade) =>
      perClick +
      (upgrade.perClickBonus ?? 0) * getCarClickerUpgradeLevel(levels, upgrade.id),
    BASE_PER_CLICK,
  );
}

export function calculatePerSecond(levels: CarClickerUpgradeLevels) {
  return CAR_CLICKER_UPGRADES.reduce(
    (perSecond, upgrade) =>
      perSecond +
      (upgrade.perSecondBonus ?? 0) *
        getCarClickerUpgradeLevel(levels, upgrade.id),
    BASE_PER_SECOND,
  );
}

export function calculateCarTier(levels: CarClickerUpgradeLevels) {
  const totalUpgradeLevels = Object.values(levels).reduce(
    (sum, level) => sum + level,
    0,
  );

  return CAR_TIER_THRESHOLDS.reduce(
    (tier, threshold, index) =>
      totalUpgradeLevels >= threshold ? index + 1 : tier,
    BASE_CAR_TIER,
  );
}

export function recalculateCarClickerState(
  state: CarClickerState,
): CarClickerState {
  return {
    ...state,
    perClick: calculatePerClick(state.upgrades),
    perSecond: calculatePerSecond(state.upgrades),
    selectedCarTier: calculateCarTier(state.upgrades),
  };
}

export function collectClickIncome(state: CarClickerState): CarClickerState {
  return {
    ...state,
    cash: state.cash + state.perClick,
    totalEarnedCash: state.totalEarnedCash + state.perClick,
  };
}

export function collectPassiveIncome(
  state: CarClickerState,
  elapsedSeconds: number,
): CarClickerState {
  const income = Math.floor(state.perSecond * Math.max(elapsedSeconds, 0));

  if (income <= 0) {
    return state;
  }

  return {
    ...state,
    cash: state.cash + income,
    totalEarnedCash: state.totalEarnedCash + income,
  };
}

export function purchaseCarClickerUpgrade(
  state: CarClickerState,
  upgradeId: CarClickerUpgradeId,
): CarClickerUpgradePurchaseResult {
  const upgrade = getCarClickerUpgradeById(upgradeId);

  if (!upgrade) {
    return {
      status: 'max_level_reached',
      state,
    };
  }

  const currentLevel = getCarClickerUpgradeLevel(state.upgrades, upgradeId);
  const isMaxLevelReached =
    upgrade.maxLevel !== undefined && currentLevel >= upgrade.maxLevel;

  if (isMaxLevelReached) {
    return {
      status: 'max_level_reached',
      state,
    };
  }

  const nextCost = calculateUpgradeCost(upgrade, currentLevel);

  if (state.cash < nextCost) {
    return {
      status: 'insufficient_cash',
      state,
    };
  }

  return {
    status: 'purchased',
    state: recalculateCarClickerState({
      ...state,
      cash: state.cash - nextCost,
      upgrades: {
        ...state.upgrades,
        [upgradeId]: currentLevel + 1,
      },
    }),
  };
}
