import { useEffect, useMemo, useReducer, useRef } from 'react';

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
  const lastPassiveIncomeTickAtRef = useRef<number | null>(null);
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
    if (game.perSecond <= 0) {
      lastPassiveIncomeTickAtRef.current = null;
      return undefined;
    }

    lastPassiveIncomeTickAtRef.current = Date.now();

    const intervalId = setInterval(() => {
      const tickedAt = Date.now();
      const lastTickedAt = lastPassiveIncomeTickAtRef.current ?? tickedAt;
      const elapsedSeconds = (tickedAt - lastTickedAt) / 1000;

      lastPassiveIncomeTickAtRef.current = tickedAt;

      dispatch({
        type: 'collect_passive_income',
        elapsedSeconds,
      });
    }, PASSIVE_INCOME_TICK_MS);

    return () => {
      lastPassiveIncomeTickAtRef.current = null;
      clearInterval(intervalId);
    };
  }, [game.perSecond]);

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
