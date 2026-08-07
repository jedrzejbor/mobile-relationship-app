import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { formatCarClickerCash } from '@/features/car-clicker/format';
import { useTheme } from '@/hooks/use-theme';

type CarTapButtonProps = {
  perClick: number;
  tier: number;
  onPress: () => void;
};

export function CarTapButton({ perClick, tier, onPress }: CarTapButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityHint={`Dodaje ${perClick} cash`}
      accessibilityLabel="Kliknij samochod"
      accessibilityRole="button"
      onPress={onPress}
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
      <View style={styles.car}>
        <View style={[styles.carCabin, { backgroundColor: '#f6c445' }]} />
        <View style={[styles.carBody, { backgroundColor: '#d14f27' }]}>
          <View style={[styles.carWindow, styles.carWindowLeft]} />
          <View style={[styles.carWindow, styles.carWindowRight]} />
        </View>
        <View style={styles.wheels}>
          <View style={styles.wheel} />
          <View style={styles.wheel} />
        </View>
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
  car: {
    width: '100%',
    maxWidth: 280,
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
