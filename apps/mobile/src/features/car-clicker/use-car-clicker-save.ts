import { useEffect, useRef } from 'react';

import { collectOfflineIncome } from './economy';
import { loadCarClickerSaveData, saveCarClickerState } from './storage';
import type {
  CarClickerOfflineIncomeFeedback,
  CarClickerState,
} from './types';

const SAVE_DEBOUNCE_MS = 750;

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
  const isHydratedRef = useRef(false);
  const latestGameRef = useRef(game);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveTimeoutRef.current = null;
      void saveCarClickerState(latestGameRef.current);
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [game]);

  useEffect(
    () => () => {
      if (isHydratedRef.current) {
        void saveCarClickerState(latestGameRef.current);
      }
    },
    [],
  );
}
