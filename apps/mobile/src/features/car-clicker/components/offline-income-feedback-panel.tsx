import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import {
  formatCarClickerCash,
  formatCarClickerDuration,
  type CarClickerOfflineIncomeFeedback,
} from '@/features/car-clicker';

type OfflineIncomeFeedbackPanelProps = {
  feedback: CarClickerOfflineIncomeFeedback | null;
};

export function OfflineIncomeFeedbackPanel({
  feedback,
}: OfflineIncomeFeedbackPanelProps) {
  if (!feedback) {
    return null;
  }

  return (
    <ThemedView type="backgroundElement" style={styles.panel}>
      <ThemedText type="smallBold" style={styles.title}>
        Zarobek offline
      </ThemedText>
      <ThemedText themeColor="textSecondary" type="small" style={styles.copy}>
        +{formatCarClickerCash(feedback.earnedCash)} cash przez{' '}
        {formatCarClickerDuration(feedback.elapsedSeconds)}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  panel: {
    minHeight: 56,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  title: {
    color: '#18a058',
  },
  copy: {
    flexShrink: 1,
  },
});
