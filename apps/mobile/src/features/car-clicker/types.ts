export type CarClickerUpgradeCategory =
  | 'power'
  | 'garage'
  | 'style'
  | 'automation';

export type CarClickerUpgradeId =
  | 'better_tires'
  | 'chip_tuning'
  | 'turbo'
  | 'mechanic'
  | 'workshop'
  | 'dealer';

export type CarClickerUpgradeDefinition = {
  id: CarClickerUpgradeId;
  name: string;
  description: string;
  category: CarClickerUpgradeCategory;
  baseCost: number;
  costMultiplier: number;
  perClickBonus?: number;
  perSecondBonus?: number;
  maxLevel?: number;
};

export type CarClickerUpgradeLevels = Record<CarClickerUpgradeId, number>;

export type CarClickerState = {
  cash: number;
  totalEarnedCash: number;
  perClick: number;
  perSecond: number;
  upgrades: CarClickerUpgradeLevels;
  selectedCarTier: number;
};

export type CarClickerUpgradePurchaseResult =
  | {
      status: 'purchased';
      state: CarClickerState;
    }
  | {
      status: 'insufficient_cash' | 'max_level_reached';
      state: CarClickerState;
    };
