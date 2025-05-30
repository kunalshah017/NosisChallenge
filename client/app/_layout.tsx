import '~/global.css';
import 'expo-dev-client';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';


import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import { useFontsLoader } from '~/lib/useFonts';
import { queryClient, asyncStoragePersister } from '~/lib/queryClient';

import Header from '~/components/Header';

SplashScreen.preventAutoHideAsync();

export {
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {

  useInitialAndroidBarSync();

  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const fontsLoaded = useFontsLoader();

  const SCREEN_OPTIONS = {
    animation: 'ios_from_right',
  } as const;

  const headerOptions = {
    headerShown: true,
    headerTitle: (props: any) => <Header {...props} />,
    headerBackVisible: false,
  } as const;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: asyncStoragePersister,
          maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
          buster: '1.0.0', // Update this when you want to invalidate all cached data
        }}
      >
        <StatusBar
          key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
          style={isDarkColorScheme ? 'light' : 'dark'}
        />

        <NavThemeProvider value={NAV_THEME[colorScheme]}>
          <Stack screenOptions={SCREEN_OPTIONS}>
            <Stack.Screen name="(tabs)" options={headerOptions} />
            <Stack.Screen name="details/[id]" options={headerOptions} />
            <Stack.Screen name="read/index" options={headerOptions} />
          </Stack>
        </NavThemeProvider>
      </PersistQueryClientProvider>
    </>
  );
}

