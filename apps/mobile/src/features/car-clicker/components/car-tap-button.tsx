import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { getCarAppearance } from '@/features/car-clicker/car-appearance';
import { formatCarClickerCash } from '@/features/car-clicker/format';
import { CAR_CLICKER_SCREEN } from '@/features/car-clicker/screen';
import {
  CarClickerTheme,
  getStarterCarStageAsset,
} from '@/features/car-clicker';

type CarTapButtonProps = {
  perClick: number;
  tier: number;
  onPress: () => void;
};

export function CarTapButton({ perClick, tier, onPress }: CarTapButtonProps) {
  const appearance = getCarAppearance(tier);
  const stageAsset = getStarterCarStageAsset(tier);
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
        pressed && styles.buttonPressed,
      ]}>
      <ThemedText style={styles.tierLabel}>
        Tier {tier} · {appearance.name} · {stageAsset.label}
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

        <Animated.View style={[styles.carFrame, { transform: [{ scale }] }]}>
          <Image
            accessibilityIgnoresInvertColors
            contentFit="contain"
            source={stageAsset.source}
            style={styles.carImage}
          />
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
    maxWidth: 560,
    minHeight: 284,
    borderRadius: CarClickerTheme.radii.panel,
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.borderStrong,
    backgroundColor: CarClickerTheme.colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.three,
    gap: Spacing.three,
    shadowColor: CarClickerTheme.colors.accent,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  tierLabel: {
    minHeight: 24,
    color: CarClickerTheme.colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  carStage: {
    width: '100%',
    minHeight: 188,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clickFeedback: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    minHeight: 28,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    justifyContent: 'center',
    backgroundColor: CarClickerTheme.colors.accentDim,
  },
  clickFeedbackText: {
    color: CarClickerTheme.colors.money,
  },
  carFrame: {
    width: '100%',
    aspectRatio: 1.72,
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  tapHint: {
    minHeight: 24,
    color: CarClickerTheme.colors.click,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
