import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getApiErrorMessage } from '@/api/client';
import { AppButton } from '@/components/app-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useUploadCat } from '@/hooks/use-upload-cat';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

function validate(asset: ImagePicker.ImagePickerAsset): string | null {
  if (asset.mimeType && !ALLOWED_MIME_TYPES.includes(asset.mimeType)) {
    return 'That file type won’t work — please choose a JPEG or PNG.';
  }
  if (asset.fileSize && asset.fileSize > MAX_FILE_BYTES) {
    return 'That photo is over 10 MB — please choose a smaller one.';
  }
  return null;
}

export default function UploadScreen() {
  const theme = useTheme();
  const router = useRouter();
  const upload = useUploadCat();
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const validationError = asset ? validate(asset) : null;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (result.canceled) return;

    setAsset(result.assets[0]);
    upload.reset();
  };

  const submit = () => {
    if (!asset || validationError) return;

    upload.mutate(
      {
        uri: asset.uri,
        name: asset.fileName ?? 'cat.jpg',
        mimeType: asset.mimeType ?? 'image/jpeg',
      },
      {
        onSuccess: () => {
          setAsset(null);
          router.navigate('/');
        },
      },
    );
  };

  const errorMessage = validationError ?? (upload.error ? getApiErrorMessage(upload.error) : null);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">Upload a cat</ThemedText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={asset ? 'Choose a different photo' : 'Choose a photo'}
            disabled={upload.isPending}
            onPress={pickImage}>
            {asset ? (
              <Image
                source={{ uri: asset.uri }}
                style={styles.preview}
                contentFit="cover"
                accessibilityLabel="Preview of the photo you picked"
              />
            ) : (
              <View
                style={[
                  styles.preview,
                  styles.dropZone,
                  { borderColor: theme.textSecondary, backgroundColor: theme.backgroundElement },
                ]}>
                <Ionicons name="camera-outline" size={44} color={theme.textSecondary} />
                <ThemedText type="smallBold" themeColor="textSecondary">
                  Show us your finest feline
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  JPEG or PNG, up to 10 MB
                </ThemedText>
              </View>
            )}
          </Pressable>

          {errorMessage && (
            <ThemedText
              type="smallBold"
              themeColor="danger"
              style={styles.error}
              accessibilityRole="alert">
              {errorMessage}
            </ThemedText>
          )}

          {asset && (
            <View style={styles.actions}>
              <AppButton
                title="Add to Pawfolio"
                onPress={submit}
                disabled={Boolean(validationError)}
                loading={upload.isPending}
              />
              <ThemedText
                type="smallBold"
                themeColor="textSecondary"
                style={styles.changeLink}
                accessibilityRole="button"
                onPress={pickImage}>
                Choose a different photo
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  preview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Radius.lg,
  },
  dropZone: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  error: {
    textAlign: 'center',
  },
  actions: {
    gap: Spacing.three,
  },
  changeLink: {
    textAlign: 'center',
  },
});
