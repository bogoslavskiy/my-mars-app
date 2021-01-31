import * as React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  runOnJS,
  withTiming,
} from "react-native-reanimated";
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/Colors';
import { Text } from '../components/UI';
import { RoverPhoto } from '../api/RoverImages';
import { snapPointAnimation, Viewport } from '../utils';

const CARD_WIDTH = Viewport.width * 0.96;
const CARD_HEIGHT = CARD_WIDTH * (425 / 294);
const SNAP_POINT = [-Viewport.width, 0, Viewport.width];

interface CardProps {
  onSwipe: (direction: 'left' | 'right') => void;
  index: number;
  item: RoverPhoto;
}

export const Card = React.memo<CardProps>((props) => {
  const { onSwipe, index, item } = props;

  const animatedIndex = useDerivedValue(() => {
    return withTiming(index, {
      duration: 200,
    });
  });

  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacityImage = useSharedValue(index === 0 ? 0 : 1);

  React.useEffect(() => {
    opacityImage.value = 1;
  }, []);


  // React.useEffect(() => {
  //   setTimeout(() => {
  //     translateX.value = withTiming(375, {
  //       duration: 500,
  //       easing: Easing.out(Easing.exp),
  //     });
  //   }, 400)
    
  // }, []);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent, 
    { x: number; y: number }
  >({
    onStart: (_, ctx) => {
      ctx.x = translateX.value;
      ctx.y = translateY.value;
    },
    onActive: ({ translationX, translationY }, ctx) => {
      translateX.value = translationX + ctx.x;
      translateY.value = translationY + ctx.y;
    },
    onEnd: ({ velocityX, velocityY }) => {
      translateY.value = withSpring(0, {
        velocity: velocityY,
      });
      const dest = snapPointAnimation(translateX.value, velocityX, SNAP_POINT);
      translateX.value = withSpring(
        dest,
        {
          overshootClamping: dest === 0 ? false : true,
          restSpeedThreshold: dest === 0 ? 0.10 : 100,
          restDisplacementThreshold: dest === 0 ? 0.01 : 100,
        },
        () => {
          if (dest !== 0) {
            runOnJS(onSwipe)(dest > 0 ? 'right' : 'left')
          }
        }
      );
    },
  });

  const cardStyle = useAnimatedStyle(() => {
    const indentTop =  animatedIndex.value * (0.5 * 100) 
    const scale = interpolate(
      animatedIndex.value,
      [3, 0],
      [1, 0.8],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateY: translateY.value + indentTop },
        { translateX: translateX.value },
        { scale },
      ],
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    return { opacity: withTiming(opacityImage.value, { duration: 500 }) }
  });

  return (
    <View style={[styles.container, StyleSheet.absoluteFill]}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.card, styles.shadow60, cardStyle]}> 
          <View style={styles.innerCard}>
            <Animated.Image
              source={{ uri: item.img_src }}
              style={[styles.borderRadius, imageStyle]}
            />
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.8)', 'rgba(235,87,87,0)']}
              style={[StyleSheet.absoluteFillObject, styles.borderRadius]}
            > 
            



            </LinearGradient>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  card: {
    width: CARD_WIDTH, 
    height: CARD_HEIGHT,
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 8,
    zIndex: 4
  },
  borderRadius: {  
    flex: 1, 
    borderRadius: 8 
  },
  innerCard: {
    flex: 1, 
    overflow: 'hidden', 
  },
  shadow20: {
    shadowColor: "#102027",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  shadow40: {
    shadowColor: "#102027",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },
  shadow60: {
    shadowColor: "#102027",
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 16,
  }
});