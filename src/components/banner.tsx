import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// The "instrument panel" lens + status lights are intrinsic to the motif, not
// theme roles — they stay fixed if the app palette is repainted, so they live
// here rather than in the semantic palette.
const LENS_COLOR = '#3FA2F6';
const LENS_HIGHLIGHT = 'rgba(255, 255, 255, 0.55)';
const LED_COLORS = ['#FF5A5A', '#FFD23F', '#43D17A'];

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
          {LED_COLORS.map((color) => (
            <View key={color} style={[styles.led, { backgroundColor: color }]} />
          ))}
        </View>
      </View>
      <ThemedText type="subtitle" themeColor="accentOn" style={styles.title}>
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
    backgroundColor: LENS_COLOR,
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
    backgroundColor: LENS_HIGHLIGHT,
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
  // Smaller than the `subtitle` type's 32px so the header stays compact.
  title: {
    fontSize: 26,
    lineHeight: 30,
  },
});
