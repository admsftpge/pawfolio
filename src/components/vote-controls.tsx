import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { usePopAnimation } from '@/hooks/use-pop-animation';
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

  const { style: popStyle, pop } = usePopAnimation();

  // Pop the score when it changes, but not on first mount.
  const previousScore = useRef(score);
  useEffect(() => {
    if (previousScore.current !== score) {
      previousScore.current = score;
      pop();
    }
  }, [score, pop]);

  const scoreColor = score > 0 ? 'success' : score < 0 ? 'danger' : 'text';

  return (
    <View style={[styles.pill, { backgroundColor: theme.backgroundElement }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Vote this cat up"
        disabled={vote.isPending}
        hitSlop={Spacing.two}
        onPress={() => vote.mutate({ imageId, value: 1 })}
        style={({ pressed }) => [styles.segment, pressed && styles.pressed]}>
        <Ionicons name="caret-up" size={18} color={theme.success} />
      </Pressable>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <Animated.View style={popStyle}>
        <ThemedText
          type="smallBold"
          themeColor={scoreColor}
          style={styles.score}
          accessibilityLabel={`Score ${score}`}>
          {score}
        </ThemedText>
      </Animated.View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Vote this cat down"
        disabled={vote.isPending}
        hitSlop={Spacing.two}
        onPress={() => vote.mutate({ imageId, value: -1 })}
        style={({ pressed }) => [styles.segment, pressed && styles.pressed]}>
        <Ionicons name="caret-down" size={18} color={theme.danger} />
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
