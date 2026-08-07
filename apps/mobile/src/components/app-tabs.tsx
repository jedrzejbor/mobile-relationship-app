import { Tabs } from 'expo-router';
import { Image, StyleSheet } from 'react-native';

import { CAR_CLICKER_SCREEN, CarClickerTheme } from '@/features/car-clicker';

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: CarClickerTheme.colors.accentDim,
        tabBarActiveTintColor: CarClickerTheme.colors.accent,
        tabBarInactiveTintColor: CarClickerTheme.colors.textDim,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: styles.tabBar,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@/assets/images/tabIcons/home.png')}
              style={[styles.tabIcon, { tintColor: color }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@/assets/images/tabIcons/explore.png')}
              style={[styles.tabIcon, { tintColor: color }]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          title: CAR_CLICKER_SCREEN.tabTitle,
          tabBarIcon: ({ color }) => (
            <Image
              source={require('@/assets/images/tabIcons/explore.png')}
              style={[styles.tabIcon, { tintColor: color }]}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 76,
    borderTopWidth: CarClickerTheme.borders.hairline,
    borderTopColor: CarClickerTheme.colors.border,
    backgroundColor: CarClickerTheme.colors.panel,
    paddingTop: 8,
    paddingBottom: 12,
  },
  tabBarItem: {
    marginHorizontal: 6,
    borderRadius: CarClickerTheme.radii.control,
  },
  tabBarLabel: {
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '700',
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
});
