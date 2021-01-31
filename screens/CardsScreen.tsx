import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoverImages } from '../api/RoverImages';
import { Card } from '../components/Card';
import { ScreenHeader } from '../components/Layout/ScreenHeader';
import { LoaderSpinner, Text } from '../components/UI';
import { Colors } from '../theme/Colors';

const COUNT_CARDS = 3;

export const CardsScreen: React.FC = () => {
  const { data, loading, loadMore, loadingMore } = useRoverImages();
  const safeArea = useSafeAreaInsets();
  
  const [currentPhotoIndex, setCurrentIndex] = React.useState(0);

  const photos = React.useMemo(() => {
    return data?.photos.slice(currentPhotoIndex, currentPhotoIndex + COUNT_CARDS).reverse() || [];
  }, [data, currentPhotoIndex]);

  const countPhotos = React.useMemo(() => {
    return data?.photos.slice(currentPhotoIndex).length || 0;
  }, [currentPhotoIndex, data]);

  const handleSwipe = React.useCallback((direction: 'left' | 'right') => {
    setCurrentIndex((prev) => prev + 1);

    // setCards((cards) => {
    //   return [...cards, {}]
    // });
  }, []);

  React.useEffect(() => {
    if (!loading && data && currentPhotoIndex > data.photos.length - 10) {
      loadMore();
    }
  }, [data, currentPhotoIndex, loading]);

  const handlePressUndo = React.useCallback(() => {
    setCurrentIndex(Math.max(0, currentPhotoIndex - 1))
  }, [currentPhotoIndex]);

  const isActiveUndo = React.useMemo(() => {
    return photos.length > 0 && currentPhotoIndex > 0;
  }, [photos, currentPhotoIndex]);

  const isActiveFavorites = React.useMemo(() => {
    return photos.length > 0;
  }, [photos.length]);

  return (
    <View style={styles.container}>
      <ScreenHeader 
        title="My Mars" 
        leftContent={() => (
          <TouchableOpacity 
            disabled={!isActiveUndo} 
            onPress={handlePressUndo}
          >
            <Text 
              style={[
                styles.headerLeftButtonText,
                !isActiveUndo && styles.headerLeftButtonInactive
              ]}
            >
              Undo
            </Text>
          </TouchableOpacity>
        )}
        rightContent={() => (
          <TouchableOpacity 
            disabled={!isActiveFavorites} 
            onPress={() => {}}
          >
            <Image
              source={require('../assets/icons/ic-heart-24.png')}
              style={{ 
                tintColor: isActiveFavorites 
                  ? Colors.accentPrimary 
                  : Colors.inactive
              }}
            />
          </TouchableOpacity>
        )}
      />

      <View style={styles.cardsContainer}>
        {loading ? (
          <LoaderSpinner />
        ) : 
          photos.map((item, index) => (
            <Card
              key={item.id}
              index={index}
              item={item}
              onSwipe={(direction) => handleSwipe(direction)} 
            />
          ))
        }
      </View>
      <View style={[styles.statusContainer, { marginBottom: safeArea.bottom }]}>
        <TouchableOpacity onPress={() => setCurrentIndex(0)}>
          <Text style={styles.statusText}>
            {loading || loadingMore ? 'Downloading' : `${countPhotos} Cards`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerLeftButtonText: {
    color: Colors.accentPrimary,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.25
  },
  headerLeftButtonInactive: {
    color: Colors.inactive
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cardsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  statusContainer: {
    alignItems: 'center',
    padding: 16
  },
  statusText: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.75,
    color: Colors.textSecondary 
  }
});