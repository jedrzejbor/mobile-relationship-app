import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { CarClickerTheme, useCarClickerLayout } from '@/features/car-clicker';

type CarClickerScreenHeaderProps = {
  subtitle: string;
  title: string;
};

export function CarClickerScreenHeader({
  subtitle,
  title,
}: CarClickerScreenHeaderProps) {
  const { isCompactLayout } = useCarClickerLayout();

  return (
    <View style={[styles.header, isCompactLayout && styles.headerCompact]}>
      {!isCompactLayout && (
        <View pointerEvents="none" style={styles.trackMarkLeft}>
          <View style={styles.trackDot} />
          <View style={styles.trackDot} />
          <View style={styles.trackDot} />
          <View style={styles.trackDot} />
        </View>
      )}

      <View style={styles.titleGroup}>
        <ThemedText type="subtitle" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {subtitle}
        </ThemedText>
      </View>

      {!isCompactLayout && (
        <View pointerEvents="none" style={styles.accentStripes}>
          <View style={styles.accentStripe} />
          <View style={styles.accentStripe} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 84,
    overflow: 'hidden',
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    borderRadius: CarClickerTheme.radii.panel,
    backgroundColor: CarClickerTheme.colors.panel,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    justifyContent: 'center',
    shadowColor: CarClickerTheme.colors.accent,
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  headerCompact: {
    minHeight: 72,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  titleGroup: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  title: {
    color: CarClickerTheme.colors.text,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  subtitle: {
    color: CarClickerTheme.colors.textMuted,
    textAlign: 'center',
  },
  trackMarkLeft: {
    position: 'absolute',
    left: Spacing.three,
    top: Spacing.two,
    width: 44,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    opacity: 0.28,
    transform: [{ rotate: '-18deg' }],
  },
  trackDot: {
    width: 8,
    height: 12,
    borderRadius: 2,
    backgroundColor: CarClickerTheme.colors.textDim,
  },
  accentStripes: {
    position: 'absolute',
    right: Spacing.three,
    top: Spacing.two,
    flexDirection: 'row',
    gap: Spacing.one,
    transform: [{ rotate: '24deg' }],
  },
  accentStripe: {
    width: 8,
    height: 64,
    borderRadius: 4,
    backgroundColor: CarClickerTheme.colors.accent,
    opacity: 0.42,
  },
});
