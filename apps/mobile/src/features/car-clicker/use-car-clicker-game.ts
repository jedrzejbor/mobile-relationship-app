import { useEffect, useMemo, useReducer } from 'react';

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

const PASSIVE_INCOME_TICK_SECONDS = 1;
const PASSIVE_INCOME_TICK_MS = PASSIVE_INCOME_TICK_SECONDS * 1000;

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch({
        type: 'collect_passive_income',
        elapsedSeconds: PASSIVE_INCOME_TICK_SECONDS,
      });
    }, PASSIVE_INCOME_TICK_MS);

    return () => clearInterval(intervalId);
  }, []);

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
