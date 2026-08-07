import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getCarAppearance, type CarClickerTierFeedback } from '@/features/car-clicker';

type TierUpFeedbackPanelProps = {
  feedback: CarClickerTierFeedback | null;
};

export function TierUpFeedbackPanel({ feedback }: TierUpFeedbackPanelProps) {
  if (!feedback) {
    return null;
  }

  const appearance = getCarAppearance(feedback.currentTier);

  return (
    <ThemedView type="backgroundElement" style={styles.panel}>
      <ThemedText type="smallBold" style={styles.title}>
        Awans auta: Tier {feedback.currentTier}
      </ThemedText>
      <ThemedText themeColor="textSecondary" type="small" style={styles.copy}>
        Nowy wariant: {appearance.name}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  panel: {
    minHeight: 64,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  title: {
    color: '#1f7aec',
  },
  copy: {
    flexShrink: 1,
  },
});
