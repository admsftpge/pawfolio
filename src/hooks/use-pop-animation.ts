import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

/** Spring "pop" (overshoot and settle) for tap/change feedback. */
export function usePopAnimation(peak = 1.3) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pop = () => {
    scale.set(withSequence(withSpring(peak, { damping: 9 }), withSpring(1)));
  };

  return { style, pop };
}
