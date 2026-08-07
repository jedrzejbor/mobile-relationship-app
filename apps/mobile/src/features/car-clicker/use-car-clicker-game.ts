import { useMemo, useState } from 'react';

import {
  collectClickIncome,
  createInitialCarClickerState,
  getCarTierProgress,
} from './economy';

export function useCarClickerGame() {
  const [state, setState] = useState(createInitialCarClickerState);
  const tierProgress = useMemo(
    () => getCarTierProgress(state.upgrades),
    [state.upgrades],
  );

  function collectClick() {
    setState((currentState) => collectClickIncome(currentState));
  }

  return {
    state,
    tierProgress,
    actions: {
      collectClick,
    },
  };
}
