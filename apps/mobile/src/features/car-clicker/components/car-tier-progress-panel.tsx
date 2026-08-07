import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { CarClickerTheme, type CarClickerTierProgress } from '@/features/car-clicker';

type CarTierProgressPanelProps = {
  progress: CarClickerTierProgress;
};

export function CarTierProgressPanel({ progress }: CarTierProgressPanelProps) {
  const progressPercent = Math.round(progress.progressRatio * 100);
  const animatedProgress = useRef(
    new Animated.Value(progress.progressRatio),
  ).current;
  const animatedWidth = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress.progressRatio,
      duration: 260,
      useNativeDriver: false,
    }).start();
  }, [animatedProgress, progress.progressRatio]);

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.title}>
          Progres auta
        </ThemedText>
        <ThemedText type="small" style={styles.status}>
          {progress.nextTier
            ? `${progress.levelsToNextTier} poziomow do Tier ${progress.nextTier}`
            : 'Maksymalny tier'}
        </ThemedText>
      </View>
      <View
        accessibilityLabel={`Postep auta ${progressPercent} procent`}
        accessibilityRole="progressbar"
        style={styles.track}>
        <Animated.View style={[styles.fill, { width: animatedWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    borderRadius: CarClickerTheme.radii.panel,
    backgroundColor: CarClickerTheme.colors.panel,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  header: {
    minHeight: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    color: CarClickerTheme.colors.text,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  status: {
    flexShrink: 1,
    color: CarClickerTheme.colors.textMuted,
    textAlign: 'right',
  },
  track: {
    height: 12,
    overflow: 'hidden',
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    borderRadius: 6,
    backgroundColor: CarClickerTheme.colors.panelMuted,
    shadowColor: CarClickerTheme.colors.click,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  fill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: CarClickerTheme.colors.click,
  },
});
