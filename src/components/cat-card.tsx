import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { FavouriteButton } from '@/components/favourite-button';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { CatCard as CatCardModel } from '@/data/cat-cards';

type Props = {
  cat: CatCardModel;
  width: number;
};

export function CatCard({ cat, width }: Props) {
  return (
    <ThemedView type="backgroundElement" style={[styles.card, { width }]}>
      <Image
        source={{ uri: cat.url }}
        style={styles.image}
        contentFit="cover"
        transition={150}
        accessibilityLabel="One of your uploaded cats"
      />
      <View style={styles.footer}>
        <FavouriteButton imageId={cat.id} favouriteId={cat.favouriteId} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
});
