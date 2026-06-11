import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { Banner } from '@/components/banner';
import { CatGrid } from '@/components/cat-grid';
import { ScreenBackground } from '@/components/screen-background';
import { ScreenPlaceholder } from '@/components/screen-placeholder';
import { ThemedText } from '@/components/themed-text';
import { useCats } from '@/hooks/use-cats';

export default function HomeScreen() {
  const router = useRouter();
  const { cats, isLoading, error, refetch } = useCats();

  function renderContent() {
    if (isLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
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

    return <CatGrid cats={cats} onRefresh={refetch} />;
  }

  return (
    <ScreenBackground>
      <Banner title="Pawfolio" />
      {renderContent()}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
