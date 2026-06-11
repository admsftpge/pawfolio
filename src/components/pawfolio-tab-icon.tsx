import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Motif } from '@/constants/theme';

export function PawfolioTabIcon() {
  return (
    <View style={styles.button}>
      <Ionicons name="paw" size={26} color="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Motif.lens,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -20 }],
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
});
