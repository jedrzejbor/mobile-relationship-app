import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import {
  CarClickerTheme,
  getCarAppearance,
  type CarClickerTierFeedback,
} from '@/features/car-clicker';

type TierUpFeedbackPanelProps = {
  feedback: CarClickerTierFeedback | null;
};

export function TierUpFeedbackPanel({ feedback }: TierUpFeedbackPanelProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-8)).current;

  useEffect(() => {
    if (!feedback) {
      opacity.setValue(0);
      translateY.setValue(-8);
      return;
    }

    opacity.setValue(0);
    translateY.setValue(-8);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 7,
        tension: 110,
        useNativeDriver: true,
      }),
    ]).start();
  }, [feedback, opacity, translateY]);

  if (!feedback) {
    return null;
  }

  const appearance = getCarAppearance(feedback.currentTier);

  return (
    <Animated.View
      style={[
        styles.animatedPanel,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}>
      <View style={styles.panel}>
        <View style={styles.badge}>
          <ThemedText type="smallBold" style={styles.badgeText}>
            Tier {feedback.currentTier}
          </ThemedText>
        </View>
        <View style={styles.copyColumn}>
          <ThemedText type="smallBold" style={styles.title}>
            Awans auta
          </ThemedText>
          <ThemedText type="small" style={styles.copy}>
            Nowy wariant: {appearance.name}
          </ThemedText>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedPanel: {
    width: '100%',
  },
  panel: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: CarClickerTheme.borders.active,
    borderColor: CarClickerTheme.colors.borderStrong,
    borderRadius: CarClickerTheme.radii.panel,
    backgroundColor: CarClickerTheme.colors.accentDim,
    padding: Spacing.three,
    gap: Spacing.two,
    shadowColor: CarClickerTheme.colors.accent,
    shadowOpacity: 0.24,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  badge: {
    minWidth: 66,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.borderStrong,
    borderRadius: CarClickerTheme.radii.badge,
    backgroundColor: CarClickerTheme.colors.panelStrong,
  },
  badgeText: {
    color: CarClickerTheme.colors.accent,
    fontStyle: 'italic',
  },
  copyColumn: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: CarClickerTheme.colors.text,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  copy: {
    flexShrink: 1,
    color: CarClickerTheme.colors.textMuted,
  },
});
