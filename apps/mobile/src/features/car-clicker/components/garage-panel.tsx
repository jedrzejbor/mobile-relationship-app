import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import {
  CarClickerTheme,
  formatCarClickerCash,
  type CarClickerCarId,
  type CarClickerCarView,
  type CarClickerGarageView,
  type CarClickerLocationId,
  type CarClickerLocationView,
  type CarClickerUnlockRequirementProgress,
} from '@/features/car-clicker';

type GaragePanelProps = {
  garageView: CarClickerGarageView;
  onSelectCar: (carId: CarClickerCarId) => void;
  onSelectLocation: (locationId: CarClickerLocationId) => void;
};

function formatUnlockRequirementProgress(
  unlockProgress: CarClickerUnlockRequirementProgress,
) {
  switch (unlockProgress.requirement.type) {
    case 'default':
      return 'Dostepne od startu';
    case 'cash':
      return unlockProgress.missingCash > 0
        ? `Brakuje ${formatCarClickerCash(unlockProgress.missingCash)} cash`
        : `Wymaga ${formatCarClickerCash(unlockProgress.requirement.value)} cash`;
    case 'tier':
      return unlockProgress.missingTiers > 0
        ? `Brakuje ${unlockProgress.missingTiers} tier`
        : `Wymaga tier ${unlockProgress.requirement.value}`;
  }
}

export function GaragePanel({
  garageView,
  onSelectCar,
  onSelectLocation,
}: GaragePanelProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.title}>
          Garaz
        </ThemedText>
        <ThemedText type="small" style={styles.subtitle}>
          Auto i lokacja przygotowane pod kolejne etapy progresji
        </ThemedText>
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryItem}>
          <ThemedText type="smallBold" style={styles.summaryLabel}>
            Aktualne auto
          </ThemedText>
          <ThemedText type="smallBold" style={styles.summaryValue}>
            {garageView.currentCar.definition.name}
          </ThemedText>
        </View>
        <View style={styles.summaryItem}>
          <ThemedText type="smallBold" style={styles.summaryLabel}>
            Lokacja
          </ThemedText>
          <ThemedText type="smallBold" style={styles.summaryValue}>
            {garageView.currentLocation.definition.name}
          </ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Samochody
        </ThemedText>
        {garageView.cars.map((car) => (
          <CarOption
            car={car}
            key={car.definition.id}
            onPress={() => onSelectCar(car.definition.id)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Lokacje
        </ThemedText>
        {garageView.locations.map((location) => (
          <LocationOption
            key={location.definition.id}
            location={location}
            onPress={() => onSelectLocation(location.definition.id)}
          />
        ))}
      </View>
    </View>
  );
}

function CarOption({
  car,
  onPress,
}: {
  car: CarClickerCarView;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        disabled: !car.isUnlocked,
        selected: car.isCurrent,
      }}
      disabled={!car.isUnlocked}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        car.isCurrent && styles.optionCurrent,
        !car.isUnlocked && styles.optionLocked,
        pressed && styles.optionPressed,
      ]}>
      <Image
        accessibilityIgnoresInvertColors
        contentFit="contain"
        source={car.stageAsset.source}
        style={styles.carImage}
      />
      <View style={styles.optionContent}>
        <ThemedText type="smallBold" style={styles.optionTitle}>
          {car.definition.name}
        </ThemedText>
        <ThemedText type="small" style={styles.optionDescription}>
          {car.definition.description}
        </ThemedText>
        <ThemedText type="smallBold" style={styles.optionMeta}>
          {car.isUnlocked
            ? 'Odblokowane'
            : formatUnlockRequirementProgress(car.unlockProgress)}
        </ThemedText>
        {!car.isUnlocked ? (
          <UnlockProgressBar progressRatio={car.unlockProgress.progressRatio} />
        ) : null}
      </View>
    </Pressable>
  );
}

function LocationOption({
  location,
  onPress,
}: {
  location: CarClickerLocationView;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        disabled: !location.isUnlocked,
        selected: location.isCurrent,
      }}
      disabled={!location.isUnlocked}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        location.isCurrent && styles.optionCurrent,
        !location.isUnlocked && styles.optionLocked,
        pressed && styles.optionPressed,
      ]}>
      <Image
        accessibilityIgnoresInvertColors
        contentFit="cover"
        source={location.asset.source}
        style={styles.locationImage}
      />
      <View style={styles.optionContent}>
        <ThemedText type="smallBold" style={styles.optionTitle}>
          {location.definition.name}
        </ThemedText>
        <ThemedText type="small" style={styles.optionDescription}>
          {location.definition.description}
        </ThemedText>
        <ThemedText type="smallBold" style={styles.optionMeta}>
          {location.isUnlocked
            ? `x${location.definition.passiveIncomeMultiplier.toFixed(2)} passive`
            : formatUnlockRequirementProgress(location.unlockProgress)}
        </ThemedText>
        {!location.isUnlocked ? (
          <UnlockProgressBar
            progressRatio={location.unlockProgress.progressRatio}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

function UnlockProgressBar({ progressRatio }: { progressRatio: number }) {
  const progressPercent = `${Math.round(
    Math.min(Math.max(progressRatio, 0), 1) * 100,
  )}%` as const;

  return (
    <View
      accessibilityLabel={`Postep odblokowania ${progressPercent}`}
      accessibilityRole="progressbar"
      style={styles.unlockProgressTrack}>
      <View
        style={[
          styles.unlockProgressFill,
          {
            width: progressPercent,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    borderRadius: CarClickerTheme.radii.panel,
    backgroundColor: CarClickerTheme.colors.panel,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.one,
  },
  title: {
    color: CarClickerTheme.colors.text,
    fontSize: 20,
    lineHeight: 26,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  subtitle: {
    color: CarClickerTheme.colors.textMuted,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  summaryItem: {
    flex: 1,
    minWidth: 132,
    minHeight: 58,
    justifyContent: 'center',
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    borderRadius: CarClickerTheme.radii.control,
    backgroundColor: CarClickerTheme.colors.panelStrong,
    paddingHorizontal: Spacing.two,
    gap: Spacing.one,
  },
  summaryLabel: {
    color: CarClickerTheme.colors.textMuted,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: CarClickerTheme.colors.accent,
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    color: CarClickerTheme.colors.text,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  option: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    borderRadius: CarClickerTheme.radii.panel,
    backgroundColor: CarClickerTheme.colors.panelStrong,
    padding: Spacing.two,
    gap: Spacing.two,
  },
  optionCurrent: {
    borderColor: CarClickerTheme.colors.borderStrong,
    backgroundColor: CarClickerTheme.colors.accentDim,
  },
  optionLocked: {
    opacity: 0.48,
  },
  optionPressed: {
    opacity: 0.78,
  },
  carImage: {
    width: 112,
    height: 64,
  },
  locationImage: {
    width: 112,
    height: 64,
    borderRadius: CarClickerTheme.radii.control,
  },
  optionContent: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.one,
  },
  optionTitle: {
    color: CarClickerTheme.colors.text,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  optionDescription: {
    color: CarClickerTheme.colors.textMuted,
  },
  optionMeta: {
    color: CarClickerTheme.colors.click,
    textTransform: 'uppercase',
  },
  unlockProgressTrack: {
    width: '100%',
    height: 6,
    overflow: 'hidden',
    borderRadius: CarClickerTheme.radii.badge,
    backgroundColor: CarClickerTheme.colors.panelMuted,
  },
  unlockProgressFill: {
    height: '100%',
    borderRadius: CarClickerTheme.radii.badge,
    backgroundColor: CarClickerTheme.colors.accent,
  },
});
