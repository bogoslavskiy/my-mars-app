import * as React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface RoundedButtonProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
} 

export const RoundedButton = React.memo<RoundedButtonProps>((props) => {
  const { children, style, onPress, disabled } = props;

  const scale = useSharedValue(1);
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ 
      scale: withTiming(scale.value, {
        duration: 200
      }) 
    }]
  }));

  return (
    <Animated.View style={scaleStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => scale.value = 1.285}
        onPressOut={() => scale.value = 1}
        disabled={disabled}
        style={[styles.actionButton, style]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
});