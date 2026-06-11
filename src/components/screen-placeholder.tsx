import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FormMaxWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  title: string;
  subtitle: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
  action?: ReactNode;
};

export function ScreenPlaceholder({ title, subtitle, icon, action }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.content}>
      {icon && <Ionicons name={icon} size={56} color={theme.textSecondary} />}
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
        {subtitle}
      </ThemedText>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    // Clears the raised Pawfolio tab button, which overhangs the tab bar.
    paddingBottom: Spacing.six,
    width: '100%',
    maxWidth: FormMaxWidth,
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
});
