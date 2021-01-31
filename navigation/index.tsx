import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { Colors } from '../theme/Colors';

import { CardsScreen } from '../screens/CardsScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: Colors.accentPrimary,
          background: Colors.backgroundPrimary,
          card: Colors.backgroundPrimary,
          text: Colors.textPrimary,
          notification: Colors.backgroundPrimary,
          border: 'transparent',
        }
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerLeftContainerStyle: { left: 9 },
          headerRightContainerStyle: { paddingRight: 16 },
          headerStyle: { elevation: 0 },
          headerBackTitle: ' ',
        }}
      >
        <Stack.Screen name="Cards" component={CardsScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
