import { useCallback, useMemo, useReducer } from 'react';

import {
  getCarTierProgress,
  getUpgradeViews,
} from './economy';
import {
  carClickerReducer,
  createInitialCarClickerSessionState,
} from './reducer';
import { useCarClickerSave } from './use-car-clicker-save';
import { usePassiveIncomeTicker } from './use-passive-income-ticker';
import type {
  CarClickerState,
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
  const { game, purchaseFeedback, selectedUpgradeCategory, tierFeedback } =
    sessionState;
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
  const hydrateGame = useCallback((savedGame: CarClickerState) => {
    dispatch({ type: 'hydrate_game', game: savedGame });
  }, []);

  useCarClickerSave({
    game,
    onHydrate: hydrateGame,
  });

  usePassiveIncomeTicker({
    isEnabled: game.perSecond > 0,
    onTick: (elapsedSeconds) => {
      dispatch({
        type: 'collect_passive_income',
        elapsedSeconds,
      });
    },
  });

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
    tierFeedback,
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
