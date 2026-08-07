import { StyleSheet, View } from 'react-native';

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
  const passiveIncomeStatus =
    perSecond > 0
      ? `Aktywny: +${formatCarClickerCash(perSecond)} / s`
      : 'Kup ulepszenie w Garazu';

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <View style={styles.statsRow}>
        <StatItem label="Cash" value={formatCarClickerCash(cash)} />
        <StatItem label="Per click" value={`+${formatCarClickerCash(perClick)}`} />
        <StatItem label="Per second" value={`+${formatCarClickerCash(perSecond)}`} />
      </View>

      <View style={styles.passiveStatusRow}>
        <ThemedText type="smallBold">Pasywny dochod</ThemedText>
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
  passiveStatus: {
    flexShrink: 1,
    textAlign: 'right',
  },
});
