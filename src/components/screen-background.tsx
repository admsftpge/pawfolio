import { ReactNode } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';

const texture = require('../../assets/images/background.png');

type Props = {
  children: ReactNode;
};

export function ScreenBackground({ children }: Props) {
  return (
    <ImageBackground
      source={texture}
      resizeMode="repeat"
      style={styles.background}
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
