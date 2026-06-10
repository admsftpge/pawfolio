import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useToggleFavourite } from '@/hooks/use-toggle-favourite';

type Props = {
  imageId: string;
  favouriteId: number | null;
};

export function FavouriteButton({ imageId, favouriteId }: Props) {
  const theme = useTheme();
  const toggle = useToggleFavourite();
  const favourited = favouriteId !== null;

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPress = () => {
    scale.set(withSequence(withSpring(1.35, { damping: 9 }), withSpring(1)));
    toggle.mutate({ imageId, favouriteId });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={favourited ? 'Unfavourite this cat' : 'Favourite this cat'}
      accessibilityState={{ selected: favourited }}
      disabled={toggle.isPending}
      hitSlop={Spacing.two}
      onPress={onPress}>
      <Animated.View style={animatedStyle}>
        <Ionicons
          name={favourited ? 'heart' : 'heart-outline'}
          size={26}
          color={favourited ? theme.danger : theme.textSecondary}
        />
      </Animated.View>
    </Pressable>
  );
}
