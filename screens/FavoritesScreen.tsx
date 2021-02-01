import * as React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { ScreenHeader } from '../components/Layout/ScreenHeader';
import { RoverPhoto } from '../components/RoverPhoto';
import { useFavoritesPhoto } from '../context/FavoritesPhotoContext';
import { Viewport, SCREEN_WIDTH } from '../utils';

const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_HEIGTH = Viewport.height / 1.5;

export const FavoritesScreen: React.FC = () => {
  const { photos } = useFavoritesPhoto();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Favorites" />
      <FlatList 
        data={photos}
        keyExtractor={(item) => `${item.id}`}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <RoverPhoto 
              width={CARD_WIDTH}
              height={CARD_HEIGTH} 
              item={item}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listContainer: {
    padding: 16
  },
  itemContainer: {
    marginBottom: 16
  }
});