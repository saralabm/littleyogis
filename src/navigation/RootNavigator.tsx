import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useProfileStore } from '../store/useProfileStore';
import type { RootStackParamList } from './navigationTypes';

// Onboarding screens
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import AgeTierScreen from '../screens/onboarding/AgeTierScreen';
import ChildProfileScreen from '../screens/onboarding/ChildProfileScreen';
import DisclaimerScreen from '../screens/onboarding/DisclaimerScreen';
import PinSetupScreen from '../screens/onboarding/PinSetupScreen';

// Main app
import { MainTabNavigator } from './MainTabNavigator';

// Modal screens (stubs for now — Phase 5 will fill these)
import SessionPlayerScreen from '../screens/session/SessionPlayerScreen';
import SessionCompleteScreen from '../screens/session/SessionCompleteScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  const profile = useProfileStore((s) => s.profile);
  const isOnboarded = profile !== null && profile.hasAcceptedDisclaimer === true;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {!isOnboarded ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="AgeTier" component={AgeTierScreen} />
            <Stack.Screen name="ChildProfile" component={ChildProfileScreen} />
            <Stack.Screen name="Disclaimer" component={DisclaimerScreen} />
            <Stack.Screen name="PinSetup" component={PinSetupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen
              name="SessionPlayer"
              component={SessionPlayerScreen}
              options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
            />
            <Stack.Screen
              name="SessionComplete"
              component={SessionCompleteScreen}
              options={{ animation: 'fade', gestureEnabled: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
