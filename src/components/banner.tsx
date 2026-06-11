import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { DisplayFont, Motif, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  title: string;
};

export function Banner({ title }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: theme.accent, paddingTop: insets.top + Spacing.two },
      ]}>
      <StatusBar style="light" />
      <View style={styles.instruments}>
        <View style={styles.lens}>
          <View style={styles.lensHighlight} />
        </View>
        <View style={styles.leds}>
          {Motif.leds.map((color) => (
            <View key={color} style={[styles.led, { backgroundColor: color }]} />
          ))}
        </View>
      </View>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Motif.outline,
  },
  instruments: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  lens: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Motif.lens,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  lensHighlight: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Motif.lensHighlight,
  },
  leds: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  led: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontFamily: DisplayFont,
    fontWeight: 'normal',
    fontSize: 28,
    lineHeight: 36,
    color: Motif.title,
    textShadowColor: Motif.titleOutline,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
});
