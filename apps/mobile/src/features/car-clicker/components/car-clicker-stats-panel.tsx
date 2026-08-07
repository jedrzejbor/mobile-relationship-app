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
  return (
    <ThemedView type="backgroundElement" style={styles.panel}>
      <StatItem label="Cash" value={formatCarClickerCash(cash)} />
      <StatItem label="Per click" value={`+${formatCarClickerCash(perClick)}`} />
      <StatItem label="Per second" value={`+${formatCarClickerCash(perSecond)}`} />
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
  panel: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
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
});
