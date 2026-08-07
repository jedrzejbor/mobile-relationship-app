import { useMemo, useReducer } from 'react';

import {
  getCarTierProgress,
  getUpgradeViews,
} from './economy';
import {
  carClickerReducer,
  createInitialCarClickerSessionState,
} from './reducer';
import type {
  CarClickerUpgradeCategory,
  CarClickerUpgradeCategoryFilter,
  CarClickerUpgradeId,
} from './types';

export function useCarClickerGame() {
  const [sessionState, dispatch] = useReducer(
    carClickerReducer,
    undefined,
    createInitialCarClickerSessionState,
  );
  const { game, purchaseFeedback, selectedUpgradeCategory } = sessionState;
  const tierProgress = useMemo(
    () => getCarTierProgress(game.upgrades),
    [game.upgrades],
  );
  const upgradeCategory: CarClickerUpgradeCategory | undefined =
    selectedUpgradeCategory === 'all'
      ? undefined
      : selectedUpgradeCategory;
  const upgradeViews = useMemo(
    () => getUpgradeViews(game, upgradeCategory),
    [game, upgradeCategory],
  );

  function collectClick() {
    dispatch({ type: 'collect_click' });
  }

  function purchaseUpgrade(upgradeId: CarClickerUpgradeId) {
    dispatch({ type: 'purchase_upgrade', upgradeId });
  }

  return {
    purchaseFeedback,
    state: game,
    selectedUpgradeCategory,
    tierProgress,
    upgradeViews,
    actions: {
      collectClick,
      purchaseUpgrade,
      selectUpgradeCategory: (category: CarClickerUpgradeCategoryFilter) =>
        dispatch({ type: 'select_upgrade_category', category }),
    },
  };
}
