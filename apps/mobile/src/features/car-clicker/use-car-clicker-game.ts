import { useMemo, useState } from 'react';

import {
  collectClickIncome,
  createInitialCarClickerState,
  getCarTierProgress,
  getCarClickerUpgradeById,
  getUpgradeViews,
  purchaseCarClickerUpgrade,
} from './economy';
import type {
  CarClickerPurchaseFeedback,
  CarClickerUpgradeCategory,
  CarClickerUpgradeCategoryFilter,
  CarClickerUpgradeId,
} from './types';

export function useCarClickerGame() {
  const [state, setState] = useState(createInitialCarClickerState);
  const [selectedUpgradeCategory, setSelectedUpgradeCategory] =
    useState<CarClickerUpgradeCategoryFilter>('all');
  const [purchaseFeedback, setPurchaseFeedback] =
    useState<CarClickerPurchaseFeedback | null>(null);
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
    const upgrade = getCarClickerUpgradeById(upgradeId);
    const purchaseResult = purchaseCarClickerUpgrade(state, upgradeId);

    setPurchaseFeedback({
      status: purchaseResult.status,
      upgradeName: upgrade.name,
    });
    setState(purchaseResult.state);
  }

  return {
    purchaseFeedback,
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
