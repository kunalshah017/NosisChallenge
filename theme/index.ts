import { Theme, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { COLORS } from './colors';

const NAV_THEME: { light: Theme; dark: Theme } = {
  light: {
    dark: false,
    colors: {
      background: COLORS.light.background,
      border: COLORS.light.grey5,
      card: COLORS.light.grey4,
      notification: COLORS.light.destructive,
      primary: COLORS.light.primary,
      text: COLORS.light.primary,
    },
    fonts: DefaultTheme.fonts,
  },
  dark: {
    dark: true,
    colors: {
      background: COLORS.dark.background,
      border: COLORS.dark.grey5,
      card: COLORS.dark.grey6,
      notification: COLORS.dark.destructive,
      primary: COLORS.dark.primary,
      text: COLORS.dark.primary,
    },
    fonts: DarkTheme.fonts,
  },
};

export { NAV_THEME };
