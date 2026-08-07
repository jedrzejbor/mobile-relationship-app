import { useCallback, useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { collectOfflineIncome } from './economy';
import { loadCarClickerSaveData, saveCarClickerState } from './storage';
import type {
  CarClickerOfflineIncomeFeedback,
  CarClickerState,
} from './types';

const SAVE_DEBOUNCE_MS = 750;
const SAVE_THROTTLE_MS = 5_000;
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
  const lastSavedAtRef = useRef(0);
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
    lastSavedAtRef.current = Date.now();
    void saveCarClickerState(latestGameRef.current);
  }, [clearPendingSave]);
  const scheduleSave = useCallback(() => {
    if (!isHydratedRef.current) {
      return;
    }

    const elapsedSinceLastSave = Date.now() - lastSavedAtRef.current;
    const throttleDelay = Math.max(
      SAVE_THROTTLE_MS - elapsedSinceLastSave,
      0,
    );
    const saveDelay = Math.max(SAVE_DEBOUNCE_MS, throttleDelay);

    clearPendingSave();

    saveTimeoutRef.current = setTimeout(() => {
      saveTimeoutRef.current = null;
      lastSavedAtRef.current = Date.now();
      void saveCarClickerState(latestGameRef.current);
    }, saveDelay);
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

        latestGameRef.current = offlineIncome.state;
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

    scheduleSave();

    return clearPendingSave;
  }, [clearPendingSave, game, scheduleSave]);

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
