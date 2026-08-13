import { useCallback, useEffect, useMemo, useReducer } from 'react';

import {
  getCarTierProgress,
  getUpgradeViews,
} from './economy';
import {
  getCarClickerGarageView,
  type CarClickerCarId,
  type CarClickerLocationId,
} from './garage';
import type { NitroRushRunInput } from './nitro-rush';
import {
  carClickerReducer,
  createInitialCarClickerSessionState,
} from './reducer';
import { useCarClickerSave } from './use-car-clicker-save';
import { usePassiveIncomeTicker } from './use-passive-income-ticker';
import type {
  CarClickerOfflineIncomeFeedback,
  CarClickerState,
  CarClickerUpgradeCategory,
  CarClickerUpgradeCategoryFilter,
  CarClickerUpgradeId,
} from './types';

const OFFLINE_INCOME_FEEDBACK_AUTO_DISMISS_MS = 8_000;

export function useCarClickerGame() {
  const [sessionState, dispatch] = useReducer(
    carClickerReducer,
    undefined,
    createInitialCarClickerSessionState,
  );
  const {
    game,
    offlineIncomeFeedback,
    purchaseFeedback,
    selectedUpgradeCategory,
    tierFeedback,
  } = sessionState;
  const tierProgress = useMemo(
    () => getCarTierProgress(game.upgrades),
    [game.upgrades],
  );
  const garageView = useMemo(
    () => getCarClickerGarageView(game),
    [game],
  );
  const upgradeCategory: CarClickerUpgradeCategory | undefined =
    selectedUpgradeCategory === 'all'
      ? undefined
      : selectedUpgradeCategory;
  const upgradeViews = useMemo(
    () => getUpgradeViews(game, upgradeCategory),
    [game, upgradeCategory],
  );
  const hydrateGame = useCallback(
    (
      savedGame: CarClickerState,
      offlineFeedback: CarClickerOfflineIncomeFeedback | null,
    ) => {
      dispatch({
        type: 'hydrate_game',
        game: savedGame,
        offlineIncomeFeedback: offlineFeedback,
      });
    },
    [],
  );
  const dismissOfflineIncomeFeedback = useCallback(() => {
    dispatch({ type: 'dismiss_offline_income_feedback' });
  }, []);

  useCarClickerSave({
    game,
    onHydrate: hydrateGame,
  });

  useEffect(() => {
    if (!offlineIncomeFeedback) {
      return undefined;
    }

    const dismissTimeout = setTimeout(
      dismissOfflineIncomeFeedback,
      OFFLINE_INCOME_FEEDBACK_AUTO_DISMISS_MS,
    );

    return () => {
      clearTimeout(dismissTimeout);
    };
  }, [dismissOfflineIncomeFeedback, offlineIncomeFeedback]);

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

  function selectCar(carId: CarClickerCarId) {
    dispatch({ type: 'select_car', carId });
  }

  function selectLocation(locationId: CarClickerLocationId) {
    dispatch({ type: 'select_location', locationId });
  }

  function claimNitroRushReward(runInput: NitroRushRunInput) {
    dispatch({ type: 'claim_nitro_rush_reward', runInput });
  }

  return {
    offlineIncomeFeedback,
    purchaseFeedback,
    state: game,
    selectedUpgradeCategory,
    garageView,
    tierFeedback,
    tierProgress,
    upgradeViews,
    actions: {
      claimNitroRushReward,
      collectClick,
      dismissOfflineIncomeFeedback,
      purchaseUpgrade,
      selectCar,
      selectUpgradeCategory: (category: CarClickerUpgradeCategoryFilter) =>
        dispatch({ type: 'select_upgrade_category', category }),
      selectLocation,
    },
  };
}
