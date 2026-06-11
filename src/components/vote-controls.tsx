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

export function VoteControls({ imageId, score }: Props) {
  const theme = useTheme();
  const vote = useVote();

  const voteButton = (value: 1 | -1) => {
    const up = value === 1;
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={up ? 'Vote this cat up' : 'Vote this cat down'}
        hitSlop={Spacing.two}
        onPress={() => vote.mutate({ imageId, value })}
        style={({ pressed }) => [
          styles.chip,
          { backgroundColor: up ? theme.successSoft : theme.dangerSoft },
          pressed && styles.pressed,
        ]}>
        <Ionicons
          name={up ? 'caret-up' : 'caret-down'}
          size={18}
          color={up ? theme.success : theme.danger}
        />
      </Pressable>
    );
  };

  return (
    <View
      style={[styles.pill, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {voteButton(1)}
      <ThemedText style={styles.score} accessibilityLabel={`Score ${score}`}>
        {score}
      </ThemedText>
      {voteButton(-1)}
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
