import type { ImageSourcePropType } from 'react-native';

import type { CarClickerUpgradeId } from './types';

export type CarClickerCarAssetId = 'starter';
export type CarClickerLocationAssetId = 'dealership';

export type CarClickerCarStageAsset = {
  id:
    | 'stage_0_stock'
    | 'stage_1_sport_wheels'
    | 'stage_2_lowered_stance'
    | 'stage_3_rear_wing'
    | 'stage_4_body_kit'
    | 'stage_max_track_tuned';
  label: string;
  minTier: number;
  source: ImageSourcePropType;
};

export type CarClickerCarAsset = {
  id: CarClickerCarAssetId;
  label: string;
  stages: readonly CarClickerCarStageAsset[];
};

export type CarClickerLocationAsset = {
  id: CarClickerLocationAssetId;
  label: string;
  passiveIncomeBonus: number;
  source: ImageSourcePropType;
};

export const STARTER_CAR_STAGE_ASSETS = [
  {
    id: 'stage_0_stock',
    label: 'Stage 0: stock',
    minTier: 1,
    source: require('@/assets/game/cars/starter/stage-0-stock.png'),
  },
  {
    id: 'stage_1_sport_wheels',
    label: 'Stage 1: sport wheels',
    minTier: 2,
    source: require('@/assets/game/cars/starter/stage-1-sport-wheels.png'),
  },
  {
    id: 'stage_2_lowered_stance',
    label: 'Stage 2: lowered stance',
    minTier: 3,
    source: require('@/assets/game/cars/starter/stage-2-lowered-stance.png'),
  },
  {
    id: 'stage_3_rear_wing',
    label: 'Stage 3: rear wing',
    minTier: 4,
    source: require('@/assets/game/cars/starter/stage-3-rear-wing.png'),
  },
  {
    id: 'stage_4_body_kit',
    label: 'Stage 4: body kit',
    minTier: 5,
    source: require('@/assets/game/cars/starter/stage-4-body-kit.png'),
  },
  {
    id: 'stage_max_track_tuned',
    label: 'Stage MAX: track tuned',
    minTier: 5,
    source: require('@/assets/game/cars/starter/stage-max-track-tuned.png'),
  },
] as const satisfies readonly CarClickerCarStageAsset[];

export const CAR_CLICKER_CAR_ASSETS = {
  starter: {
    id: 'starter',
    label: 'Starter Hatch',
    stages: STARTER_CAR_STAGE_ASSETS,
  },
} as const satisfies Record<CarClickerCarAssetId, CarClickerCarAsset>;

export function getCarStageAsset(
  carId: CarClickerCarAssetId,
  tier: number,
): CarClickerCarStageAsset {
  const carAsset = CAR_CLICKER_CAR_ASSETS[carId];

  return carAsset.stages.reduce<CarClickerCarStageAsset>(
    (selectedAsset, stageAsset) =>
      tier >= stageAsset.minTier ? stageAsset : selectedAsset,
    carAsset.stages[0],
  );
}

export function getStarterCarStageAsset(tier: number): CarClickerCarStageAsset {
  return getCarStageAsset('starter', tier);
}

export const CAR_CLICKER_UPGRADE_ASSETS = {
  better_tires: require('@/assets/game/upgrades/better-tires.png'),
  chip_tuning: require('@/assets/game/upgrades/chip-tuning.png'),
  turbo: require('@/assets/game/upgrades/turbo.png'),
  mechanic: require('@/assets/game/upgrades/mechanic.png'),
  workshop: require('@/assets/game/upgrades/workshop.png'),
  dealer: require('@/assets/game/upgrades/dealer.png'),
} as const satisfies Record<CarClickerUpgradeId, ImageSourcePropType>;

export const CAR_CLICKER_LOCATION_ASSETS = {
  dealership: {
    id: 'dealership',
    label: 'Dealer showroom',
    passiveIncomeBonus: 45,
    source: require('@/assets/game/locations/dealership.png'),
  },
} as const satisfies Record<CarClickerLocationAssetId, CarClickerLocationAsset>;
