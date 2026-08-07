import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { CarClickerTierProgress } from '@/features/car-clicker';
import { useTheme } from '@/hooks/use-theme';

type CarTierProgressPanelProps = {
  progress: CarClickerTierProgress;
};

export function CarTierProgressPanel({ progress }: CarTierProgressPanelProps) {
  const theme = useTheme();
  const progressPercent = Math.round(progress.progressRatio * 100);

  return (
    <ThemedView type="backgroundElement" style={styles.panel}>
      <View style={styles.header}>
        <ThemedText type="smallBold">Progres auta</ThemedText>
        <ThemedText themeColor="textSecondary" type="small" style={styles.status}>
          {progress.nextTier
            ? `${progress.levelsToNextTier} poziomow do Tier ${progress.nextTier}`
            : 'Maksymalny tier'}
        </ThemedText>
      </View>
      <View
        accessibilityLabel={`Postep auta ${progressPercent} procent`}
        accessibilityRole="progressbar"
        style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: '#1f7aec',
              width: `${progressPercent}%`,
            },
          ]}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  header: {
    minHeight: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  status: {
    flexShrink: 1,
    textAlign: 'right',
  },
  track: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
});
