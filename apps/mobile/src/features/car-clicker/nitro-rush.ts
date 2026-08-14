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

export type NitroRushTrackItem =
  | {
      type: 'gate';
      gate: NitroRushGateDefinition;
    }
  | {
      type: 'obstacle';
      obstacle: NitroRushObstacleDefinition;
    };

export type NitroRushRunInput = {
  collectedGateIds: readonly string[];
  hitObstacleIds: readonly string[];
};

export type NitroRushRunSelection = {
  collectedGateIds: readonly string[];
  hitObstacleIds: readonly string[];
};

export type NitroRushRunnerDirection = 'left' | 'right';

export type NitroRushRunnerState = {
  currentItemIndex: number;
  currentLane: NitroRushLane;
  selection: NitroRushRunSelection;
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

export const INITIAL_NITRO_RUSH_RUN_SELECTION = {
  collectedGateIds: [],
  hitObstacleIds: [],
} as const satisfies NitroRushRunSelection;

export const INITIAL_NITRO_RUSH_RUNNER_STATE = {
  currentItemIndex: 0,
  currentLane: 'center',
  selection: INITIAL_NITRO_RUSH_RUN_SELECTION,
} as const satisfies NitroRushRunnerState;

const NITRO_RUSH_LANES: readonly NitroRushLane[] = ['left', 'center', 'right'];

function createNitroRushGateMap(config: NitroRushRunConfig) {
  return config.gates.reduce(
    (gatesById, gate) => ({
      ...gatesById,
      [gate.id]: gate,
    }),
    {} as Record<string, NitroRushGateDefinition>,
  );
}

function createNitroRushObstacleMap(config: NitroRushRunConfig) {
  return config.obstacles.reduce(
    (obstaclesById, obstacle) => ({
      ...obstaclesById,
      [obstacle.id]: obstacle,
    }),
    {} as Record<string, NitroRushObstacleDefinition>,
  );
}

function toggleId(ids: readonly string[], id: string) {
  return ids.includes(id)
    ? ids.filter((currentId) => currentId !== id)
    : [...ids, id];
}

function addUniqueId(ids: readonly string[], id: string) {
  return ids.includes(id) ? ids : [...ids, id];
}

export function toggleNitroRushGate(
  selection: NitroRushRunSelection,
  gateId: string,
): NitroRushRunSelection {
  return {
    ...selection,
    collectedGateIds: toggleId(selection.collectedGateIds, gateId),
  };
}

export function toggleNitroRushObstacle(
  selection: NitroRushRunSelection,
  obstacleId: string,
): NitroRushRunSelection {
  return {
    ...selection,
    hitObstacleIds: toggleId(selection.hitObstacleIds, obstacleId),
  };
}

export function hasNitroRushRunSelection(selection: NitroRushRunSelection) {
  return (
    selection.collectedGateIds.length > 0 ||
    selection.hitObstacleIds.length > 0
  );
}

export function createNitroRushRunInput(
  selection: NitroRushRunSelection,
): NitroRushRunInput {
  return {
    collectedGateIds: selection.collectedGateIds,
    hitObstacleIds: selection.hitObstacleIds,
  };
}

export function createNitroRushRunInputFromRunner(
  runnerState: NitroRushRunnerState,
): NitroRushRunInput {
  return createNitroRushRunInput(runnerState.selection);
}

export function getNitroRushTrackItems(
  config: NitroRushRunConfig = NITRO_RUSH_RUN_CONFIG,
): NitroRushTrackItem[] {
  const itemCount = Math.max(config.gates.length, config.obstacles.length);
  const items: NitroRushTrackItem[] = [];

  for (let itemIndex = 0; itemIndex < itemCount; itemIndex += 1) {
    const gate = config.gates[itemIndex];
    const obstacle = config.obstacles[itemIndex];

    if (gate) {
      items.push({ type: 'gate', gate });
    }

    if (obstacle) {
      items.push({ type: 'obstacle', obstacle });
    }
  }

  return items;
}

export function moveNitroRushCar(
  runnerState: NitroRushRunnerState,
  direction: NitroRushRunnerDirection,
): NitroRushRunnerState {
  const currentLaneIndex = NITRO_RUSH_LANES.indexOf(runnerState.currentLane);
  const nextLaneIndex =
    direction === 'left' ? currentLaneIndex - 1 : currentLaneIndex + 1;
  const clampedLaneIndex = Math.min(
    Math.max(nextLaneIndex, 0),
    NITRO_RUSH_LANES.length - 1,
  );

  return {
    ...runnerState,
    currentLane: NITRO_RUSH_LANES[clampedLaneIndex],
  };
}

export function isNitroRushRunnerComplete(
  runnerState: NitroRushRunnerState,
  config: NitroRushRunConfig = NITRO_RUSH_RUN_CONFIG,
) {
  return runnerState.currentItemIndex >= getNitroRushTrackItems(config).length;
}

export function resolveNitroRushTrackItem(
  runnerState: NitroRushRunnerState,
  config: NitroRushRunConfig = NITRO_RUSH_RUN_CONFIG,
): NitroRushRunnerState {
  const trackItem = getNitroRushTrackItems(config)[runnerState.currentItemIndex];

  if (!trackItem) {
    return runnerState;
  }

  const nextState = {
    ...runnerState,
    currentItemIndex: runnerState.currentItemIndex + 1,
  };

  if (trackItem.type === 'gate') {
    if (trackItem.gate.lane !== runnerState.currentLane) {
      return nextState;
    }

    return {
      ...nextState,
      selection: {
        ...runnerState.selection,
        collectedGateIds: addUniqueId(
          runnerState.selection.collectedGateIds,
          trackItem.gate.id,
        ),
      },
    };
  }

  if (trackItem.obstacle.lane !== runnerState.currentLane) {
    return nextState;
  }

  return {
    ...nextState,
    selection: {
      ...runnerState.selection,
      hitObstacleIds: addUniqueId(
        runnerState.selection.hitObstacleIds,
        trackItem.obstacle.id,
      ),
    },
  };
}

export function calculateNitroRushScore(
  input: NitroRushRunInput,
  config: NitroRushRunConfig = NITRO_RUSH_RUN_CONFIG,
) {
  const gatesById = createNitroRushGateMap(config);
  const obstaclesById = createNitroRushObstacleMap(config);
  const scoreState = input.collectedGateIds.reduce(
    (state, gateId) => {
      const gate = gatesById[gateId];

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
    const obstacle = obstaclesById[obstacleId];

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
