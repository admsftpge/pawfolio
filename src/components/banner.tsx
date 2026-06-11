import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  title: string;
  subtitle?: string;
};

export function Banner({ title, subtitle }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: theme.accent, paddingTop: insets.top + Spacing.three },
      ]}>
      <StatusBar style="light" />
      <ThemedText type="subtitle" themeColor="accentOn">
        {title}
      </ThemedText>
      {subtitle && (
        <ThemedText type="small" themeColor="accentOn" style={styles.subtitle}>
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },
  subtitle: {
    opacity: 0.9,
  },
});
