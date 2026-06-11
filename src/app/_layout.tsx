import { Ionicons } from '@expo/vector-icons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DefaultTheme, Tabs, ThemeProvider } from 'expo-router';

import { Colors } from '@/constants/theme';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DefaultTheme}>
        <Tabs
          initialRouteName="index"
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Colors.accent,
            tabBarInactiveTintColor: Colors.textSecondary,
            tabBarStyle: { backgroundColor: Colors.background },
          }}>
          <Tabs.Screen
            name="upload"
            options={{
              title: 'Upload',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="cloud-upload-outline" color={color} size={size} />
              ),
            }}
          />
          <Tabs.Screen
            name="index"
            options={{
              title: 'Pawfolio',
              tabBarIcon: ({ color, size }) => <Ionicons name="paw" color={color} size={size} />,
            }}
          />
          <Tabs.Screen
            name="favourites"
            options={{
              title: 'Favourites',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="heart-outline" color={color} size={size} />
              ),
            }}
          />
        </Tabs>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
