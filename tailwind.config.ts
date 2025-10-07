import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'fold': '280px', // Samsung Fold and very narrow screens
      },
      colors: {
        background: {
          light: '#FAFAFA',
          dark: '#1A1A1B',
        },
        text: {
          light: '#1F2937',
          dark: '#F9FAFB',
        },
        tile: {
          default: {
            light: '#FFFFFF', // White (unguessed)
            dark: '#FFFFFF',
          },
          green: '#10B981', // Emerald green (correct position)
          yellow: '#F59E0B', // Amber (wrong position)
          gray: {
            light: '#6B7280', // Gray (incorrect)
            dark: '#6B7280',
          },
          // Color blind mode colors
          'green-cb': '#3B82F6', // Blue (correct position)
          'yellow-cb': '#F97316', // Orange (wrong position)
        },
        keyboard: '#D1D5DB',
        'keyboard-disabled': '#9CA3AF', // Lighter grey for disabled state
        border: {
          light: '#E5E7EB',
          dark: '#374151',
        },
        primary: {
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        secondary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        },
        error: '#EF4444',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateX(0)' },
          '50%': { transform: 'rotateX(90deg)' },
          '100%': { transform: 'rotateX(0)' },
        },
        pop: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        bounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
      },
      animation: {
        flip: 'flip 0.5s ease-in-out',
        pop: 'pop 0.1s ease-in-out',
        shake: 'shake 0.5s ease-in-out',
        bounce: 'bounce 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;
