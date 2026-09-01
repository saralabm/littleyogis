import React from 'react';
import { useFonts } from 'expo-font';
import {
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import {
  NunitoSans_400Regular,
  NunitoSans_700Bold,
} from '@expo-google-fonts/nunito-sans';
import { DMMono_400Regular } from '@expo-google-fonts/dm-mono';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Bold': Nunito_700Bold,
    'NunitoSans-Regular': NunitoSans_400Regular,
    'NunitoSans-Bold': NunitoSans_700Bold,
    'DMMono-Regular': DMMono_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return <RootNavigator />;
}
