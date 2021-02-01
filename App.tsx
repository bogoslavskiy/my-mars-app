import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useCachedResources } from './hooks/useCachedResources';
import { RootNavigator } from './navigation';
import { FavoritesPhotoProvider } from './context/FavoritesPhotoContext';

import { SCREEN_WIDTH } from './utils';

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <FavoritesPhotoProvider>
          <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
              <RootNavigator />
              <StatusBar />
            </View>
          </View>
        </FavoritesPhotoProvider>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
  },
  innerContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
  }
});
