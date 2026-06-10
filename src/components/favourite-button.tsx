import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

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

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={favourited ? 'Unfavourite this cat' : 'Favourite this cat'}
      accessibilityState={{ selected: favourited }}
      disabled={toggle.isPending}
      hitSlop={Spacing.two}
      onPress={() => toggle.mutate({ imageId, favouriteId })}>
      <Ionicons
        name={favourited ? 'heart' : 'heart-outline'}
        size={26}
        color={favourited ? theme.danger : theme.textSecondary}
      />
    </Pressable>
  );
}
