import { useMemo, useState } from 'react';

import {
  collectClickIncome,
  createInitialCarClickerState,
  getCarTierProgress,
  getUpgradeViews,
  purchaseCarClickerUpgrade,
} from './economy';
import type { CarClickerUpgradeId } from './types';

export function useCarClickerGame() {
  const [state, setState] = useState(createInitialCarClickerState);
  const tierProgress = useMemo(
    () => getCarTierProgress(state.upgrades),
    [state.upgrades],
  );
  const upgradeViews = useMemo(() => getUpgradeViews(state), [state]);

  function collectClick() {
    setState((currentState) => collectClickIncome(currentState));
  }

  function purchaseUpgrade(upgradeId: CarClickerUpgradeId) {
    setState(
      (currentState) => purchaseCarClickerUpgrade(currentState, upgradeId).state,
    );
  }

  return {
    state,
    tierProgress,
    upgradeViews,
    actions: {
      collectClick,
      purchaseUpgrade,
    },
  };
}
