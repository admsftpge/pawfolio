import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CatGrid } from '@/components/cat-grid';
import { ScreenPlaceholder } from '@/components/screen-placeholder';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
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
      <SafeAreaView style={styles.container} edges={['top']}>
        <CatGrid
          cats={favourites}
          header={
            <View style={styles.header}>
              <ThemedText type="subtitle">Favourites</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                The hall of fame.
              </ThemedText>
            </View>
          }
          onRefresh={refetch}
        />
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
  header: {
    gap: Spacing.half,
    paddingBottom: Spacing.two,
  },
});
