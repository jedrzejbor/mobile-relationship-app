import {
  createCarClickerTimedBonus,
  NITRO_RUSH_BONUS_DEFINITIONS,
  type CarClickerActiveBonus,
  type CarClickerBonusDefinition,
} from './bonuses';

export type NitroRushLane = 'left' | 'center' | 'right';

export type NitroRushGateEffect =
  | {
      type: 'add_score';
      value: number;
    }
  | {
      type: 'multiply_score';
      value: number;
    }
  | {
      type: 'add_nitro';
      value: number;
    };

export type NitroRushGateDefinition = {
  id: string;
  label: string;
  lane: NitroRushLane;
  effect: NitroRushGateEffect;
};

export type NitroRushObstaclePenalty =
  | {
      type: 'lose_score';
      value: number;
    }
  | {
      type: 'reduce_multiplier';
      value: number;
    };

export type NitroRushObstacleDefinition = {
  id: string;
  label: string;
  lane: NitroRushLane;
  penalty: NitroRushObstaclePenalty;
};

export type NitroRushRunConfig = {
  durationSeconds: number;
  gates: readonly NitroRushGateDefinition[];
  obstacles: readonly NitroRushObstacleDefinition[];
  startingMultiplier: number;
};

export type NitroRushRunInput = {
  collectedGateIds: readonly string[];
  hitObstacleIds: readonly string[];
};

export type NitroRushRunResult = {
  bestGateValue: number;
  bonusDefinition: CarClickerBonusDefinition;
  combo: number;
  finalMultiplier: number;
  rewardBonus: CarClickerActiveBonus;
  score: number;
};

export const NITRO_RUSH_RUN_CONFIG = {
  durationSeconds: 35,
  startingMultiplier: 1,
  gates: [
    {
      id: 'gate_score_1',
      label: '+1',
      lane: 'left',
      effect: { type: 'add_score', value: 1 },
    },
    {
      id: 'gate_score_5',
      label: '+5',
      lane: 'center',
      effect: { type: 'add_score', value: 5 },
    },
    {
      id: 'gate_multiplier_2',
      label: 'x2',
      lane: 'right',
      effect: { type: 'multiply_score', value: 2 },
    },
    {
      id: 'gate_nitro_10',
      label: '+Nitro',
      lane: 'center',
      effect: { type: 'add_nitro', value: 10 },
    },
  ],
  obstacles: [
    {
      id: 'obstacle_cones',
      label: 'Pacholki',
      lane: 'left',
      penalty: { type: 'lose_score', value: 3 },
    },
    {
      id: 'obstacle_oil',
      label: 'Olej',
      lane: 'right',
      penalty: { type: 'reduce_multiplier', value: 0.5 },
    },
  ],
} as const satisfies NitroRushRunConfig;

const NITRO_RUSH_GATE_BY_ID = NITRO_RUSH_RUN_CONFIG.gates.reduce(
  (gatesById, gate) => ({
    ...gatesById,
    [gate.id]: gate,
  }),
  {} as Record<string, NitroRushGateDefinition>,
);

const NITRO_RUSH_OBSTACLE_BY_ID = NITRO_RUSH_RUN_CONFIG.obstacles.reduce(
  (obstaclesById, obstacle) => ({
    ...obstaclesById,
    [obstacle.id]: obstacle,
  }),
  {} as Record<string, NitroRushObstacleDefinition>,
);

export function calculateNitroRushScore(
  input: NitroRushRunInput,
  config: NitroRushRunConfig = NITRO_RUSH_RUN_CONFIG,
) {
  const scoreState = input.collectedGateIds.reduce(
    (state, gateId) => {
      const gate = NITRO_RUSH_GATE_BY_ID[gateId];

      if (!gate) {
        return state;
      }

      switch (gate.effect.type) {
        case 'add_score':
          return {
            ...state,
            bestGateValue: Math.max(state.bestGateValue, gate.effect.value),
            combo: state.combo + 1,
            score: state.score + gate.effect.value * state.multiplier,
          };
        case 'multiply_score':
          return {
            ...state,
            bestGateValue: Math.max(state.bestGateValue, gate.effect.value),
            combo: state.combo + 1,
            multiplier: state.multiplier * gate.effect.value,
          };
        case 'add_nitro':
          return {
            ...state,
            combo: state.combo + 1,
            score: state.score + gate.effect.value,
          };
      }
    },
    {
      bestGateValue: 0,
      combo: 0,
      multiplier: config.startingMultiplier,
      score: 0,
    },
  );

  return input.hitObstacleIds.reduce((state, obstacleId) => {
    const obstacle = NITRO_RUSH_OBSTACLE_BY_ID[obstacleId];

    if (!obstacle) {
      return state;
    }

    switch (obstacle.penalty.type) {
      case 'lose_score':
        return {
          ...state,
          combo: 0,
          score: Math.max(state.score - obstacle.penalty.value, 0),
        };
      case 'reduce_multiplier':
        return {
          ...state,
          combo: 0,
          multiplier: Math.max(state.multiplier * obstacle.penalty.value, 1),
        };
    }
  }, scoreState);
}

export function selectNitroRushBonusDefinition(score: number) {
  return score >= 25
    ? NITRO_RUSH_BONUS_DEFINITIONS[1]
    : NITRO_RUSH_BONUS_DEFINITIONS[0];
}

export function createNitroRushRunResult(
  input: NitroRushRunInput,
  now = Date.now(),
): NitroRushRunResult {
  const scoreState = calculateNitroRushScore(input);
  const score = Math.floor(scoreState.score);
  const bonusDefinition = selectNitroRushBonusDefinition(score);

  return {
    bestGateValue: scoreState.bestGateValue,
    bonusDefinition,
    combo: scoreState.combo,
    finalMultiplier: scoreState.multiplier,
    rewardBonus: createCarClickerTimedBonus(bonusDefinition, now),
    score,
  };
}
