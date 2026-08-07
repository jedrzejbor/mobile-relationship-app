import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

const PASSIVE_INCOME_TICK_SECONDS = 1;
const PASSIVE_INCOME_TICK_MS = PASSIVE_INCOME_TICK_SECONDS * 1000;

type UsePassiveIncomeTickerOptions = {
  isEnabled: boolean;
  onTick: (elapsedSeconds: number) => void;
};

export function usePassiveIncomeTicker({
  isEnabled,
  onTick,
}: UsePassiveIncomeTickerOptions) {
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const lastTickedAtRef = useRef<number | null>(null);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!isEnabled) {
      lastTickedAtRef.current = null;
      return undefined;
    }

    lastTickedAtRef.current = Date.now();

    function collectElapsedTime() {
      const tickedAt = Date.now();
      const lastTickedAt = lastTickedAtRef.current ?? tickedAt;
      const elapsedSeconds = (tickedAt - lastTickedAt) / 1000;

      lastTickedAtRef.current = tickedAt;
      onTickRef.current(elapsedSeconds);
    }

    function handleAppStateChange(nextAppState: AppStateStatus) {
      const wasInactive = appStateRef.current.match(/inactive|background/);
      const isActive = nextAppState === 'active';

      appStateRef.current = nextAppState;

      if (wasInactive && isActive) {
        collectElapsedTime();
      }
    }

    const intervalId = setInterval(() => {
      if (appStateRef.current === 'active') {
        collectElapsedTime();
      }
    }, PASSIVE_INCOME_TICK_MS);
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      lastTickedAtRef.current = null;
      appStateSubscription.remove();
      clearInterval(intervalId);
    };
  }, [isEnabled]);
}
