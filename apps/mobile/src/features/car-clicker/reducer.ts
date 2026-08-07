import {
  collectClickIncome,
  collectPassiveIncome,
  createInitialCarClickerState,
  getCarClickerUpgradeById,
  purchaseCarClickerUpgrade,
} from './economy';
import type {
  CarClickerSessionState,
  CarClickerUpgradeCategoryFilter,
  CarClickerUpgradeId,
} from './types';

export type CarClickerAction =
  | {
      type: 'collect_click';
    }
  | {
      type: 'collect_passive_income';
      elapsedSeconds: number;
    }
  | {
      type: 'purchase_upgrade';
      upgradeId: CarClickerUpgradeId;
    }
  | {
      type: 'select_upgrade_category';
      category: CarClickerUpgradeCategoryFilter;
    };

export function createInitialCarClickerSessionState(): CarClickerSessionState {
  return {
    game: createInitialCarClickerState(),
    purchaseFeedback: null,
    selectedUpgradeCategory: 'all',
    tierFeedback: null,
  };
}

export function carClickerReducer(
  state: CarClickerSessionState,
  action: CarClickerAction,
): CarClickerSessionState {
  switch (action.type) {
    case 'collect_click':
      return {
        ...state,
        game: collectClickIncome(state.game),
      };

    case 'collect_passive_income':
      return {
        ...state,
        game: collectPassiveIncome(state.game, action.elapsedSeconds),
      };

    case 'purchase_upgrade': {
      const upgrade = getCarClickerUpgradeById(action.upgradeId);
      const purchaseResult = purchaseCarClickerUpgrade(
        state.game,
        action.upgradeId,
      );
      const didTierIncrease =
        purchaseResult.status === 'purchased' &&
        purchaseResult.state.selectedCarTier > state.game.selectedCarTier;

      return {
        ...state,
        game: purchaseResult.state,
        purchaseFeedback: {
          status: purchaseResult.status,
          upgradeId: action.upgradeId,
          upgradeName: upgrade.name,
        },
        tierFeedback: didTierIncrease
          ? {
              previousTier: state.game.selectedCarTier,
              currentTier: purchaseResult.state.selectedCarTier,
            }
          : state.tierFeedback,
      };
    }

    case 'select_upgrade_category':
      return {
        ...state,
        selectedUpgradeCategory: action.category,
      };
  }
}
