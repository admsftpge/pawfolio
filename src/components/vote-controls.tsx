import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useVote } from '@/hooks/use-vote';

type Props = {
  imageId: string;
  score: number;
};

export function VoteControls({ imageId, score }: Props) {
  const theme = useTheme();
  const vote = useVote();

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Vote this cat up"
        disabled={vote.isPending}
        hitSlop={Spacing.two}
        onPress={() => vote.mutate({ imageId, value: 1 })}>
        <Ionicons name="caret-up" size={22} color={theme.textSecondary} />
      </Pressable>

      <ThemedText type="smallBold" accessibilityLabel={`Score ${score}`}>
        {score}
      </ThemedText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Vote this cat down"
        disabled={vote.isPending}
        hitSlop={Spacing.two}
        onPress={() => vote.mutate({ imageId, value: -1 })}>
        <Ionicons name="caret-down" size={22} color={theme.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
});
