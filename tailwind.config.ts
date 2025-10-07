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
      colors: {
        background: {
          light: '#FFFFFF',
          dark: '#121213',
        },
        text: {
          light: '#000000',
          dark: '#FFFFFF',
        },
        tile: {
          default: {
            light: '#E5E7EB', // Light grey (unguessed)
            dark: '#E5E7EB',
          },
          green: '#1E3A8A', // Navy blue (correct position)
          yellow: '#0EA5E9', // Sky blue (wrong position)
          gray: {
            light: '#4B5563', // Dark grey (incorrect)
            dark: '#4B5563',
          },
          // Color blind mode colors
          'green-cb': '#F97316', // Orange (correct position)
          'yellow-cb': '#3B82F6', // Blue (wrong position)
        },
        keyboard: '#9CA3AF',
        'keyboard-disabled': '#6B7280', // Darkish grey for disabled state
        border: {
          light: '#D3D6DA',
          dark: '#3A3A3C',
        },
        primary: {
          DEFAULT: '#1E3A8A',
          dark: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        },
        error: '#DC2626',
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
