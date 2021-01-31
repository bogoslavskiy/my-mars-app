import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { Text } from '../components/UI';
import * as Types from '../api/types';

interface RoverPhotoProps {
  item: Types.RoverPhoto;
  width: number;
  height: number;
}

export const RoverPhoto = React.memo<RoverPhotoProps>((props) => {
  const { item, width, height } = props;
  const opacityImage = useSharedValue(0);

  React.useEffect(() => {
    opacityImage.value = 1;
  }, []);

  const imageStyle = useAnimatedStyle(() => {
    return { opacity: withTiming(opacityImage.value, { duration: 300 }) }
  });

  return (
    <View style={[styles.container, { width, height }]}>
      <Animated.Image
        source={{ uri: item.img_src }}
        style={[styles.borderRadius, imageStyle, { flex: 1 }]}
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.8)', 'rgba(235,87,87,0)']}
        style={[StyleSheet.absoluteFillObject, styles.borderRadius]}
      > 
        <View style={styles.roverInfoContainer}>
          <Text style={styles.roverNameText}>
            {item.rover.name}
          </Text>
          <Text style={styles.roverDescriptionText}>
            {item.camera.full_name}
          </Text>
          <Text style={styles.roverDescriptionText}>
            {moment(item.earth_date).format('MMM DD, YYYY')}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    overflow: 'hidden', 
  },
  borderRadius: {  
    flex: 1, 
    borderRadius: 8 
  },
  shadow: {
    shadowColor: "#102027",
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 16,
  },
  roverInfoContainer: {
    padding: 24
  },
  roverNameText: {
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0.15,
    color: '#FFF',
    paddingBottom: 4
  },
  roverDescriptionText: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.75,
    color: '#FFF'
  }
});