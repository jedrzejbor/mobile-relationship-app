import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { CAR_CLICKER_SCREEN, CarClickerTheme } from '@/features/car-clicker';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Explore</TabButton>
          </TabTrigger>
          <TabTrigger name="game" href="/game" asChild>
            <TabButton>{CAR_CLICKER_SCREEN.tabTitle}</TabButton>
          </TabTrigger>
          <TabTrigger name="nitro-rush" href="/nitro-rush" asChild>
            <TabButton>Nitro</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <View
        style={[
          styles.tabButtonView,
          isFocused && styles.tabButtonViewFocused,
        ]}>
        <ThemedText
          type="smallBold"
          style={[
            styles.tabButtonText,
            isFocused && styles.tabButtonTextFocused,
          ]}>
          {children}
        </ThemedText>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={styles.innerContainer}>
        <ThemedText type="smallBold" style={styles.brandText}>
          Car Clicker
        </ThemedText>

        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    minHeight: 68,
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: CarClickerTheme.radii.panel,
    backgroundColor: CarClickerTheme.colors.panel,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: 'auto',
    color: CarClickerTheme.colors.accent,
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    minWidth: 84,
    alignItems: 'center',
    borderWidth: CarClickerTheme.borders.hairline,
    borderColor: CarClickerTheme.colors.border,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: CarClickerTheme.radii.control,
    backgroundColor: CarClickerTheme.colors.panelStrong,
  },
  tabButtonViewFocused: {
    borderColor: CarClickerTheme.colors.borderStrong,
    backgroundColor: CarClickerTheme.colors.accentDim,
  },
  tabButtonText: {
    color: CarClickerTheme.colors.textDim,
    fontStyle: 'italic',
  },
  tabButtonTextFocused: {
    color: CarClickerTheme.colors.accent,
  },
});
