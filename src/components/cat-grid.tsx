import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { CatCard } from '@/components/cat-card';
import { FormMaxWidth, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { CatCard as CatCardModel } from '@/data/cat-cards';
import { useTheme } from '@/hooks/use-theme';

const MIN_CARD_WIDTH = 160;
const MAX_COLUMNS = 4;
const GAP = Spacing.three;

type ViewMode = 'grid' | 'list';

type Props = {
  cats: CatCardModel[];
  onRefresh: () => Promise<unknown>;
};

export function CatGrid({ cats, onRefresh }: Props) {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [mode, setMode] = useState<ViewMode>('grid');

  // Cap the layout width so a wide browser renders a centred column, not a stretched grid.
  // List view is a single-column feed, so it sits in a narrower column than the grid —
  // and its square card is also capped by height so it fits landscape's short viewport.
  const layoutMaxWidth = mode === 'list' ? FormMaxWidth : MaxContentWidth;
  const contentWidth = Math.min(width, layoutMaxWidth);
  const columns =
    mode === 'list'
      ? 1
      : Math.min(MAX_COLUMNS, Math.max(1, Math.floor(contentWidth / MIN_CARD_WIDTH)));
  const widthPerCard = (contentWidth - 2 * GAP - (columns - 1) * GAP) / columns;
  const cardWidth = mode === 'list' ? Math.min(widthPerCard, height * 0.55) : widthPerCard;

  const refresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  const modeButton = (target: ViewMode, icon: 'grid-outline' | 'list-outline', label: string) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: mode === target }}
      onPress={() => setMode(target)}
      style={[styles.modeButton, mode === target && { backgroundColor: theme.surface }]}>
      <Ionicons
        name={icon}
        size={16}
        color={mode === target ? theme.accent : theme.textSecondary}
      />
    </Pressable>
  );

  return (
    <FlatList
      // numColumns can't change on a mounted FlatList; new key remounts on breakpoint change.
      key={`grid-${columns}`}
      data={cats}
      keyExtractor={(cat) => cat.id}
      numColumns={columns}
      renderItem={({ item }) => <CatCard cat={item} width={cardWidth} />}
      columnWrapperStyle={columns > 1 ? styles.row : undefined}
      contentContainerStyle={[styles.list, { maxWidth: layoutMaxWidth }]}
      ListHeaderComponent={
        <View style={[styles.modeToggle, { backgroundColor: theme.backgroundElement }]}>
          {modeButton('grid', 'grid-outline', 'Grid view')}
          {modeButton('list', 'list-outline', 'List view')}
        </View>
      }
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: GAP,
    gap: GAP,
    width: '100%',
    alignSelf: 'center',
  },
  row: {
    gap: GAP,
  },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: Radius.pill,
    padding: Spacing.half,
    alignSelf: 'flex-end',
  },
  modeButton: {
    paddingHorizontal: Spacing.two + Spacing.half,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
});
