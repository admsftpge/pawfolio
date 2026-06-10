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

  return (
    <View
      style={[styles.pill, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Vote this cat up"
        disabled={vote.isPending}
        hitSlop={Spacing.two}
        onPress={() => vote.mutate({ imageId, value: 1 })}
        style={({ pressed }) => [
          styles.chip,
          { backgroundColor: theme.successSoft },
          pressed && styles.pressed,
        ]}>
        <Ionicons name="caret-up" size={18} color={theme.success} />
      </Pressable>

      <Animated.View style={popStyle}>
        <ThemedText style={styles.score} accessibilityLabel={`Score ${score}`}>
          {score}
        </ThemedText>
      </Animated.View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Vote this cat down"
        disabled={vote.isPending}
        hitSlop={Spacing.two}
        onPress={() => vote.mutate({ imageId, value: -1 })}
        style={({ pressed }) => [
          styles.chip,
          { backgroundColor: theme.dangerSoft },
          pressed && styles.pressed,
        ]}>
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
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.one,
  },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
  },
  pressed: {
    opacity: 0.5,
  },
  score: {
    minWidth: 36,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 700,
  },
});
