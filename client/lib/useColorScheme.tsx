import * as NavigationBar from 'expo-navigation-bar';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform, useColorScheme as useSystemColorScheme } from 'react-native';

import { COLORS } from '~/theme/colors';
import { usePreferencesStore } from '~/store/usePreferencesStore';

function useColorScheme() {
  const { setColorScheme: setNativeWindColorScheme } = useNativewindColorScheme();
  const systemColorScheme = useSystemColorScheme();
  const { themeMode } = usePreferencesStore();

  const effectiveColorScheme = React.useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme ?? 'light';
    }
    return themeMode === 'dark' ? 'dark' : 'light';
  }, [themeMode, systemColorScheme]);

  React.useEffect(() => {
    setNativeWindColorScheme(effectiveColorScheme);
  }, [effectiveColorScheme, setNativeWindColorScheme]);

  return {
    colorScheme: effectiveColorScheme,
    isDarkColorScheme: effectiveColorScheme === 'dark',
    colors: COLORS[effectiveColorScheme],
  };
}

/**
 * Set the Android navigation bar color based on the color scheme.
 */
function useInitialAndroidBarSync() {
  const { colorScheme } = useColorScheme();
  React.useEffect(() => {
    if (Platform.OS !== 'android') return;
    setNavigationBar(colorScheme).catch((error) => {
      console.error('useColorScheme.tsx", "useInitialColorScheme', error);
    });
  }, [colorScheme]);
}

function setNavigationBar(colorScheme: 'light' | 'dark') {
  return Promise.all([
    NavigationBar.setButtonStyleAsync(colorScheme === 'dark' ? 'light' : 'dark'),
    NavigationBar.setPositionAsync('absolute'),
    NavigationBar.setBackgroundColorAsync('transparent'), // Make it fully transparent
    NavigationBar.setBehaviorAsync('overlay-swipe'), // Allow content to render behind nav bar
  ]);
}

export { useColorScheme, useInitialAndroidBarSync };