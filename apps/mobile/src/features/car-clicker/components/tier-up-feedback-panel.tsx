import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getCarAppearance, type CarClickerTierFeedback } from '@/features/car-clicker';

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
      <ThemedView type="backgroundElement" style={styles.panel}>
      <ThemedText type="smallBold" style={styles.title}>
        Awans auta: Tier {feedback.currentTier}
      </ThemedText>
      <ThemedText themeColor="textSecondary" type="small" style={styles.copy}>
        Nowy wariant: {appearance.name}
      </ThemedText>
      </ThemedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedPanel: {
    width: '100%',
  },
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
