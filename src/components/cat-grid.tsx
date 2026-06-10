import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, useWindowDimensions } from 'react-native';

import { CatCard } from '@/components/cat-card';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { CatCard as CatCardModel } from '@/data/cat-cards';

const MIN_CARD_WIDTH = 160;
const MAX_COLUMNS = 4;
const GAP = Spacing.three;

type Props = {
  cats: CatCardModel[];
  title: string;
  onRefresh: () => Promise<unknown>;
};

export function CatGrid({ cats, title, onRefresh }: Props) {
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);

  const columns = Math.min(MAX_COLUMNS, Math.max(1, Math.floor(width / MIN_CARD_WIDTH)));
  const cardWidth = (width - 2 * GAP - (columns - 1) * GAP) / columns;

  const refresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <FlatList
      // numColumns can't change on a mounted FlatList; new key remounts on breakpoint change.
      key={`grid-${columns}`}
      data={cats}
      keyExtractor={(cat) => cat.id}
      numColumns={columns}
      renderItem={({ item }) => <CatCard cat={item} width={cardWidth} />}
      columnWrapperStyle={columns > 1 ? styles.row : undefined}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<ThemedText type="subtitle">{title}</ThemedText>}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: GAP,
    gap: GAP,
  },
  row: {
    gap: GAP,
  },
});
