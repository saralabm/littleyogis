import React from 'react';
import { Platform, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSessionStore } from '../store/useSessionStore';
import { useProfileStore } from '../store/useProfileStore';
import type { MainTabParamList, ExploreStackParamList, BreatheStackParamList } from './navigationTypes';

// Screen stubs — will be replaced in later phases
import HomeScreen from '../screens/home/HomeScreen';
import CategoryBrowserScreen from '../screens/explore/CategoryBrowserScreen';
import AilmentDetailScreen from '../screens/explore/AilmentDetailScreen';
import BreathingLibraryScreen from '../screens/breathing/BreathingLibraryScreen';
import BreathingPlayerScreen from '../screens/breathing/BreathingPlayerScreen';
import BreathingCompleteScreen from '../screens/breathing/BreathingCompleteScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const TIER_ACCENT: Record<string, string> = {
  seedling: '#FFB300',
  explorer: '#558B2F',
  yogi: '#3949AB',
};

const ExploreStack = createNativeStackNavigator<ExploreStackParamList>();
function ExploreNavigator() {
  return (
    <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
      <ExploreStack.Screen name="CategoryBrowser" component={CategoryBrowserScreen} />
      <ExploreStack.Screen name="AilmentDetail" component={AilmentDetailScreen} />
    </ExploreStack.Navigator>
  );
}

const BreatheStack = createNativeStackNavigator<BreatheStackParamList>();
function BreatheNavigator() {
  return (
    <BreatheStack.Navigator screenOptions={{ headerShown: false }}>
      <BreatheStack.Screen name="BreathingLibrary" component={BreathingLibraryScreen} />
      <BreatheStack.Screen name="BreathingPlayer" component={BreathingPlayerScreen} />
      <BreatheStack.Screen name="BreathingComplete" component={BreathingCompleteScreen} />
    </BreatheStack.Navigator>
  );
}

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator(): React.JSX.Element {
  const sessionActive = useSessionStore((s) => s.session !== null);
  const tier = useProfileStore((s) => s.profile?.tier ?? 'explorer');
  const accentColor = TIER_ACCENT[tier] ?? '#F9A825';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: sessionActive
          ? { display: 'none' }
          : {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#F0F0F0',
              height: Platform.OS === 'ios' ? 88 : 64,
              paddingBottom: Platform.OS === 'ios' ? 28 : 8,
            },
        tabBarActiveTintColor: accentColor,
        tabBarInactiveTintColor: '#7B7B99',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreNavigator}
        options={{
          tabBarLabel: 'Explore',
          tabBarAccessibilityLabel: 'Explore tab',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="Breathe"
        component={BreatheNavigator}
        options={{
          tabBarLabel: 'Breathe',
          tabBarAccessibilityLabel: 'Breathe tab',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>🌬️</Text>,
        }}
      />
      <Tab.Screen
        name="Me"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Me',
          tabBarAccessibilityLabel: 'My profile tab',
          tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>⭐</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
