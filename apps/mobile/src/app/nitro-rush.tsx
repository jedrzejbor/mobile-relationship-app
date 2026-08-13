import { useMemo, useState } from 'react';
import { Image } from 'expo-image';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import {
  CarClickerTheme,
  createNitroRushRunInput,
  createNitroRushRunResult,
  formatCarClickerDuration,
  hasNitroRushRunSelection,
  INITIAL_NITRO_RUSH_RUN_SELECTION,
  NITRO_RUSH_RUN_CONFIG,
  toggleNitroRushGate,
  toggleNitroRushObstacle,
  type NitroRushGateDefinition,
  type NitroRushLane,
  type NitroRushObstacleDefinition,
  type NitroRushRunResult,
  type NitroRushRunSelection,
  useCarClickerGame,
} from '@/features/car-clicker';

function getGateEffectLabel(gate: NitroRushGateDefinition) {
  switch (gate.effect.type) {
    case 'add_score':
      return `+${gate.effect.value} score`;
    case 'multiply_score':
      return `x${gate.effect.value} score`;
    case 'add_nitro':
      return `+${gate.effect.value} nitro`;
  }
}

function getObstaclePenaltyLabel(obstacle: NitroRushObstacleDefinition) {
  switch (obstacle.penalty.type) {
    case 'lose_score':
      return `-${obstacle.penalty.value} score`;
    case 'reduce_multiplier':
      return `x${obstacle.penalty.value} multiplier`;
  }
}

function getLaneStyle(lane: NitroRushLane) {
  switch (lane) {
    case 'left':
      return styles.tileLeft;
    case 'center':
      return styles.tileCenter;
    case 'right':
      return styles.tileRight;
  }
}

export default function NitroRushScreen() {
  const { actions, garageView } = useCarClickerGame();
  const [runSelection, setRunSelection] = useState<NitroRushRunSelection>(
    INITIAL_NITRO_RUSH_RUN_SELECTION,
  );
  const [lastClaimedResult, setLastClaimedResult] =
    useState<NitroRushRunResult | null>(null);
  const runInput = useMemo(
    () => createNitroRushRunInput(runSelection),
    [runSelection],
  );
  const runResult = useMemo(
    () => createNitroRushRunResult(runInput),
    [runInput],
  );
  const hasRunChoices = hasNitroRushRunSelection(runSelection);

  function toggleGate(gateId: string) {
    setLastClaimedResult(null);
    setRunSelection((currentSelection) =>
      toggleNitroRushGate(currentSelection, gateId),
    );
  }

  function toggleObstacle(obstacleId: string) {
    setLastClaimedResult(null);
    setRunSelection((currentSelection) =>
      toggleNitroRushObstacle(currentSelection, obstacleId),
    );
  }

  function resetRun() {
    setRunSelection(INITIAL_NITRO_RUSH_RUN_SELECTION);
  }

  function claimReward() {
    actions.claimNitroRushReward(runInput);
    setLastClaimedResult(runResult);
    resetRun();
  }

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}>
          <View style={styles.content}>
            <View style={styles.header}>
              <ThemedText type="smallBold" style={styles.kicker}>
                Nitro Rush
              </ThemedText>
              <ThemedText type="title" style={styles.title}>
                Test Run
              </ThemedText>
              <ThemedText type="small" style={styles.subtitle}>
                {formatCarClickerDuration(NITRO_RUSH_RUN_CONFIG.durationSeconds)}
              </ThemedText>
            </View>

            <View style={styles.trackPanel}>
              <View style={styles.trackHeader}>
                <ThemedText type="smallBold" style={styles.panelTitle}>
                  Wybierz linie
                </ThemedText>
                <ThemedText type="smallBold" style={styles.multiplierBadge}>
                  x{runResult.finalMultiplier.toFixed(1)}
                </ThemedText>
              </View>

              <View style={styles.track}>
                {NITRO_RUSH_RUN_CONFIG.gates.map((gate) => {
                  const isSelected = runSelection.collectedGateIds.includes(gate.id);

                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      key={gate.id}
                      onPress={() => toggleGate(gate.id)}
                      style={[
                        styles.trackTile,
                        styles.gateTile,
                        isSelected && styles.gateTileSelected,
                        getLaneStyle(gate.lane),
                      ]}>
                      <ThemedText type="smallBold" style={styles.tileTitle}>
                        {gate.label}
                      </ThemedText>
                      <ThemedText type="small" style={styles.tileMeta}>
                        {getGateEffectLabel(gate)}
                      </ThemedText>
                    </Pressable>
                  );
                })}
                {NITRO_RUSH_RUN_CONFIG.obstacles.map((obstacle) => {
                  const isSelected = runSelection.hitObstacleIds.includes(
                    obstacle.id,
                  );

                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      key={obstacle.id}
                      onPress={() => toggleObstacle(obstacle.id)}
                      style={[
                        styles.trackTile,
                        styles.obstacleTile,
                        isSelected && styles.obstacleTileSelected,
                        getLaneStyle(obstacle.lane),
                      ]}>
                      <ThemedText type="smallBold" style={styles.tileTitle}>
                        {obstacle.label}
                      </ThemedText>
                      <ThemedText type="small" style={styles.tileMeta}>
                        {getObstaclePenaltyLabel(obstacle)}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>

              <Image
                accessibilityIgnoresInvertColors
                contentFit="contain"
                source={garageView.currentCar.stageAsset.source}
                style={styles.carImage}
              />
            </View>

            <View style={styles.resultPanel}>
              <View style={styles.resultStats}>
                <ResultStat label="Score" value={`${runResult.score}`} />
                <ResultStat label="Combo" value={`${runResult.combo}`} />
                <ResultStat label="Best gate" value={`+${runResult.bestGateValue}`} />
              </View>

              <View style={styles.rewardBox}>
                <ThemedText type="smallBold" style={styles.rewardLabel}>
                  Nagroda
                </ThemedText>
                <ThemedText type="subtitle" style={styles.rewardName}>
                  {runResult.bonusDefinition.label}
                </ThemedText>
                <ThemedText type="smallBold" style={styles.rewardMeta}>
                  x{runResult.bonusDefinition.multiplier.toFixed(1)} ·{' '}
                  {formatCarClickerDuration(runResult.bonusDefinition.durationSeconds)}
                </ThemedText>
              </View>

              {lastClaimedResult ? (
                <View style={styles.claimedBox}>
                  <ThemedText type="smallBold" style={styles.claimedTitle}>
                    Bonus aktywny
                  </ThemedText>
                  <ThemedText type="small" style={styles.claimedText}>
                    {lastClaimedResult.bonusDefinition.label} za score{' '}
                    {lastClaimedResult.score}
                  </ThemedText>
                </View>
              ) : null}

              <Pressable
                accessibilityRole="button"
                disabled={!hasRunChoices}
                onPress={claimReward}
                style={({ pressed }) => [
                  styles.claimButton,
                  !hasRunChoices && styles.claimButtonDisabled,
                  pressed && styles.claimButtonPressed,
                ]}>
                <ThemedText type="smallBold" style={styles.claimButtonText}>
                  Odbierz bonus
                </ThemedText>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={!hasRunChoices}
                onPress={resetRun}
                style={({ pressed }) => [
                  styles.resetButton,
                  !hasRunChoices && styles.resetButtonDisabled,
                  pressed && styles.claimButtonPressed,
                ]}>
                <ThemedText type="smallBold" style={styles.resetButtonText}>
                  Reset runa
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.resultStat}>
      <ThemedText type="smallBold" style={styles.resultLabel}>
        {label}
      </ThemedText>
      <ThemedText type="smallBold" style={styles.resultValue}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CarClickerTheme.colors.background,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: Spacing.four,
    paddingBottom: Platform.select({
      web: Spacing.six + Spacing.four,
      default: Spacing.three,
    }),
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.one,
  },
  kicker: {
    color: CarClickerTheme.colors.accent,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  title: {
    color: CarClickerTheme.colors.text,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  subtitle: {
    color: CarClickerTheme.colors.textMuted,
  },
  trackPanel: {
    overflow: 'hidden',
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    borderRadius: CarClickerTheme.radii.panel,
    backgroundColor: CarClickerTheme.colors.panel,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  trackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  panelTitle: {
    color: CarClickerTheme.colors.text,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  multiplierBadge: {
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.borderStrong,
    borderRadius: CarClickerTheme.radii.badge,
    backgroundColor: CarClickerTheme.colors.accentDim,
    color: CarClickerTheme.colors.accent,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  track: {
    minHeight: 360,
    borderRadius: CarClickerTheme.radii.panel,
    backgroundColor: '#071019',
    padding: Spacing.two,
    gap: Spacing.two,
  },
  trackTile: {
    minHeight: 58,
    width: '32%',
    justifyContent: 'center',
    borderWidth: CarClickerTheme.borders.hairline,
    borderRadius: CarClickerTheme.radii.control,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  gateTile: {
    borderColor: CarClickerTheme.colors.click,
    backgroundColor: 'rgba(47, 185, 255, 0.16)',
  },
  gateTileSelected: {
    borderColor: CarClickerTheme.colors.accent,
    backgroundColor: CarClickerTheme.colors.accentDim,
  },
  obstacleTile: {
    borderColor: CarClickerTheme.colors.danger,
    backgroundColor: 'rgba(255, 92, 112, 0.14)',
  },
  obstacleTileSelected: {
    borderColor: CarClickerTheme.colors.danger,
    backgroundColor: 'rgba(255, 92, 112, 0.28)',
  },
  tileLeft: {
    alignSelf: 'flex-start',
  },
  tileCenter: {
    alignSelf: 'center',
  },
  tileRight: {
    alignSelf: 'flex-end',
  },
  tileTitle: {
    color: CarClickerTheme.colors.text,
    fontSize: 18,
    lineHeight: 22,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  tileMeta: {
    color: CarClickerTheme.colors.textMuted,
    textAlign: 'center',
  },
  carImage: {
    width: '100%',
    height: 170,
  },
  resultPanel: {
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    borderRadius: CarClickerTheme.radii.panel,
    backgroundColor: CarClickerTheme.colors.panel,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  resultStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  resultStat: {
    flex: 1,
    minWidth: 96,
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    borderRadius: CarClickerTheme.radii.control,
    backgroundColor: CarClickerTheme.colors.panelStrong,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  resultLabel: {
    color: CarClickerTheme.colors.textMuted,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  resultValue: {
    color: CarClickerTheme.colors.money,
    fontSize: 22,
    lineHeight: 28,
  },
  rewardBox: {
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.borderStrong,
    borderRadius: CarClickerTheme.radii.control,
    backgroundColor: CarClickerTheme.colors.accentDim,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  rewardLabel: {
    color: CarClickerTheme.colors.textMuted,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  rewardName: {
    color: CarClickerTheme.colors.text,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  rewardMeta: {
    color: CarClickerTheme.colors.money,
  },
  claimedBox: {
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.success,
    borderRadius: CarClickerTheme.radii.control,
    backgroundColor: 'rgba(120, 223, 69, 0.12)',
    padding: Spacing.two,
    gap: Spacing.one,
  },
  claimedTitle: {
    color: CarClickerTheme.colors.success,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  claimedText: {
    color: CarClickerTheme.colors.textMuted,
  },
  claimButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CarClickerTheme.radii.control,
    backgroundColor: CarClickerTheme.colors.accent,
    paddingHorizontal: Spacing.three,
  },
  claimButtonPressed: {
    opacity: 0.78,
  },
  claimButtonDisabled: {
    opacity: 0.45,
  },
  claimButtonText: {
    color: CarClickerTheme.colors.background,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  resetButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    borderRadius: CarClickerTheme.radii.control,
    backgroundColor: CarClickerTheme.colors.panelStrong,
    paddingHorizontal: Spacing.three,
  },
  resetButtonDisabled: {
    opacity: 0.45,
  },
  resetButtonText: {
    color: CarClickerTheme.colors.textMuted,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
});
