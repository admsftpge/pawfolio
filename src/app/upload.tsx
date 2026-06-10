import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getApiErrorMessage } from '@/api/client';
import { AppButton } from '@/components/app-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FormMaxWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useUploadCat } from '@/hooks/use-upload-cat';

// Generous ceiling — we downscale + transcode to JPEG before upload, so this
// only guards against reading a pathologically large file into memory.
const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB

function validate(asset: ImagePicker.ImagePickerAsset): string | null {
  if (asset.fileSize && asset.fileSize > MAX_FILE_BYTES) {
    return 'That photo is enormous — please choose one under 25 MB.';
  }
  return null;
}

export default function UploadScreen() {
  const theme = useTheme();
  const window = useWindowDimensions();
  const router = useRouter();
  const upload = useUploadCat();
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [pickError, setPickError] = useState<string | null>(null);
  const validationError = asset ? validate(asset) : null;

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (result.canceled) return;

      setAsset(result.assets[0]);
      setPickError(null);
      upload.reset();
    } catch {
      setPickError('Couldn’t open your photo library — please try again.');
    }
  };

  const submit = () => {
    if (!asset || validationError) return;

    upload.mutate(
      { uri: asset.uri, width: asset.width, height: asset.height },
      {
        onSuccess: () => {
          setAsset(null);
          router.navigate('/');
        },
      },
    );
  };

  const errorMessage =
    validationError ?? pickError ?? (upload.error ? getApiErrorMessage(upload.error) : null);

  // Square sized by the scarcer dimension, so it fits landscape's short viewport too.
  const previewSize = Math.min(
    Math.min(window.width, FormMaxWidth) - 2 * Spacing.four,
    window.height * 0.55,
  );

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
                style={[styles.preview, { width: previewSize, height: previewSize }]}
                contentFit="cover"
                accessibilityLabel="Preview of the photo you picked"
              />
            ) : (
              <View
                style={[
                  styles.preview,
                  { width: previewSize, height: previewSize },
                  styles.dropZone,
                  { borderColor: theme.textSecondary, backgroundColor: theme.backgroundElement },
                ]}>
                <Ionicons name="camera-outline" size={44} color={theme.textSecondary} />
                <ThemedText type="smallBold" themeColor="textSecondary" style={styles.dropZoneText}>
                  Show us your finest feline
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.dropZoneText}>
                  Any photo — we’ll optimise it for you
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
    width: '100%',
    maxWidth: FormMaxWidth,
    alignSelf: 'center',
  },
  preview: {
    alignSelf: 'center',
    borderRadius: Radius.lg,
  },
  dropZone: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  dropZoneText: {
    maxWidth: '100%',
    textAlign: 'center',
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
