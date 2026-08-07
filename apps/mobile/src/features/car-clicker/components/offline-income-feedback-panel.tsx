import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import {
  CarClickerTheme,
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
    <View style={styles.panel}>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.title}>
          Zarobek offline
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Zamknij informacje o zarobku offline"
          hitSlop={8}
          onPress={onDismiss}
          style={({ pressed }) => [
            styles.dismissButton,
            pressed && styles.dismissButtonPressed,
          ]}>
          <ThemedText type="smallBold" style={styles.dismissButtonText}>
            x
          </ThemedText>
        </Pressable>
      </View>
      <ThemedText type="small" style={styles.copy}>
        +{formatCarClickerCash(feedback.earnedCash)} cash przez{' '}
        {formatCarClickerDuration(feedback.elapsedSeconds)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    minHeight: 56,
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.money,
    borderRadius: CarClickerTheme.radii.panel,
    backgroundColor: CarClickerTheme.colors.panel,
    padding: Spacing.three,
    gap: Spacing.one,
    shadowColor: CarClickerTheme.colors.money,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  header: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    color: CarClickerTheme.colors.money,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  dismissButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    borderRadius: 14,
    backgroundColor: CarClickerTheme.colors.panelStrong,
  },
  dismissButtonPressed: {
    opacity: 0.6,
  },
  dismissButtonText: {
    color: CarClickerTheme.colors.textMuted,
  },
  copy: {
    flexShrink: 1,
    color: CarClickerTheme.colors.textMuted,
  },
});
