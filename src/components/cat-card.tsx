import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { FavouriteButton } from '@/components/favourite-button';
import { ThemedText } from '@/components/themed-text';
import { VoteControls } from '@/components/vote-controls';
import { Motif, Radius, Spacing } from '@/constants/theme';
import { CatCard as CatCardModel } from '@/data/cat-cards';
import { useDeleteCat } from '@/hooks/use-delete-cat';
import { useTheme } from '@/hooks/use-theme';
import { confirmDestructive } from '@/lib/confirm-destructive';

type Props = {
  cat: CatCardModel;
  index: number;
  width: number;
};

export function CatCard({ cat, index, width }: Props) {
  const theme = useTheme();
  const deleteCat = useDeleteCat();

  const number = `#${String(index + 1).padStart(3, '0')}`;

  const onLongPress = () =>
    confirmDestructive(
      'Delete this cat?',
      'It will be removed from your Pawfolio for good.',
      () => deleteCat.mutate(cat.id),
    );

  return (
    <Pressable
      onLongPress={onLongPress}
      accessibilityHint="Long press to delete this cat"
      style={[styles.card, { width, backgroundColor: Motif.body, borderColor: Motif.outline }]}>
      <View
        style={[styles.numberBadge, { backgroundColor: theme.surface, borderColor: Motif.outline }]}>
        <ThemedText type="code" style={styles.numberText}>
          {number}
        </ThemedText>
      </View>

      <View style={styles.leds}>
        <View style={styles.led} />
        <View style={styles.led} />
      </View>

      <View style={[styles.screen, { backgroundColor: Motif.lens }]}>
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
      </View>

      <View style={styles.footer}>
        <VoteControls imageId={cat.id} score={cat.score} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    borderRadius: Radius.lg,
    borderWidth: 2,
    padding: Spacing.two,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
    shadowOffset: { width: 4, height: 5 },
    elevation: 4,
  },
  numberBadge: {
    position: 'absolute',
    top: -Spacing.two,
    right: -Spacing.one,
    zIndex: 2,
    borderWidth: 2,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  numberText: {
    fontSize: 13,
    fontWeight: 700,
  },
  leds: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.one,
  },
  led: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Motif.leds[0],
  },
  screen: {
    borderRadius: Radius.md,
    padding: Spacing.one,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Radius.sm,
  },
  heartBadge: {
    position: 'absolute',
    top: Spacing.two,
    left: Spacing.two,
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
    paddingTop: Spacing.two,
  },
});
