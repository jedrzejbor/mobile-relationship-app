import { Image } from 'expo-image';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import {
  CAR_CLICKER_UPGRADE_CATEGORY_OPTIONS,
  CAR_CLICKER_UPGRADE_ASSETS,
  CarClickerTheme,
  formatCarClickerCash,
  type CarClickerPurchaseFeedback,
  type CarClickerUpgradeCategoryFilter,
  type CarClickerUpgradeId,
  type CarClickerUpgradeView,
} from '@/features/car-clicker';

type UpgradeShopPanelProps = {
  purchaseFeedback: CarClickerPurchaseFeedback | null;
  selectedCategory: CarClickerUpgradeCategoryFilter;
  upgrades: CarClickerUpgradeView[];
  onCategoryChange: (category: CarClickerUpgradeCategoryFilter) => void;
  onPurchase: (upgradeId: CarClickerUpgradeId) => void;
};

export function UpgradeShopPanel({
  purchaseFeedback,
  selectedCategory,
  upgrades,
  onCategoryChange,
  onPurchase,
}: UpgradeShopPanelProps) {
  const { width } = useWindowDimensions();
  const isCompactLayout = width < 420;

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.title}>
          Ulepszenia
        </ThemedText>
        <ThemedText type="small" style={styles.subtitle}>
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

      {purchaseFeedback && (
        <ThemedText type="small" style={styles.feedback}>
          {getPurchaseFeedbackLabel(purchaseFeedback)}
        </ThemedText>
      )}

      <View style={styles.list}>
        {upgrades.length > 0 ? (
          upgrades.map((upgradeView) => (
            <UpgradeRow
              isRecentlyPurchased={
                purchaseFeedback?.status === 'purchased' &&
                purchaseFeedback.upgradeId === upgradeView.upgrade.id
              }
              isCompactLayout={isCompactLayout}
              key={upgradeView.upgrade.id}
              onPurchase={onPurchase}
              upgradeView={upgradeView}
            />
          ))
        ) : (
          <ThemedText
            type="small"
            style={styles.emptyState}>
            Brak ulepszen w tej kategorii
          </ThemedText>
        )}
      </View>
    </View>
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
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.categoryButton,
        isSelected && styles.categoryButtonSelected,
        pressed && styles.categoryButtonPressed,
      ]}>
      <ThemedText
        type="smallBold"
        style={[
          styles.categoryButtonText,
          isSelected && styles.categoryButtonTextSelected,
        ]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function UpgradeRow({
  isCompactLayout,
  isRecentlyPurchased,
  onPurchase,
  upgradeView,
}: {
  isCompactLayout: boolean;
  isRecentlyPurchased: boolean;
  upgradeView: CarClickerUpgradeView;
  onPurchase: (upgradeId: CarClickerUpgradeId) => void;
}) {
  const { upgrade } = upgradeView;
  const effectLabel = getUpgradeEffectLabel(upgradeView);
  const effectTone = upgrade.perSecondBonus
    ? CarClickerTheme.colors.passive
    : CarClickerTheme.colors.click;
  const buttonLabel = upgradeView.isMaxLevelReached
    ? 'Max'
    : upgradeView.isAffordable
      ? `Kup ${formatCarClickerCash(upgradeView.nextCost)}`
      : formatCarClickerCash(upgradeView.nextCost);

  return (
    <View
      style={[
        styles.row,
        isCompactLayout && styles.rowCompact,
        {
          backgroundColor: isRecentlyPurchased
            ? CarClickerTheme.colors.accentDim
            : CarClickerTheme.colors.panel,
          borderColor: isRecentlyPurchased
            ? CarClickerTheme.colors.borderStrong
            : CarClickerTheme.colors.border,
        },
      ]}>
      <View
        style={[
          styles.assetFrame,
          isCompactLayout && styles.assetFrameCompact,
        ]}>
        <Image
          accessibilityIgnoresInvertColors
          contentFit="cover"
          source={CAR_CLICKER_UPGRADE_ASSETS[upgrade.id]}
          style={styles.assetImage}
        />
        <View style={styles.assetLevelBadge}>
          <ThemedText type="smallBold" style={styles.assetLevelText}>
            Lv. {upgradeView.level}
          </ThemedText>
        </View>
      </View>

      <View style={styles.rowContent}>
        <View style={styles.rowTitleLine}>
          <ThemedText type="smallBold" style={styles.upgradeName}>
            {upgrade.name}
          </ThemedText>
        </View>
        <ThemedText type="small" style={styles.description}>
          {upgrade.description}
        </ThemedText>
        <ThemedText type="smallBold" style={[styles.effect, { color: effectTone }]}>
          {effectLabel}
        </ThemedText>
        {isRecentlyPurchased && (
          <ThemedText type="smallBold" style={styles.recentlyPurchased}>
            Ostatnio kupione
          </ThemedText>
        )}
        {!upgradeView.isAffordable && !upgradeView.isMaxLevelReached && (
          <ThemedText type="small" style={styles.missingCash}>
            Brakuje {formatCarClickerCash(upgradeView.missingCash)}
          </ThemedText>
        )}
      </View>

      <Pressable
        accessibilityLabel={`Kup ${upgrade.name}`}
        accessibilityRole="button"
        accessibilityState={{ disabled: !upgradeView.isAffordable }}
        disabled={!upgradeView.isAffordable}
        onPress={() => onPurchase(upgrade.id)}
        style={({ pressed }) => [
          styles.buyButton,
          isCompactLayout && styles.buyButtonCompact,
          upgradeView.isAffordable
            ? styles.buyButtonAvailable
            : styles.buyButtonDisabled,
          pressed && styles.buyButtonPressed,
        ]}>
        <ThemedText
          type="smallBold"
          style={[
            styles.buyButtonText,
            upgradeView.isAffordable
              ? styles.buyButtonTextAvailable
              : styles.buyButtonTextDisabled,
          ]}>
          {buttonLabel}
        </ThemedText>
      </Pressable>
    </View>
  );
}

function getPurchaseFeedbackLabel(feedback: CarClickerPurchaseFeedback) {
  if (feedback.status === 'purchased') {
    return `Kupiono: ${feedback.upgradeName}`;
  }

  if (feedback.status === 'insufficient_cash') {
    return `Za malo cashu: ${feedback.upgradeName}`;
  }

  return `Maksymalny poziom: ${feedback.upgradeName}`;
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
    borderRadius: CarClickerTheme.radii.panel,
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
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
  categoryList: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  categoryButton: {
    flex: 1,
    minHeight: 36,
    borderRadius: CarClickerTheme.radii.control,
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    backgroundColor: CarClickerTheme.colors.panelStrong,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  categoryButtonSelected: {
    borderColor: CarClickerTheme.colors.borderStrong,
    backgroundColor: CarClickerTheme.colors.accentDim,
    shadowColor: CarClickerTheme.colors.accent,
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  categoryButtonText: {
    color: CarClickerTheme.colors.textMuted,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  categoryButtonTextSelected: {
    color: CarClickerTheme.colors.accent,
  },
  categoryButtonPressed: {
    opacity: 0.78,
  },
  feedback: {
    minHeight: 20,
    color: CarClickerTheme.colors.accent,
  },
  list: {
    gap: Spacing.two,
  },
  emptyState: {
    minHeight: 56,
    color: CarClickerTheme.colors.textMuted,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  row: {
    minHeight: 132,
    borderWidth: 1,
    borderRadius: CarClickerTheme.radii.panel,
    padding: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  rowCompact: {
    minHeight: 148,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  assetFrame: {
    width: 94,
    height: 94,
    borderRadius: CarClickerTheme.radii.control,
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    overflow: 'hidden',
    backgroundColor: CarClickerTheme.colors.panelStrong,
  },
  assetFrameCompact: {
    width: 78,
    height: 78,
  },
  assetImage: {
    width: '100%',
    height: '100%',
  },
  assetLevelBadge: {
    position: 'absolute',
    left: Spacing.one,
    bottom: Spacing.one,
    minHeight: 22,
    borderRadius: CarClickerTheme.radii.badge,
    backgroundColor: 'rgba(5, 7, 11, 0.82)',
    paddingHorizontal: Spacing.two,
    justifyContent: 'center',
  },
  assetLevelText: {
    color: CarClickerTheme.colors.textMuted,
  },
  rowContent: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.one,
  },
  rowTitleLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  upgradeName: {
    flex: 1,
    color: CarClickerTheme.colors.text,
    fontSize: 18,
    lineHeight: 24,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  description: {
    flexShrink: 1,
    color: CarClickerTheme.colors.textMuted,
  },
  effect: {
    textTransform: 'uppercase',
  },
  recentlyPurchased: {
    color: CarClickerTheme.colors.accent,
  },
  missingCash: {
    color: CarClickerTheme.colors.danger,
  },
  buyButton: {
    minWidth: 104,
    minHeight: 44,
    borderRadius: CarClickerTheme.radii.control,
    borderWidth: CarClickerTheme.borders.active,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  buyButtonCompact: {
    width: '100%',
  },
  buyButtonAvailable: {
    borderColor: CarClickerTheme.colors.borderStrong,
    backgroundColor: CarClickerTheme.colors.accentDim,
  },
  buyButtonDisabled: {
    borderColor: CarClickerTheme.colors.border,
    backgroundColor: CarClickerTheme.colors.panelMuted,
  },
  buyButtonPressed: {
    opacity: 0.78,
  },
  buyButtonText: {
    textAlign: 'center',
  },
  buyButtonTextAvailable: {
    color: CarClickerTheme.colors.accent,
  },
  buyButtonTextDisabled: {
    color: CarClickerTheme.colors.textDim,
  },
});
