import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { AppButton } from '@/components/app-button';
import { Banner } from '@/components/banner';
import { CatGrid } from '@/components/cat-grid';
import { ScreenPlaceholder } from '@/components/screen-placeholder';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCats } from '@/hooks/use-cats';

export default function HomeScreen() {
  const router = useRouter();
  const { cats, isLoading, error, refetch } = useCats();

  if (isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error || !cats) {
    return (
      <ScreenPlaceholder
        icon="cloud-offline-outline"
        title="Something went wrong"
        subtitle="Couldn't fetch your cats. Check your connection and try again."
        action={
          <ThemedText
            type="smallBold"
            themeColor="accent"
            accessibilityRole="button"
            onPress={() => refetch()}>
            Try again
          </ThemedText>
        }
      />
    );
  }

  if (cats.length === 0) {
    return (
      <ScreenPlaceholder
        icon="paw-outline"
        title="No cats yet"
        subtitle="Your Pawfolio is waiting for its first star."
        action={<AppButton title="Upload a cat" onPress={() => router.navigate('/upload')} />}
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Banner title="Pawfolio" />
      <CatGrid cats={cats} onRefresh={refetch} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
