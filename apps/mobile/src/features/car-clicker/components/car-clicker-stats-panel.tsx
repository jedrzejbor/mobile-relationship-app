import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { formatCarClickerCash } from '@/features/car-clicker/format';

type CarClickerStatsPanelProps = {
  cash: number;
  perClick: number;
  perSecond: number;
};

export function CarClickerStatsPanel({
  cash,
  perClick,
  perSecond,
}: CarClickerStatsPanelProps) {
  const passivePulseOpacity = useRef(new Animated.Value(0.35)).current;
  const passiveIncomeStatus =
    perSecond > 0
      ? `Aktywny: +${formatCarClickerCash(perSecond)} / s`
      : 'Kup ulepszenie w Garazu';

  useEffect(() => {
    if (perSecond <= 0) {
      passivePulseOpacity.stopAnimation();
      passivePulseOpacity.setValue(0.35);
      return undefined;
    }

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(passivePulseOpacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(passivePulseOpacity, {
          toValue: 0.35,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
      passivePulseOpacity.setValue(0.35);
    };
  }, [passivePulseOpacity, perSecond]);

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <View style={styles.statsRow}>
        <StatItem label="Cash" value={formatCarClickerCash(cash)} />
        <StatItem label="Per click" value={`+${formatCarClickerCash(perClick)}`} />
        <StatItem label="Per second" value={`+${formatCarClickerCash(perSecond)}`} />
      </View>

      <View style={styles.passiveStatusRow}>
        <View style={styles.passiveStatusLabel}>
          <Animated.View
            style={[
              styles.passiveStatusDot,
              {
                opacity: passivePulseOpacity,
                backgroundColor: perSecond > 0 ? '#18a058' : '#8b8f97',
              },
            ]}
          />
          <ThemedText type="smallBold">Pasywny dochod</ThemedText>
        </View>
        <ThemedText
          themeColor={perSecond > 0 ? 'text' : 'textSecondary'}
          type="small"
          style={styles.passiveStatus}>
          {passiveIncomeStatus}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.item}>
      <ThemedText themeColor="textSecondary" type="small">
        {label}
      </ThemedText>
      <ThemedText type="smallBold" style={styles.value}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  item: {
    flex: 1,
    minHeight: 56,
    justifyContent: 'center',
    gap: Spacing.one,
  },
  value: {
    fontSize: 18,
    lineHeight: 24,
  },
  passiveStatusRow: {
    minHeight: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  passiveStatusLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  passiveStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  passiveStatus: {
    flexShrink: 1,
    textAlign: 'right',
  },
});
