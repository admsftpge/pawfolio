import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useVote } from '@/hooks/use-vote';

type Props = {
  imageId: string;
  score: number;
};

/** Segmented pill: vote up | score | vote down. */
export function VoteControls({ imageId, score }: Props) {
  const theme = useTheme();
  const vote = useVote();

  return (
    <View style={[styles.pill, { backgroundColor: theme.backgroundElement }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Vote this cat up"
        disabled={vote.isPending}
        hitSlop={Spacing.two}
        onPress={() => vote.mutate({ imageId, value: 1 })}
        style={({ pressed }) => [styles.segment, pressed && styles.pressed]}>
        <Ionicons name="caret-up" size={18} color={theme.text} />
      </Pressable>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <ThemedText type="smallBold" style={styles.score} accessibilityLabel={`Score ${score}`}>
        {score}
      </ThemedText>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Vote this cat down"
        disabled={vote.isPending}
        hitSlop={Spacing.two}
        onPress={() => vote.mutate({ imageId, value: -1 })}
        style={({ pressed }) => [styles.segment, pressed && styles.pressed]}>
        <Ionicons name="caret-down" size={18} color={theme.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  segment: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  pressed: {
    opacity: 0.5,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
  score: {
    minWidth: 28,
    textAlign: 'center',
  },
});
