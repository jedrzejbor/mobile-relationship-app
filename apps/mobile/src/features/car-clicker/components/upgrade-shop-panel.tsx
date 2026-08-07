import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import {
  CAR_CLICKER_UPGRADE_CATEGORY_OPTIONS,
  formatCarClickerCash,
  type CarClickerUpgradeCategoryFilter,
  type CarClickerUpgradeId,
  type CarClickerUpgradeView,
} from '@/features/car-clicker';
import { useTheme } from '@/hooks/use-theme';

type UpgradeShopPanelProps = {
  selectedCategory: CarClickerUpgradeCategoryFilter;
  upgrades: CarClickerUpgradeView[];
  onCategoryChange: (category: CarClickerUpgradeCategoryFilter) => void;
  onPurchase: (upgradeId: CarClickerUpgradeId) => void;
};

export function UpgradeShopPanel({
  selectedCategory,
  upgrades,
  onCategoryChange,
  onPurchase,
}: UpgradeShopPanelProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.panel}>
      <View style={styles.header}>
        <ThemedText type="smallBold">Ulepszenia</ThemedText>
        <ThemedText themeColor="textSecondary" type="small">
          Kup tuning i zwieksz zarobek
        </ThemedText>
      </View>

      <View style={styles.categoryList}>
        {CAR_CLICKER_UPGRADE_CATEGORY_OPTIONS.map((category) => (
          <CategoryButton
            isSelected={selectedCategory === category.id}
            key={category.id}
            label={category.label}
            onPress={() => onCategoryChange(category.id)}
          />
        ))}
      </View>

      <View style={styles.list}>
        {upgrades.map((upgradeView) => (
          <UpgradeRow
            key={upgradeView.upgrade.id}
            onPurchase={onPurchase}
            upgradeView={upgradeView}
          />
        ))}
      </View>
    </ThemedView>
  );
}

function CategoryButton({
  isSelected,
  label,
  onPress,
}: {
  isSelected: boolean;
  label: string;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryButton,
        {
          backgroundColor: isSelected ? theme.text : theme.backgroundSelected,
        },
        pressed && styles.categoryButtonPressed,
      ]}>
      <ThemedText
        type="smallBold"
        style={{
          color: isSelected ? theme.background : theme.textSecondary,
        }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function UpgradeRow({
  onPurchase,
  upgradeView,
}: {
  upgradeView: CarClickerUpgradeView;
  onPurchase: (upgradeId: CarClickerUpgradeId) => void;
}) {
  const theme = useTheme();
  const { upgrade } = upgradeView;
  const effectLabel = getUpgradeEffectLabel(upgradeView);
  const buttonLabel = upgradeView.isMaxLevelReached
    ? 'Max'
    : formatCarClickerCash(upgradeView.nextCost);

  return (
    <View style={[styles.row, { borderColor: theme.backgroundSelected }]}>
      <View style={styles.rowContent}>
        <View style={styles.rowTitleLine}>
          <ThemedText type="smallBold" style={styles.upgradeName}>
            {upgrade.name}
          </ThemedText>
          <ThemedText themeColor="textSecondary" type="small">
            Lv. {upgradeView.level}
          </ThemedText>
        </View>
        <ThemedText themeColor="textSecondary" type="small" style={styles.description}>
          {upgrade.description}
        </ThemedText>
        <ThemedText type="small" style={styles.effect}>
          {effectLabel}
        </ThemedText>
        {!upgradeView.isAffordable && !upgradeView.isMaxLevelReached && (
          <ThemedText themeColor="textSecondary" type="small">
            Brakuje {formatCarClickerCash(upgradeView.missingCash)}
          </ThemedText>
        )}
      </View>

      <Pressable
        accessibilityLabel={`Kup ${upgrade.name}`}
        accessibilityRole="button"
        disabled={!upgradeView.isAffordable}
        onPress={() => onPurchase(upgrade.id)}
        style={({ pressed }) => [
          styles.buyButton,
          {
            backgroundColor: upgradeView.isAffordable
              ? theme.text
              : theme.backgroundSelected,
          },
          pressed && styles.buyButtonPressed,
        ]}>
        <ThemedText
          type="smallBold"
          style={[
            styles.buyButtonText,
            { color: upgradeView.isAffordable ? theme.background : theme.textSecondary },
          ]}>
          {buttonLabel}
        </ThemedText>
      </Pressable>
    </View>
  );
}

function getUpgradeEffectLabel({ upgrade }: CarClickerUpgradeView) {
  if (upgrade.perClickBonus) {
    return `+${formatCarClickerCash(upgrade.perClickBonus)} per click`;
  }

  if (upgrade.perSecondBonus) {
    return `+${formatCarClickerCash(upgrade.perSecondBonus)} per second`;
  }

  return 'Efekt specjalny';
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.one,
  },
  categoryList: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  categoryButton: {
    minHeight: 36,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  categoryButtonPressed: {
    opacity: 0.78,
  },
  list: {
    gap: Spacing.two,
  },
  row: {
    minHeight: 124,
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  rowContent: {
    flex: 1,
    gap: Spacing.one,
  },
  rowTitleLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  upgradeName: {
    flex: 1,
  },
  description: {
    flexShrink: 1,
  },
  effect: {
    color: '#1f7aec',
  },
  buyButton: {
    minWidth: 84,
    minHeight: 44,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  buyButtonPressed: {
    opacity: 0.78,
  },
  buyButtonText: {
    textAlign: 'center',
  },
});
