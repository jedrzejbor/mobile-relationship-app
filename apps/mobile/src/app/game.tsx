import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { CarClickerStatsPanel } from '@/features/car-clicker/components/car-clicker-stats-panel';
import { CarTapButton } from '@/features/car-clicker/components/car-tap-button';
import { CarTierProgressPanel } from '@/features/car-clicker/components/car-tier-progress-panel';
import { TierUpFeedbackPanel } from '@/features/car-clicker/components/tier-up-feedback-panel';
import { UpgradeShopPanel } from '@/features/car-clicker/components/upgrade-shop-panel';
import { CAR_CLICKER_SCREEN, useCarClickerGame } from '@/features/car-clicker';

export default function GameScreen() {
  const {
    actions,
    purchaseFeedback,
    selectedUpgradeCategory,
    state,
    tierFeedback,
    tierProgress,
    upgradeViews,
  } = useCarClickerGame();

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}>
          <ThemedView style={styles.content}>
            <ThemedView style={styles.header}>
              <ThemedText type="subtitle" style={styles.title}>
                {CAR_CLICKER_SCREEN.title}
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                {CAR_CLICKER_SCREEN.subtitle}
              </ThemedText>
            </ThemedView>

            <CarClickerStatsPanel
              cash={state.cash}
              perClick={state.perClick}
              perSecond={state.perSecond}
            />

            <CarTapButton
              onPress={actions.collectClick}
              perClick={state.perClick}
              tier={state.selectedCarTier}
            />

            <CarTierProgressPanel progress={tierProgress} />

            <TierUpFeedbackPanel feedback={tierFeedback} />

            <UpgradeShopPanel
              onCategoryChange={actions.selectUpgradeCategory}
              onPurchase={actions.purchaseUpgrade}
              purchaseFeedback={purchaseFeedback}
              selectedCategory={selectedUpgradeCategory}
              upgrades={upgradeViews}
            />
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.four,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.one,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
});
