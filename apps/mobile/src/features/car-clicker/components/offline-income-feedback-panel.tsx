import { Pressable, StyleSheet, View } from 'react-native';

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
  onDismiss: () => void;
};

export function OfflineIncomeFeedbackPanel({
  feedback,
  onDismiss,
}: OfflineIncomeFeedbackPanelProps) {
  if (!feedback) {
    return null;
  }

  return (
    <ThemedView type="backgroundElement" style={styles.panel}>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.title}>
          Zarobek offline
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Zamknij informację o zarobku offline"
          hitSlop={8}
          onPress={onDismiss}
          style={({ pressed }) => [
            styles.dismissButton,
            pressed && styles.dismissButtonPressed,
          ]}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            x
          </ThemedText>
        </Pressable>
      </View>
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
  header: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    color: '#18a058',
  },
  dismissButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  dismissButtonPressed: {
    opacity: 0.6,
  },
  copy: {
    flexShrink: 1,
  },
});
