import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { formatCarClickerCash } from '@/features/car-clicker/format';
import { CAR_CLICKER_SCREEN } from '@/features/car-clicker/screen';
import { useTheme } from '@/hooks/use-theme';

type CarTapButtonProps = {
  perClick: number;
  tier: number;
  onPress: () => void;
};

export function CarTapButton({ perClick, tier, onPress }: CarTapButtonProps) {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const feedbackTranslateY = useRef(new Animated.Value(0)).current;
  const [feedbackKey, setFeedbackKey] = useState(0);

  function handlePress() {
    onPress();
    setFeedbackKey((currentKey) => currentKey + 1);

    scale.stopAnimation();
    feedbackOpacity.stopAnimation();
    feedbackTranslateY.stopAnimation();

    scale.setValue(0.97);
    feedbackOpacity.setValue(1);
    feedbackTranslateY.setValue(0);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 140,
        useNativeDriver: true,
      }),
      Animated.timing(feedbackOpacity, {
        toValue: 0,
        duration: 620,
        useNativeDriver: true,
      }),
      Animated.timing(feedbackTranslateY, {
        toValue: -34,
        duration: 620,
        useNativeDriver: true,
      }),
    ]).start();
  }

  return (
    <Pressable
      accessibilityHint={`Dodaje ${perClick} cash`}
      accessibilityLabel={CAR_CLICKER_SCREEN.carButtonLabel}
      accessibilityRole="button"
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.backgroundSelected,
        },
        pressed && styles.buttonPressed,
      ]}>
      <ThemedText themeColor="textSecondary" style={styles.tierLabel}>
        Tier {tier}
      </ThemedText>
      <View style={styles.carStage}>
        <Animated.View
          key={feedbackKey}
          pointerEvents="none"
          style={[
            styles.clickFeedback,
            {
              opacity: feedbackOpacity,
              transform: [{ translateY: feedbackTranslateY }],
            },
          ]}>
          <ThemedText type="smallBold" style={styles.clickFeedbackText}>
            +{formatCarClickerCash(perClick)}
          </ThemedText>
        </Animated.View>

        <Animated.View style={[styles.car, { transform: [{ scale }] }]}>
          <View style={[styles.carCabin, { backgroundColor: '#f6c445' }]} />
          <View style={[styles.carBody, { backgroundColor: '#d14f27' }]}>
            <View style={[styles.carWindow, styles.carWindowLeft]} />
            <View style={[styles.carWindow, styles.carWindowRight]} />
          </View>
          <View style={styles.wheels}>
            <View style={styles.wheel} />
            <View style={styles.wheel} />
          </View>
        </Animated.View>
      </View>
      <ThemedText type="smallBold" style={styles.tapHint}>
        +{formatCarClickerCash(perClick)} za klik
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
    minHeight: 260,
    borderRadius: Spacing.three,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  tierLabel: {
    minHeight: 24,
    textAlign: 'center',
  },
  carStage: {
    width: '100%',
    maxWidth: 280,
    minHeight: 138,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  clickFeedback: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    minHeight: 28,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    justifyContent: 'center',
    backgroundColor: 'rgba(31, 122, 236, 0.14)',
  },
  clickFeedbackText: {
    color: '#1f7aec',
  },
  car: {
    width: '100%',
    aspectRatio: 2.3,
    justifyContent: 'flex-end',
  },
  carCabin: {
    position: 'absolute',
    left: '32%',
    top: '10%',
    width: '38%',
    height: '42%',
    borderTopLeftRadius: Spacing.three,
    borderTopRightRadius: Spacing.three,
  },
  carBody: {
    height: '54%',
    borderRadius: Spacing.three,
    borderTopLeftRadius: Spacing.two,
    borderTopRightRadius: Spacing.two,
  },
  carWindow: {
    position: 'absolute',
    top: Spacing.two,
    width: '18%',
    height: '30%',
    borderRadius: Spacing.one,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
  },
  carWindowLeft: {
    left: '34%',
  },
  carWindowRight: {
    right: '24%',
  },
  wheels: {
    position: 'absolute',
    left: '12%',
    right: '12%',
    bottom: -Spacing.two,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wheel: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 8,
    borderColor: '#101113',
    backgroundColor: '#6f7378',
  },
  tapHint: {
    minHeight: 24,
    textAlign: 'center',
  },
});
