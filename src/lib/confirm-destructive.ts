import { Alert, Platform } from 'react-native';

export function confirmDestructive(title: string, message: string, onConfirm: () => void) {
  // RN's Alert is a silent no-op in browsers.
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }

  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: onConfirm },
  ]);
}
