import { Dimensions, Platform } from 'react-native';

export const Viewport = Dimensions.get('window');

export const MAX_SCREEN_WIDTH = 400;
export const SCREEN_WIDTH = Math.min(Viewport.width, MAX_SCREEN_WIDTH);

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const snapPointAnimation = (
  value: number,
  velocity: number,
  points: ReadonlyArray<number>
): number => {
  "worklet";
  const point = value + 0.2 * velocity;
  const deltas = points.map((p) => Math.abs(point - p));
  const minDelta = Math.min.apply(null, deltas);
  return points.filter((p) => Math.abs(point - p) === minDelta)[0];
};