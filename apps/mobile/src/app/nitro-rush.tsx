import { useEffect, useMemo, useState } from 'react';
import { Image } from 'expo-image';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import {
  CarClickerTheme,
  createNitroRushRunInputFromRunner,
  createNitroRushRunResult,
  formatCarClickerDuration,
  getNitroRushRunProgress,
  getNitroRushTrackItems,
  INITIAL_NITRO_RUSH_RUNNER_STATE,
  moveNitroRushCar,
  NITRO_RUSH_RUN_CONFIG,
  resolveNitroRushTrackItemWithOutcome,
  type NitroRushGateDefinition,
  type NitroRushLane,
  type NitroRushObstacleDefinition,
  type NitroRushRunResult,
  type NitroRushRunnerDirection,
  type NitroRushRunnerState,
  type NitroRushTrackResolution,
  type NitroRushTrackItem,
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

function getLaneLabel(lane: NitroRushLane) {
  switch (lane) {
    case 'left':
      return 'lewy';
    case 'center':
      return 'srodek';
    case 'right':
      return 'prawy';
  }
}

function getTrackItemLane(trackItem: NitroRushTrackItem) {
  return trackItem.type === 'gate'
    ? trackItem.gate.lane
    : trackItem.obstacle.lane;
}

function getTrackItemId(trackItem: NitroRushTrackItem) {
  return trackItem.type === 'gate' ? trackItem.gate.id : trackItem.obstacle.id;
}

function getTrackItemTitle(trackItem: NitroRushTrackItem) {
  return trackItem.type === 'gate'
    ? trackItem.gate.label
    : trackItem.obstacle.label;
}

function getTrackItemMeta(trackItem: NitroRushTrackItem) {
  return trackItem.type === 'gate'
    ? getGateEffectLabel(trackItem.gate)
    : getObstaclePenaltyLabel(trackItem.obstacle);
}

function hasResolvedTrackItem(
  runnerState: NitroRushRunnerState,
  trackItem: NitroRushTrackItem,
) {
  const trackItemId = getTrackItemId(trackItem);

  return trackItem.type === 'gate'
    ? runnerState.selection.collectedGateIds.includes(trackItemId)
    : runnerState.selection.hitObstacleIds.includes(trackItemId);
}

function getResolutionFeedback(resolution: NitroRushTrackResolution) {
  switch (resolution.outcome) {
    case 'collected_gate':
      return {
        tone: 'success' as const,
        title: 'Zebrano bonus',
        text: resolution.trackItem ? getTrackItemMeta(resolution.trackItem) : '',
      };
    case 'missed_gate':
      return {
        tone: 'neutral' as const,
        title: 'Minieto bramke',
        text: resolution.trackItem
          ? `Potrzebny pas: ${getLaneLabel(getTrackItemLane(resolution.trackItem))}`
          : '',
      };
    case 'avoided_obstacle':
      return {
        tone: 'success' as const,
        title: 'Ominieto przeszkode',
        text: resolution.trackItem
          ? `Przeszkoda byla na pasie: ${getLaneLabel(
              getTrackItemLane(resolution.trackItem),
            )}`
          : '',
      };
    case 'hit_obstacle':
      return {
        tone: 'danger' as const,
        title: 'Trafiono przeszkode',
        text: resolution.trackItem ? getTrackItemMeta(resolution.trackItem) : '',
      };
    case 'complete':
      return {
        tone: 'neutral' as const,
        title: 'Run zakonczony',
        text: 'Mozesz odebrac bonus albo zaczac od nowa.',
      };
  }
}

export default function NitroRushScreen() {
  const { actions, garageView } = useCarClickerGame();
  const [runnerState, setRunnerState] = useState<NitroRushRunnerState>(
    INITIAL_NITRO_RUSH_RUNNER_STATE,
  );
  const [isRunActive, setIsRunActive] = useState(false);
  const [lastClaimedResult, setLastClaimedResult] =
    useState<NitroRushRunResult | null>(null);
  const [lastResolution, setLastResolution] =
    useState<NitroRushTrackResolution | null>(null);
  const trackItems = useMemo(() => getNitroRushTrackItems(), []);
  const currentTrackItem = trackItems[runnerState.currentItemIndex] ?? null;
  const runProgress = useMemo(
    () => getNitroRushRunProgress(runnerState),
    [runnerState],
  );
  const resolutionFeedback = lastResolution
    ? getResolutionFeedback(lastResolution)
    : null;
  const runInput = useMemo(
    () => createNitroRushRunInputFromRunner(runnerState),
    [runnerState],
  );
  const runResult = useMemo(
    () => createNitroRushRunResult(runInput),
    [runInput],
  );

  useEffect(() => {
    if (!isRunActive || runProgress.isComplete) {
      return;
    }

    const stepTimeout = setTimeout(() => {
      const resolution = resolveNitroRushTrackItemWithOutcome(runnerState);
      const nextProgress = getNitroRushRunProgress(resolution.runnerState);

      setLastClaimedResult(null);
      setLastResolution(resolution);
      setRunnerState(resolution.runnerState);
      setIsRunActive(!nextProgress.isComplete);
    }, NITRO_RUSH_RUN_CONFIG.stepDurationMs);

    return () => {
      clearTimeout(stepTimeout);
    };
  }, [isRunActive, runProgress.isComplete, runnerState]);

  function moveCar(direction: NitroRushRunnerDirection) {
    setLastClaimedResult(null);
    setRunnerState((currentRunnerState) =>
      moveNitroRushCar(currentRunnerState, direction),
    );
  }

  function toggleAutoRun() {
    setLastClaimedResult(null);
    setIsRunActive((currentIsRunActive) => !currentIsRunActive);
  }

  function resetRun() {
    setIsRunActive(false);
    setRunnerState(INITIAL_NITRO_RUSH_RUNNER_STATE);
    setLastResolution(null);
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
                  Przejazd
                </ThemedText>
                <ThemedText type="smallBold" style={styles.multiplierBadge}>
                  x{runResult.finalMultiplier.toFixed(1)}
                </ThemedText>
              </View>

              <View style={styles.track}>
                {trackItems.map((trackItem, trackItemIndex) => {
                  const isCurrent =
                    trackItemIndex === runnerState.currentItemIndex;
                  const isPast = trackItemIndex < runnerState.currentItemIndex;
                  const isResolved = hasResolvedTrackItem(runnerState, trackItem);

                  return (
                    <View
                      key={getTrackItemId(trackItem)}
                      style={[
                        styles.trackTile,
                        trackItem.type === 'gate'
                          ? styles.gateTile
                          : styles.obstacleTile,
                        isCurrent && styles.trackTileCurrent,
                        isPast && styles.trackTilePast,
                        isResolved &&
                          (trackItem.type === 'gate'
                            ? styles.gateTileSelected
                            : styles.obstacleTileSelected),
                        getLaneStyle(getTrackItemLane(trackItem)),
                      ]}>
                      <ThemedText type="smallBold" style={styles.tileTitle}>
                        {getTrackItemTitle(trackItem)}
                      </ThemedText>
                      <ThemedText type="small" style={styles.tileMeta}>
                        {getTrackItemMeta(trackItem)}
                      </ThemedText>
                    </View>
                  );
                })}
              </View>

              <View style={styles.runnerStatus}>
                <ThemedText type="smallBold" style={styles.runnerStatusText}>
                  Pas: {getLaneLabel(runnerState.currentLane)}
                </ThemedText>
                <ThemedText type="smallBold" style={styles.runnerStatusText}>
                  {runProgress.completedItems} / {runProgress.totalItems}
                </ThemedText>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${runProgress.progressRatio * 100}%` },
                  ]}
                />
              </View>

              {resolutionFeedback ? (
                <View
                  style={[
                    styles.resolutionBox,
                    resolutionFeedback.tone === 'success' &&
                      styles.resolutionBoxSuccess,
                    resolutionFeedback.tone === 'danger' &&
                      styles.resolutionBoxDanger,
                  ]}>
                  <ThemedText type="smallBold" style={styles.resolutionTitle}>
                    {resolutionFeedback.title}
                  </ThemedText>
                  <ThemedText type="small" style={styles.resolutionText}>
                    {resolutionFeedback.text}
                  </ThemedText>
                </View>
              ) : null}

              <View style={[styles.carLane, getLaneStyle(runnerState.currentLane)]}>
                <Image
                  accessibilityIgnoresInvertColors
                  contentFit="contain"
                  source={garageView.currentCar.stageAsset.source}
                  style={styles.carImage}
                />
              </View>

              <View style={styles.runnerControls}>
                <RunnerControlButton
                  disabled={runnerState.currentLane === 'left' || runProgress.isComplete}
                  label="Lewo"
                  onPress={() => moveCar('left')}
                />
                <RunnerControlButton
                  disabled={!currentTrackItem && !isRunActive}
                  label={isRunActive ? 'Pauza' : 'Start'}
                  onPress={toggleAutoRun}
                />
                <RunnerControlButton
                  disabled={
                    runnerState.currentLane === 'right' || runProgress.isComplete
                  }
                  label="Prawo"
                  onPress={() => moveCar('right')}
                />
              </View>
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
                disabled={!runProgress.canClaimReward}
                onPress={claimReward}
                style={({ pressed }) => [
                  styles.claimButton,
                  !runProgress.canClaimReward && styles.claimButtonDisabled,
                  pressed && styles.claimButtonPressed,
                ]}>
                <ThemedText type="smallBold" style={styles.claimButtonText}>
                  Odbierz bonus
                </ThemedText>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={!runProgress.hasRunEvents && !runProgress.isComplete}
                onPress={resetRun}
                style={({ pressed }) => [
                  styles.resetButton,
                  !runProgress.hasRunEvents &&
                    !runProgress.isComplete &&
                    styles.resetButtonDisabled,
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

function RunnerControlButton({
  disabled,
  label,
  onPress,
}: {
  disabled: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.runnerControlButton,
        disabled && styles.runnerControlButtonDisabled,
        pressed && styles.claimButtonPressed,
      ]}>
      <ThemedText type="smallBold" style={styles.runnerControlButtonText}>
        {label}
      </ThemedText>
    </Pressable>
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
  trackTileCurrent: {
    borderColor: CarClickerTheme.colors.text,
    transform: [{ scale: 1.04 }],
  },
  trackTilePast: {
    opacity: 0.62,
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
  runnerStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  runnerStatusText: {
    color: CarClickerTheme.colors.textMuted,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  progressTrack: {
    height: 8,
    overflow: 'hidden',
    borderRadius: CarClickerTheme.radii.badge,
    backgroundColor: CarClickerTheme.colors.panelStrong,
  },
  progressFill: {
    height: '100%',
    borderRadius: CarClickerTheme.radii.badge,
    backgroundColor: CarClickerTheme.colors.accent,
  },
  resolutionBox: {
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    borderRadius: CarClickerTheme.radii.control,
    backgroundColor: CarClickerTheme.colors.panelStrong,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  resolutionBoxSuccess: {
    borderColor: CarClickerTheme.colors.success,
    backgroundColor: 'rgba(120, 223, 69, 0.12)',
  },
  resolutionBoxDanger: {
    borderColor: CarClickerTheme.colors.danger,
    backgroundColor: 'rgba(255, 92, 112, 0.14)',
  },
  resolutionTitle: {
    color: CarClickerTheme.colors.text,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  resolutionText: {
    color: CarClickerTheme.colors.textMuted,
  },
  carLane: {
    width: '44%',
    minHeight: 118,
    justifyContent: 'center',
  },
  carImage: {
    width: '100%',
    height: 118,
  },
  runnerControls: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  runnerControlButton: {
    flex: 1,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.borderStrong,
    borderRadius: CarClickerTheme.radii.control,
    backgroundColor: CarClickerTheme.colors.panelStrong,
    paddingHorizontal: Spacing.two,
  },
  runnerControlButtonDisabled: {
    opacity: 0.45,
  },
  runnerControlButtonText: {
    color: CarClickerTheme.colors.text,
    fontStyle: 'italic',
    textAlign: 'center',
    textTransform: 'uppercase',
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
