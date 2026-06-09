import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Tabs, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

const queryClient = new QueryClient();

export default function RootLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.text,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarStyle: { backgroundColor: colors.background },
          }}>
          <Tabs.Screen name="upload" options={{ title: 'Upload' }} />
          <Tabs.Screen name="index" options={{ title: 'Home' }} />
          <Tabs.Screen name="favourites" options={{ title: 'Favourites' }} />
        </Tabs>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
