import { ActivityIndicator, StyleSheet } from 'react-native';

import { Banner } from '@/components/banner';
import { CatGrid } from '@/components/cat-grid';
import { ScreenBackground } from '@/components/screen-background';
import { ScreenPlaceholder } from '@/components/screen-placeholder';
import { ThemedText } from '@/components/themed-text';
import { useCats } from '@/hooks/use-cats';

export default function FavouritesScreen() {
  const { cats, isLoading, error, refetch } = useCats();
  const favourites = cats?.filter((cat) => cat.favouriteId !== null);

  if (isLoading) {
    return (
      <ScreenBackground style={styles.center}>
        <ActivityIndicator size="large" />
      </ScreenBackground>
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
    <ScreenBackground>
      <Banner title="Favourites" />
      <CatGrid cats={favourites} onRefresh={refetch} />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
