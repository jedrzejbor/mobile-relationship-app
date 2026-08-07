import {
  CAR_CLICKER_UPGRADES,
  CAR_CLICKER_UPGRADES_BY_ID,
  INITIAL_CAR_CLICKER_UPGRADE_LEVELS,
} from './upgrades';
import type {
  CarClickerState,
  CarClickerOfflineIncomeFeedback,
  CarClickerTierProgress,
  CarClickerUpgradeCategory,
  CarClickerUpgradeDefinition,
  CarClickerUpgradeId,
  CarClickerUpgradeLevels,
  CarClickerUpgradePurchaseResult,
  CarClickerUpgradeView,
} from './types';

const BASE_PER_CLICK = 1;
const BASE_PER_SECOND = 0;
const BASE_CAR_TIER = 1;

const CAR_TIER_THRESHOLDS = [0, 8, 20, 40, 70] as const;
const MAX_CAR_TIER = CAR_TIER_THRESHOLDS.length;
export const MAX_OFFLINE_INCOME_SECONDS = 4 * 60 * 60;

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
  return CAR_CLICKER_UPGRADES_BY_ID[upgradeId];
}

export function getCarClickerUpgradeLevel(
  levels: CarClickerUpgradeLevels,
  upgradeId: CarClickerUpgradeId,
) {
  return levels[upgradeId] ?? 0;
}

export function calculateTotalUpgradeLevels(levels: CarClickerUpgradeLevels) {
  return Object.values(levels).reduce((sum, level) => sum + level, 0);
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
  const totalUpgradeLevels = calculateTotalUpgradeLevels(levels);

  return CAR_TIER_THRESHOLDS.reduce(
    (tier, threshold, index) =>
      totalUpgradeLevels >= threshold ? index + 1 : tier,
    BASE_CAR_TIER,
  );
}

export function getCarTierProgress(
  levels: CarClickerUpgradeLevels,
): CarClickerTierProgress {
  const currentLevelTotal = calculateTotalUpgradeLevels(levels);
  const currentTier = calculateCarTier(levels);
  const currentTierThreshold = CAR_TIER_THRESHOLDS[currentTier - 1] ?? 0;
  const nextTierThreshold = CAR_TIER_THRESHOLDS[currentTier] ?? null;
  const nextTier = currentTier < MAX_CAR_TIER ? currentTier + 1 : null;

  if (nextTierThreshold === null) {
    return {
      currentTier,
      nextTier,
      currentLevelTotal,
      currentTierThreshold,
      nextTierThreshold,
      progressRatio: 1,
      levelsToNextTier: 0,
    };
  }

  const tierRange = nextTierThreshold - currentTierThreshold;
  const tierProgress = currentLevelTotal - currentTierThreshold;
  const progressRatio = Math.max(0, Math.min(tierProgress / tierRange, 1));

  return {
    currentTier,
    nextTier,
    currentLevelTotal,
    currentTierThreshold,
    nextTierThreshold,
    progressRatio,
    levelsToNextTier: Math.max(nextTierThreshold - currentLevelTotal, 0),
  };
}

export function getUpgradeView(
  state: CarClickerState,
  upgrade: CarClickerUpgradeDefinition,
): CarClickerUpgradeView {
  const level = getCarClickerUpgradeLevel(state.upgrades, upgrade.id);
  const isMaxLevelReached =
    upgrade.maxLevel !== undefined && level >= upgrade.maxLevel;
  const nextCost = isMaxLevelReached
    ? 0
    : calculateUpgradeCost(upgrade, level);
  const missingCash = Math.max(nextCost - state.cash, 0);

  return {
    upgrade,
    level,
    nextCost,
    isAffordable: !isMaxLevelReached && state.cash >= nextCost,
    isMaxLevelReached,
    missingCash,
  };
}

export function getUpgradeViews(
  state: CarClickerState,
  category?: CarClickerUpgradeCategory,
) {
  return CAR_CLICKER_UPGRADES.filter(
    (upgrade) => category === undefined || upgrade.category === category,
  )
    .map((upgrade) => getUpgradeView(state, upgrade))
    .sort(compareUpgradeViews);
}

export function compareUpgradeViews(
  first: CarClickerUpgradeView,
  second: CarClickerUpgradeView,
) {
  if (first.isMaxLevelReached !== second.isMaxLevelReached) {
    return first.isMaxLevelReached ? 1 : -1;
  }

  if (first.isAffordable !== second.isAffordable) {
    return first.isAffordable ? -1 : 1;
  }

  if (first.nextCost !== second.nextCost) {
    return first.nextCost - second.nextCost;
  }

  return first.upgrade.name.localeCompare(second.upgrade.name);
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

export function calculatePassiveIncome(
  perSecond: number,
  elapsedSeconds: number,
) {
  return Math.max(perSecond, 0) * Math.max(elapsedSeconds, 0);
}

export function collectPassiveIncome(
  state: CarClickerState,
  elapsedSeconds: number,
): CarClickerState {
  const income = calculatePassiveIncome(state.perSecond, elapsedSeconds);

  if (income <= 0) {
    return state;
  }

  return {
    ...state,
    cash: state.cash + income,
    totalEarnedCash: state.totalEarnedCash + income,
  };
}

export function calculateOfflineElapsedSeconds(
  savedAt: number,
  now = Date.now(),
) {
  const elapsedSeconds = (now - savedAt) / 1000;

  return Math.min(
    Math.max(elapsedSeconds, 0),
    MAX_OFFLINE_INCOME_SECONDS,
  );
}

export function collectOfflineIncome(
  state: CarClickerState,
  savedAt: number,
  now = Date.now(),
): {
  feedback: CarClickerOfflineIncomeFeedback | null;
  state: CarClickerState;
} {
  const elapsedSeconds = calculateOfflineElapsedSeconds(savedAt, now);
  const earnedCash = calculatePassiveIncome(state.perSecond, elapsedSeconds);

  if (earnedCash <= 0) {
    return {
      feedback: null,
      state,
    };
  }

  return {
    feedback: {
      earnedCash,
      elapsedSeconds,
    },
    state: {
      ...state,
      cash: state.cash + earnedCash,
      totalEarnedCash: state.totalEarnedCash + earnedCash,
    },
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
