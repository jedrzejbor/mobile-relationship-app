import { useMemo, useState } from 'react';

import {
  collectClickIncome,
  createInitialCarClickerState,
  getCarTierProgress,
  getUpgradeViews,
  purchaseCarClickerUpgrade,
} from './economy';
import type {
  CarClickerUpgradeCategory,
  CarClickerUpgradeCategoryFilter,
  CarClickerUpgradeId,
} from './types';

export function useCarClickerGame() {
  const [state, setState] = useState(createInitialCarClickerState);
  const [selectedUpgradeCategory, setSelectedUpgradeCategory] =
    useState<CarClickerUpgradeCategoryFilter>('all');
  const tierProgress = useMemo(
    () => getCarTierProgress(state.upgrades),
    [state.upgrades],
  );
  const upgradeCategory: CarClickerUpgradeCategory | undefined =
    selectedUpgradeCategory === 'all'
      ? undefined
      : selectedUpgradeCategory;
  const upgradeViews = useMemo(
    () => getUpgradeViews(state, upgradeCategory),
    [state, upgradeCategory],
  );

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
    selectedUpgradeCategory,
    tierProgress,
    upgradeViews,
    actions: {
      collectClick,
      purchaseUpgrade,
      selectUpgradeCategory: setSelectedUpgradeCategory,
    },
  };
}
