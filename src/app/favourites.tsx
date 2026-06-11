import { ActivityIndicator, StyleSheet } from 'react-native';

import { Banner } from '@/components/banner';
import { CatGrid } from '@/components/cat-grid';
import { ScreenPlaceholder } from '@/components/screen-placeholder';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCats } from '@/hooks/use-cats';

export default function FavouritesScreen() {
  const { cats, isLoading, error, refetch } = useCats();
  const favourites = cats?.filter((cat) => cat.favouriteId !== null);

  if (isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error || !favourites) {
    return (
      <ScreenPlaceholder
        icon="cloud-offline-outline"
        title="Something went wrong"
        subtitle="Couldn't fetch your favourites. Check your connection and try again."
        action={
          <ThemedText
            type="smallBold"
            themeColor="accent"
            accessibilityRole="button"
            onPress={() => refetch()}>
            Try again
          </ThemedText>
        }
      />
    );
  }

  if (favourites.length === 0) {
    return (
      <ScreenPlaceholder
        icon="heart-outline"
        title="No favourites yet"
        subtitle="Tap a heart to start your hall of fame."
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Banner title="Favourites" subtitle="The hall of fame." />
      <CatGrid cats={favourites} onRefresh={refetch} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
