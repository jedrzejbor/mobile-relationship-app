import { useWindowDimensions } from 'react-native';

import { isCompactCarClickerWidth } from '@/features/car-clicker/layout';

export function useCarClickerLayout() {
  const { width } = useWindowDimensions();

  return {
    isCompactLayout: isCompactCarClickerWidth(width),
    width,
  };
}
