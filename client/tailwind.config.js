const { hairlineWidth, platformSelect } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  darkMode: 'class', // Enable manual toggling of dark mode
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: withOpacity('border'),
        input: withOpacity('input'),
        ring: withOpacity('ring'),
        lightBackground: withOpacity('light-background'),
        background: withOpacity('background'),
        foreground: withOpacity('foreground'),
        primary: {
          DEFAULT: withOpacity('primary'),
          foreground: withOpacity('primary-foreground'),
        },
        secondary: {
          DEFAULT: withOpacity('secondary'),
          foreground: withOpacity('secondary-foreground'),
        },
        destructive: {
          DEFAULT: withOpacity('destructive'),
          foreground: withOpacity('destructive-foreground'),
        },
        muted: {
          DEFAULT: withOpacity('muted'),
          foreground: withOpacity('muted-foreground'),
        },
        accent: {
          DEFAULT: withOpacity('accent'),
          foreground: withOpacity('accent-foreground'),
        },
        popover: {
          DEFAULT: withOpacity('popover'),
          foreground: withOpacity('popover-foreground'),
        },
        card: {
          DEFAULT: withOpacity('card'),
          foreground: withOpacity('card-foreground'),
        },
      },
      fontFamily: {
        // Poppins
        'poppins-thin': ['Poppins-Thin'],
        'poppins-extralight': ['Poppins-ExtraLight'],
        'poppins-light': ['Poppins-Light'],
        'poppins-regular': ['Poppins-Regular'],
        'poppins-medium': ['Poppins-Medium'],
        'poppins-semibold': ['Poppins-SemiBold'],
        'poppins-bold': ['Poppins-Bold'],
        'poppins-extrabold': ['Poppins-ExtraBold'],
        'poppins-black': ['Poppins-Black'],

        // DM Sans
        'dmsans-thin': ['DMSans-Thin'],
        'dmsans-extralight': ['DMSans-ExtraLight'],
        'dmsans-light': ['DMSans-Light'],
        'dmsans-regular': ['DMSans-Regular'],
        'dmsans-medium': ['DMSans-Medium'],
        'dmsans-semibold': ['DMSans-SemiBold'],
        'dmsans-bold': ['DMSans-Bold'],
        'dmsans-extrabold': ['DMSans-ExtraBold'],
        'dmsans-black': ['DMSans-Black'],
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
  plugins: [],
};

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return platformSelect({
        ios: `rgb(var(--${variableName}) / ${opacityValue})`,
        android: `rgb(var(--android-${variableName}) / ${opacityValue})`,
      });
    }
    return platformSelect({
      ios: `rgb(var(--${variableName}))`,
      android: `rgb(var(--android-${variableName}))`,
    });
  };
}
