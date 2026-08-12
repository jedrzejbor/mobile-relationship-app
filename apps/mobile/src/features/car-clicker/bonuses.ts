export type CarClickerBonusSource = 'nitro_rush';

export type CarClickerBonusType =
  | 'cash_per_click_multiplier'
  | 'passive_income_multiplier';

export type CarClickerActiveBonus = {
  id: string;
  label: string;
  multiplier: number;
  source: CarClickerBonusSource;
  startedAt: number;
  expiresAt: number;
  type: CarClickerBonusType;
};

export type CarClickerBonusDefinition = {
  id: string;
  durationSeconds: number;
  label: string;
  multiplier: number;
  source: CarClickerBonusSource;
  type: CarClickerBonusType;
};

export type CarClickerActiveBonusView = {
  bonus: CarClickerActiveBonus;
  progressRatio: number;
  remainingSeconds: number;
};

export const NITRO_RUSH_BONUS_DEFINITIONS = [
  {
    id: 'nitro_cash_boost_small',
    durationSeconds: 5 * 60,
    label: 'Nitro Cash Boost',
    multiplier: 1.5,
    source: 'nitro_rush',
    type: 'cash_per_click_multiplier',
  },
  {
    id: 'nitro_passive_boost_small',
    durationSeconds: 3 * 60,
    label: 'Turbo Passive',
    multiplier: 2,
    source: 'nitro_rush',
    type: 'passive_income_multiplier',
  },
] as const satisfies readonly CarClickerBonusDefinition[];

export const INITIAL_CAR_CLICKER_ACTIVE_BONUSES =
  [] as const satisfies readonly CarClickerActiveBonus[];

export function createCarClickerTimedBonus(
  definition: CarClickerBonusDefinition,
  now = Date.now(),
): CarClickerActiveBonus {
  return {
    id: `${definition.id}:${now}`,
    label: definition.label,
    multiplier: Math.max(definition.multiplier, 1),
    source: definition.source,
    startedAt: now,
    expiresAt: now + definition.durationSeconds * 1000,
    type: definition.type,
  };
}

export function isCarClickerBonusActive(
  bonus: CarClickerActiveBonus,
  now = Date.now(),
) {
  return bonus.expiresAt > now;
}

export function filterActiveCarClickerBonuses(
  bonuses: readonly CarClickerActiveBonus[],
  now = Date.now(),
) {
  return bonuses.filter((bonus) => isCarClickerBonusActive(bonus, now));
}

export function calculateCarClickerBonusMultiplier(
  bonuses: readonly CarClickerActiveBonus[],
  type: CarClickerBonusType,
  now = Date.now(),
) {
  return filterActiveCarClickerBonuses(bonuses, now)
    .filter((bonus) => bonus.type === type)
    .reduce((multiplier, bonus) => multiplier * Math.max(bonus.multiplier, 1), 1);
}

export function getActiveCarClickerBonusViews(
  bonuses: readonly CarClickerActiveBonus[],
  now = Date.now(),
): readonly CarClickerActiveBonusView[] {
  return filterActiveCarClickerBonuses(bonuses, now).map((bonus) => {
    const durationMs = Math.max(bonus.expiresAt - bonus.startedAt, 1);
    const remainingMs = Math.max(bonus.expiresAt - now, 0);

    return {
      bonus,
      progressRatio: Math.min(Math.max(remainingMs / durationMs, 0), 1),
      remainingSeconds: remainingMs / 1000,
    };
  });
}
