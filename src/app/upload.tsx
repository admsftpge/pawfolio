import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getApiErrorMessage } from '@/api/client';
import { AppButton } from '@/components/app-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
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

          {asset ? (
            <Image
              source={{ uri: asset.uri }}
              style={styles.preview}
              contentFit="cover"
              accessibilityLabel="Preview of the photo you picked"
            />
          ) : (
            <ThemedView type="backgroundElement" style={[styles.preview, styles.placeholder]}>
              <ThemedText type="default" themeColor="textSecondary">
                Your photo will preview here
              </ThemedText>
            </ThemedView>
          )}

          {errorMessage && (
            <ThemedText type="smallBold" themeColor="danger" accessibilityRole="alert">
              {errorMessage}
            </ThemedText>
          )}

          <View style={styles.actions}>
            <AppButton
              title={asset ? 'Choose a different photo' : 'Choose a photo'}
              onPress={pickImage}
              disabled={upload.isPending}
            />
            {asset && (
              <AppButton
                title="Upload"
                onPress={submit}
                disabled={Boolean(validationError)}
                loading={upload.isPending}
              />
            )}
          </View>
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
    borderRadius: Spacing.three,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    gap: Spacing.three,
  },
});
