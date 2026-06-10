import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

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
});
