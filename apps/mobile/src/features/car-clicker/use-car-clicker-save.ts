import { useCallback, useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { collectOfflineIncome } from './economy';
import { loadCarClickerSaveData, saveCarClickerState } from './storage';
import type {
  CarClickerOfflineIncomeFeedback,
  CarClickerState,
} from './types';

const SAVE_DEBOUNCE_MS = 750;
const INACTIVE_APP_STATE_PATTERN = /inactive|background/;

type UseCarClickerSaveParams = {
  game: CarClickerState;
  onHydrate: (
    game: CarClickerState,
    offlineIncomeFeedback: CarClickerOfflineIncomeFeedback | null,
  ) => void;
};

export function useCarClickerSave({
  game,
  onHydrate,
}: UseCarClickerSaveParams) {
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const isHydratedRef = useRef(false);
  const latestGameRef = useRef(game);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearPendingSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, []);
  const flushSave = useCallback(() => {
    if (!isHydratedRef.current) {
      return;
    }

    clearPendingSave();
    void saveCarClickerState(latestGameRef.current);
  }, [clearPendingSave]);

  useEffect(() => {
    let isMounted = true;

    async function hydrateGame() {
      const saveData = await loadCarClickerSaveData();

      if (isMounted && saveData) {
        const offlineIncome = collectOfflineIncome(
          saveData.game,
          saveData.savedAt,
        );

        onHydrate(offlineIncome.state, offlineIncome.feedback);
      }

      if (isMounted) {
        isHydratedRef.current = true;
      }
    }

    void hydrateGame();

    return () => {
      isMounted = false;
    };
  }, [onHydrate]);

  useEffect(() => {
    latestGameRef.current = game;

    if (!isHydratedRef.current) {
      return;
    }

    clearPendingSave();

    saveTimeoutRef.current = setTimeout(() => {
      saveTimeoutRef.current = null;
      void saveCarClickerState(latestGameRef.current);
    }, SAVE_DEBOUNCE_MS);

    return clearPendingSave;
  }, [clearPendingSave, game]);

  useEffect(() => {
    function handleAppStateChange(nextAppState: AppStateStatus) {
      const isLeavingActiveState =
        appStateRef.current === 'active' &&
        INACTIVE_APP_STATE_PATTERN.test(nextAppState);

      appStateRef.current = nextAppState;

      if (isLeavingActiveState) {
        flushSave();
      }
    }

    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      appStateSubscription.remove();
    };
  }, [flushSave]);

  useEffect(
    () => () => {
      flushSave();
    },
    [flushSave],
  );
}
