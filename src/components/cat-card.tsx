import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { FavouriteButton } from '@/components/favourite-button';
import { VoteControls } from '@/components/vote-controls';
import { Radius, Spacing } from '@/constants/theme';
import { CatCard as CatCardModel } from '@/data/cat-cards';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  cat: CatCardModel;
  width: number;
};

export function CatCard({ cat, width }: Props) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        { width, backgroundColor: theme.surface, borderColor: theme.border },
      ]}>
      <Image
        source={{ uri: cat.url }}
        style={styles.image}
        contentFit="cover"
        transition={150}
        accessibilityLabel="One of your uploaded cats"
      />
      <View style={[styles.heartBadge, { backgroundColor: theme.surface }]}>
        <FavouriteButton imageId={cat.id} favouriteId={cat.favouriteId} />
      </View>
      <View style={styles.footer}>
        <VoteControls imageId={cat.id} score={cat.score} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
  },
  heartBadge: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    borderRadius: Radius.pill,
    padding: Spacing.one + Spacing.half,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
});
