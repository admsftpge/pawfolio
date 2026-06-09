import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

// TheCatApi ties uploads, favourites and votes to one account key. I attach a
// stable per-device sub_id so those actions scope to "this user", simulating
// multiple users on a single shared key. In production I'd add real auth.
const STORAGE_KEY = 'catapp.sub_id';

let cached: string | undefined;

/** Returns this device's sub_id, generating and persisting one on first run. */
export async function getSubId(): Promise<string> {
  if (cached) return cached;

  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      cached = stored;
      return stored;
    }
  } catch {
    // Read failed — fall through and use a fresh id for this session.
  }

  const fresh = Crypto.randomUUID();
  cached = fresh;

  try {
    await AsyncStorage.setItem(STORAGE_KEY, fresh);
  } catch {
    // Persist failed — id stays valid this session, regenerates next launch.
  }

  return fresh;
}
