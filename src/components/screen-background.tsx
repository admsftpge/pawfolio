import { ReactNode } from 'react';
import { ImageBackground, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { Colors } from '@/constants/theme';

const texture = require('../../assets/images/background.png');

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function ScreenBackground({ children, style }: Props) {
  return (
    <ImageBackground
      source={texture}
      resizeMode="repeat"
      style={[styles.background, style]}
      imageStyle={styles.texture}>
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  texture: {
    opacity: 0.3,
  },
});
