import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CatCard } from '@/components/cat-card';
import { ScreenPlaceholder } from '@/components/screen-placeholder';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useCats } from '@/hooks/use-cats';

const MIN_CARD_WIDTH = 160;
const MAX_COLUMNS = 4;
const GAP = Spacing.three;

export default function HomeScreen() {
  const { cats, isLoading, error, refetch } = useCats();
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);

  const columns = Math.min(MAX_COLUMNS, Math.max(1, Math.floor(width / MIN_CARD_WIDTH)));
  const cardWidth = (width - 2 * GAP - (columns - 1) * GAP) / columns;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error || !cats) {
    return (
      <ScreenPlaceholder
        title="Something went wrong"
        subtitle="Couldn't fetch your cats. Check your connection and try again."
        action={
          <ThemedText type="linkPrimary" onPress={() => refetch()}>
            Try again
          </ThemedText>
        }
      />
    );
  }

  if (cats.length === 0) {
    return (
      <ScreenPlaceholder
        title="No cats yet"
        subtitle="Upload your first cat and it will show up here."
        action={
          <Link href="/upload">
            <ThemedText type="linkPrimary">Upload a cat</ThemedText>
          </Link>
        }
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <FlatList
          // numColumns can't change on a mounted FlatList; new key remounts on breakpoint change.
          key={`grid-${columns}`}
          data={cats}
          keyExtractor={(cat) => cat.id}
          numColumns={columns}
          renderItem={({ item }) => <CatCard cat={item} width={cardWidth} />}
          columnWrapperStyle={columns > 1 ? styles.row : undefined}
          contentContainerStyle={styles.list}
          ListHeaderComponent={<ThemedText type="subtitle">Your cats</ThemedText>}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
  list: {
    padding: GAP,
    gap: GAP,
  },
  row: {
    gap: GAP,
  },
});
