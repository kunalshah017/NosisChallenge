import { Platform } from 'react-native';

// Colors extracted from palette image
const PALETTE = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',

  // Darks
  d50: '#ebe9e8',
  d75: '#aba340',
  d100: '#867d79',
  d200: '#55453f',
  d300: '#321f18',
  d400: '#231611',
  d500: '#1f130f',

  // Neutrals
  n50: '#fdfcfc',
  n75: '#f6f4f2',
  n100: '#f3f0ec',
  n200: '#eee9e4',
  n300: '#e8e5df',
  n400: '#a4a09c',
  n500: '#8f8c88',

  // Browns
  b50: '#f4ede7',
  b75: '#f9d39c',
  b100: '#c29473',
  b200: '#a76537',
  b300: '#65460e',
  b400: '#58310a',
  b500: '#5b2b09',

  // Greens
  g50: '#e8ebec',
  g75: '#9adadf',
  g100: '#5c8c8e',
  g200: '#2c5a5e',
  g300: '#013834',
  g400: '#01272c',
  g500: '#012225',
} as const;

const IOS_SYSTEM_COLORS = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  light: {
    grey6: PALETTE.n50,
    grey5: PALETTE.n75,
    grey4: PALETTE.n100,
    grey3: PALETTE.n200,
    grey2: PALETTE.n300,
    grey: PALETTE.n400,
    background: PALETTE.b50,
    foreground: PALETTE.d300,
    root: PALETTE.white,
    card: PALETTE.white,
    destructive: PALETTE.b200,
    primary: PALETTE.g300,
    tabBarActiveTint: PALETTE.g400,
    tabBarInactiveTint: PALETTE.g100,
  },
  dark: {
    grey6: PALETTE.d100,
    grey5: PALETTE.d200,
    grey4: PALETTE.d300,
    grey3: PALETTE.d400,
    grey2: PALETTE.n400,
    grey: PALETTE.n300,
    background: PALETTE.d500,
    foreground: PALETTE.n50,
    root: PALETTE.d500,
    card: PALETTE.d200,
    destructive: PALETTE.b400,
    primary: PALETTE.g200,
    tabBarActiveTint: PALETTE.g200,
    tabBarInactiveTint: PALETTE.n400,
  },
} as const;

const ANDROID_COLORS = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  light: {
    grey6: PALETTE.n50,
    grey5: PALETTE.n75,
    grey4: PALETTE.n100,
    grey3: PALETTE.n200,
    grey2: PALETTE.n300,
    grey: PALETTE.n400,
    background: PALETTE.b50,
    foreground: PALETTE.d300,
    root: PALETTE.white,
    card: PALETTE.white,
    destructive: PALETTE.b200,
    primary: PALETTE.g300,
    tabBarActiveTint: PALETTE.g400,
    tabBarInactiveTint: PALETTE.g100,
  },
  dark: {
    grey6: PALETTE.d100,
    grey5: PALETTE.d200,
    grey4: PALETTE.d300,
    grey3: PALETTE.d400,
    grey2: PALETTE.n400,
    grey: PALETTE.n300,
    background: PALETTE.d500,
    foreground: PALETTE.n50,
    root: PALETTE.d500,
    card: PALETTE.d200,
    destructive: PALETTE.b400,
    primary: PALETTE.g200,
    tabBarActiveTint: PALETTE.g200,
    tabBarInactiveTint: PALETTE.n400,
  },
} as const;

const COLORS = Platform.OS === 'ios' ? IOS_SYSTEM_COLORS : ANDROID_COLORS;

// Export additional palette for more granular control in components
export { COLORS, PALETTE };
