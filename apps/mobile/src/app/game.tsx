import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { CarClickerStatsPanel } from '@/features/car-clicker/components/car-clicker-stats-panel';
import { CarTapButton } from '@/features/car-clicker/components/car-tap-button';
import { CarTierProgressPanel } from '@/features/car-clicker/components/car-tier-progress-panel';
import {
  collectClickIncome,
  createInitialCarClickerState,
  getCarTierProgress,
} from '@/features/car-clicker';

export default function GameScreen() {
  const [gameState, setGameState] = useState(createInitialCarClickerState);
  const tierProgress = useMemo(
    () => getCarTierProgress(gameState.upgrades),
    [gameState.upgrades],
  );

  function handleCarPress() {
    setGameState((currentState) => collectClickIncome(currentState));
  }

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}>
          <ThemedView style={styles.content}>
            <ThemedView style={styles.header}>
              <ThemedText type="subtitle" style={styles.title}>
                Car Clicker
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                Klikaj auto i zbieraj kase na tuning
              </ThemedText>
            </ThemedView>

            <CarClickerStatsPanel
              cash={gameState.cash}
              perClick={gameState.perClick}
              perSecond={gameState.perSecond}
            />

            <CarTapButton
              onPress={handleCarPress}
              perClick={gameState.perClick}
              tier={gameState.selectedCarTier}
            />

            <CarTierProgressPanel progress={tierProgress} />
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.four,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.one,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
});
