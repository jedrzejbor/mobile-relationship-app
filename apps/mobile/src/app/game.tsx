import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import {
  collectClickIncome,
  createInitialCarClickerState,
  getCarTierProgress,
} from '@/features/car-clicker';
import { useTheme } from '@/hooks/use-theme';

export default function GameScreen() {
  const theme = useTheme();
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
        <ThemedView style={styles.content}>
          <ThemedView style={styles.header}>
            <ThemedText type="subtitle" style={styles.title}>
              Car Clicker
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              Klikaj auto i zbieraj kase na tuning
            </ThemedText>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.statsPanel}>
            <StatItem label="Cash" value={formatCash(gameState.cash)} />
            <StatItem label="Per click" value={`+${formatCash(gameState.perClick)}`} />
            <StatItem label="Per second" value={`+${formatCash(gameState.perSecond)}`} />
          </ThemedView>

          <Pressable
            accessibilityHint={`Dodaje ${gameState.perClick} cash`}
            accessibilityLabel="Kliknij samochod"
            accessibilityRole="button"
            onPress={handleCarPress}
            style={({ pressed }) => [
              styles.carButton,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.backgroundSelected,
              },
              pressed && styles.carButtonPressed,
            ]}>
            <ThemedText themeColor="textSecondary" style={styles.tierLabel}>
              Tier {gameState.selectedCarTier}
            </ThemedText>
            <View style={styles.car}>
              <View style={[styles.carCabin, { backgroundColor: '#f6c445' }]} />
              <View style={[styles.carBody, { backgroundColor: '#d14f27' }]}>
                <View style={[styles.carWindow, styles.carWindowLeft]} />
                <View style={[styles.carWindow, styles.carWindowRight]} />
              </View>
              <View style={styles.wheels}>
                <View style={styles.wheel} />
                <View style={styles.wheel} />
              </View>
            </View>
            <ThemedText type="smallBold" style={styles.tapHint}>
              +{formatCash(gameState.perClick)} za klik
            </ThemedText>
          </Pressable>

          <ThemedView type="backgroundElement" style={styles.progressPanel}>
            <View style={styles.progressHeader}>
              <ThemedText type="smallBold">
                Progres auta
              </ThemedText>
              <ThemedText themeColor="textSecondary" type="small">
                {tierProgress.nextTier
                  ? `${tierProgress.levelsToNextTier} poziomow do Tier ${tierProgress.nextTier}`
                  : 'Maksymalny tier'}
              </ThemedText>
            </View>
            <View
              accessibilityLabel={`Postep auta ${Math.round(
                tierProgress.progressRatio * 100,
              )} procent`}
              accessibilityRole="progressbar"
              style={[
                styles.progressTrack,
                { backgroundColor: theme.backgroundSelected },
              ]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: '#1f7aec',
                    width: `${tierProgress.progressRatio * 100}%`,
                  },
                ]}
              />
            </View>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <ThemedText themeColor="textSecondary" type="small">
        {label}
      </ThemedText>
      <ThemedText type="smallBold" style={styles.statValue}>
        {value}
      </ThemedText>
    </View>
  );
}

function formatCash(value: number) {
  return Math.floor(value).toLocaleString('pl-PL');
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
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    justifyContent: 'center',
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
  statsPanel: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    flexDirection: 'row',
    gap: Spacing.two,
  },
  statItem: {
    flex: 1,
    minHeight: 56,
    justifyContent: 'center',
    gap: Spacing.one,
  },
  statValue: {
    fontSize: 18,
    lineHeight: 24,
  },
  carButton: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
    minHeight: 260,
    borderRadius: Spacing.three,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  carButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  tierLabel: {
    minHeight: 24,
    textAlign: 'center',
  },
  car: {
    width: '100%',
    maxWidth: 280,
    aspectRatio: 2.3,
    justifyContent: 'flex-end',
  },
  carCabin: {
    position: 'absolute',
    left: '32%',
    top: '10%',
    width: '38%',
    height: '42%',
    borderTopLeftRadius: Spacing.three,
    borderTopRightRadius: Spacing.three,
  },
  carBody: {
    height: '54%',
    borderRadius: Spacing.three,
    borderTopLeftRadius: Spacing.two,
    borderTopRightRadius: Spacing.two,
  },
  carWindow: {
    position: 'absolute',
    top: Spacing.two,
    width: '18%',
    height: '30%',
    borderRadius: Spacing.one,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
  },
  carWindowLeft: {
    left: '34%',
  },
  carWindowRight: {
    right: '24%',
  },
  wheels: {
    position: 'absolute',
    left: '12%',
    right: '12%',
    bottom: -Spacing.two,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wheel: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 8,
    borderColor: '#101113',
    backgroundColor: '#6f7378',
  },
  tapHint: {
    minHeight: 24,
    textAlign: 'center',
  },
  progressPanel: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  progressHeader: {
    minHeight: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
});
