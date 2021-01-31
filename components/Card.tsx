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
import moment from 'moment';
import { Colors } from '../theme/Colors';
import { Text } from '../components/UI';
import { RoverPhoto } from '../api/RoverImages';
import { snapPointAnimation, Viewport } from '../utils';

const CARD_WIDTH = Viewport.width - 32;
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
  const opacityImage = useSharedValue(0);

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
    const indentTop =  animatedIndex.value * (16 * 2.4)
    const scale = interpolate(
      animatedIndex.value,
      [0, 3],
      [0.81, 1.09],
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
    return { opacity: withTiming(opacityImage.value, { duration: 300 }) }
  });

  return (
    <View style={[styles.container, StyleSheet.absoluteFill]}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.card,styles.shadow, cardStyle]}> 
          <View style={styles.innerCard}>
            <Animated.Image
              source={{ uri: item.img_src }}
              style={[styles.borderRadius, imageStyle]}
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