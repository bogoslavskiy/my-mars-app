import * as React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';

export const LoaderSpinner = React.memo(() => {
  const [initialize, setInitialize] = React.useState(false);
  const rotation = useSharedValue(0);
  
  React.useEffect(() => {
    if (!initialize) {
      rotation.value = withRepeat(
        withTiming(360, { 
          duration: 1000,
          easing: Easing.linear
        }), 
        -1
      );

      setInitialize(true);
    }
  }, [initialize]);

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }], 
  }));

  return (
    <Animated.Image 
      source={require('../../assets/icons/ic-loader-40.png')} 
      style={[styles.loader, rotateStyle]} 
    />
  );
});

const styles = StyleSheet.create({
  loader: { 
    width: 42, 
    height: 42,
    tintColor: Colors.accentPrimary
  }
});