import { Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { CarClickerScreenHeader } from '@/features/car-clicker/components/car-clicker-screen-header';
import { CarClickerStatsPanel } from '@/features/car-clicker/components/car-clicker-stats-panel';
import { CarTapButton } from '@/features/car-clicker/components/car-tap-button';
import { CarTierProgressPanel } from '@/features/car-clicker/components/car-tier-progress-panel';
import { OfflineIncomeFeedbackPanel } from '@/features/car-clicker/components/offline-income-feedback-panel';
import { TierUpFeedbackPanel } from '@/features/car-clicker/components/tier-up-feedback-panel';
import { UpgradeShopPanel } from '@/features/car-clicker/components/upgrade-shop-panel';
import {
  CAR_CLICKER_SCREEN,
  CarClickerTheme,
  useCarClickerGame,
} from '@/features/car-clicker';

export default function GameScreen() {
  const {
    actions,
    offlineIncomeFeedback,
    purchaseFeedback,
    selectedUpgradeCategory,
    state,
    tierFeedback,
    tierProgress,
    upgradeViews,
  } = useCarClickerGame();

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}>
          <ThemedView style={styles.content}>
            <CarClickerScreenHeader
              subtitle={CAR_CLICKER_SCREEN.subtitle}
              title={CAR_CLICKER_SCREEN.title}
            />

            <CarClickerStatsPanel
              cash={state.cash}
              perClick={state.perClick}
              perSecond={state.perSecond}
            />

            <OfflineIncomeFeedbackPanel
              feedback={offlineIncomeFeedback}
              onDismiss={actions.dismissOfflineIncomeFeedback}
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
    backgroundColor: CarClickerTheme.colors.background,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Spacing.four,
    paddingBottom: Platform.select({
      web: Spacing.six + Spacing.four,
      default: Spacing.three,
    }),
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
  },
});
