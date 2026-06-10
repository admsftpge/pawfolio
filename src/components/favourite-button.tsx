import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useToggleFavourite } from '@/hooks/use-toggle-favourite';

type Props = {
  imageId: string;
  favouriteId: number | null;
};

export function FavouriteButton({ imageId, favouriteId }: Props) {
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
      <ThemedText type="subtitle" themeColor={favourited ? 'danger' : 'textSecondary'}>
        {favourited ? '♥' : '♡'}
      </ThemedText>
    </Pressable>
  );
}
