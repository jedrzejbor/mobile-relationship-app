import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { CarClickerActiveBonusView } from '@/features/car-clicker/bonuses';
import {
  formatCarClickerCash,
  formatCarClickerDuration,
} from '@/features/car-clicker/format';
import { CarClickerTheme } from '@/features/car-clicker/theme';

type CarClickerStatsPanelProps = {
  activeBonusViews?: readonly CarClickerActiveBonusView[];
  cash: number;
  perClick: number;
  perSecond: number;
};

export function CarClickerStatsPanel({
  activeBonusViews = [],
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
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <StatItem
          label="Cash"
          tone="money"
          value={formatCarClickerCash(cash)}
        />
        <StatItem
          label="Za klik"
          tone="click"
          value={`+${formatCarClickerCash(perClick)}`}
        />
        <StatItem
          label="Na sekunde"
          tone="passive"
          value={`+${formatCarClickerCash(perSecond)}`}
        />
      </View>

      <View style={styles.passiveStatusRow}>
        <View style={styles.passiveStatusLabel}>
          <Animated.View
            style={[
              styles.passiveStatusDot,
              {
                opacity: passivePulseOpacity,
                backgroundColor: perSecond > 0
                  ? CarClickerTheme.colors.passive
                  : CarClickerTheme.colors.textDim,
              },
            ]}
          />
          <ThemedText type="smallBold" style={styles.passiveStatusTitle}>
            Pasywny dochod
          </ThemedText>
        </View>
        <ThemedText
          type="small"
          style={styles.passiveStatus}>
          {passiveIncomeStatus}
        </ThemedText>
      </View>

      {activeBonusViews.length > 0 ? (
        <View style={styles.bonusList}>
          <ThemedText type="smallBold" style={styles.bonusListTitle}>
            Aktywne bonusy
          </ThemedText>
          {activeBonusViews.map((bonusView) => (
            <ActiveBonusItem
              bonusView={bonusView}
              key={bonusView.bonus.id}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function StatItem({
  label,
  tone,
  value,
}: {
  label: string;
  tone: 'click' | 'money' | 'passive';
  value: string;
}) {
  const valueColor = CarClickerTheme.colors[tone];

  return (
    <View style={styles.item}>
      <ThemedText type="smallBold" style={styles.label}>
        {label}
      </ThemedText>
      <ThemedText type="smallBold" style={[styles.value, { color: valueColor }]}>
        {value}
      </ThemedText>
    </View>
  );
}

function ActiveBonusItem({
  bonusView,
}: {
  bonusView: CarClickerActiveBonusView;
}) {
  const progressPercent = `${Math.round(
    Math.min(Math.max(bonusView.progressRatio, 0), 1) * 100,
  )}%` as const;

  return (
    <View style={styles.bonusItem}>
      <View style={styles.bonusHeader}>
        <ThemedText type="smallBold" style={styles.bonusName}>
          {bonusView.bonus.label}
        </ThemedText>
        <ThemedText type="smallBold" style={styles.bonusMultiplier}>
          x{bonusView.bonus.multiplier.toFixed(1)}
        </ThemedText>
      </View>
      <ThemedText type="small" style={styles.bonusTime}>
        {formatCarClickerDuration(bonusView.remainingSeconds)}
      </ThemedText>
      <View
        accessibilityLabel={`Pozostaly czas bonusu ${progressPercent}`}
        accessibilityRole="progressbar"
        style={styles.bonusProgressTrack}>
        <View
          style={[
            styles.bonusProgressFill,
            {
              width: progressPercent,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: CarClickerTheme.radii.panel,
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    backgroundColor: CarClickerTheme.colors.panel,
    padding: Spacing.three,
    gap: Spacing.three,
    shadowColor: CarClickerTheme.colors.accent,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  item: {
    flex: 1,
    minWidth: 104,
    minHeight: 64,
    justifyContent: 'center',
    borderRadius: CarClickerTheme.radii.control,
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    backgroundColor: CarClickerTheme.colors.panelStrong,
    paddingHorizontal: Spacing.two,
    gap: Spacing.one,
  },
  label: {
    color: CarClickerTheme.colors.textMuted,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 22,
    lineHeight: 28,
  },
  passiveStatusRow: {
    minHeight: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
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
  passiveStatusTitle: {
    color: CarClickerTheme.colors.text,
  },
  passiveStatus: {
    flexShrink: 1,
    color: CarClickerTheme.colors.textMuted,
    textAlign: 'right',
  },
  bonusList: {
    gap: Spacing.two,
  },
  bonusListTitle: {
    color: CarClickerTheme.colors.text,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  bonusItem: {
    borderRadius: CarClickerTheme.radii.control,
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    backgroundColor: CarClickerTheme.colors.panelStrong,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  bonusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  bonusName: {
    flexShrink: 1,
    color: CarClickerTheme.colors.accent,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  bonusMultiplier: {
    color: CarClickerTheme.colors.money,
  },
  bonusTime: {
    color: CarClickerTheme.colors.textMuted,
  },
  bonusProgressTrack: {
    width: '100%',
    height: 6,
    overflow: 'hidden',
    borderRadius: CarClickerTheme.radii.badge,
    backgroundColor: CarClickerTheme.colors.panelMuted,
  },
  bonusProgressFill: {
    height: '100%',
    borderRadius: CarClickerTheme.radii.badge,
    backgroundColor: CarClickerTheme.colors.accent,
  },
});
