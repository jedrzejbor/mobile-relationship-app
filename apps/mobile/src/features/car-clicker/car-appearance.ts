export type CarAppearance = {
  name: string;
  bodyColor: string;
  cabinColor: string;
  accentColor: string;
  hasSpoiler: boolean;
  hasNeon: boolean;
};

const CAR_APPEARANCES: Record<number, CarAppearance> = {
  1: {
    name: 'Seria',
    bodyColor: '#d14f27',
    cabinColor: '#f6c445',
    accentColor: '#1f7aec',
    hasSpoiler: false,
    hasNeon: false,
  },
  2: {
    name: 'Felgi',
    bodyColor: '#1f7aec',
    cabinColor: '#f6c445',
    accentColor: '#d14f27',
    hasSpoiler: false,
    hasNeon: false,
  },
  3: {
    name: 'Body kit',
    bodyColor: '#18a058',
    cabinColor: '#f6c445',
    accentColor: '#101113',
    hasSpoiler: true,
    hasNeon: false,
  },
  4: {
    name: 'Turbo',
    bodyColor: '#8b5cf6',
    cabinColor: '#f6c445',
    accentColor: '#22d3ee',
    hasSpoiler: true,
    hasNeon: true,
  },
  5: {
    name: 'Show car',
    bodyColor: '#f43f5e',
    cabinColor: '#f6c445',
    accentColor: '#22d3ee',
    hasSpoiler: true,
    hasNeon: true,
  },
};

export function getCarAppearance(tier: number) {
  return CAR_APPEARANCES[tier] ?? CAR_APPEARANCES[1];
}
