import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        title="Something went wrong"
        subtitle="Couldn't fetch your favourites. Check your connection and try again."
        action={
          <ThemedText type="linkPrimary" onPress={() => refetch()}>
            Try again
          </ThemedText>
        }
      />
    );
  }

  if (favourites.length === 0) {
    return (
      <ScreenPlaceholder
        title="No favourites yet"
        subtitle="Tap the heart on one of your cats and it will gather here."
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <CatGrid cats={favourites} title="Favourites" onRefresh={refetch} />
      </SafeAreaView>
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
