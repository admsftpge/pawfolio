import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';

import { Spacing } from '@/constants/theme';
import { usePopAnimation } from '@/hooks/use-pop-animation';
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

  const { style: popStyle, pop } = usePopAnimation(1.35);

  const onPress = () => {
    pop();
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
      <Animated.View style={popStyle}>
        <Ionicons
          name={favourited ? 'heart' : 'heart-outline'}
          size={26}
          color={favourited ? theme.danger : theme.textSecondary}
        />
      </Animated.View>
    </Pressable>
  );
}
