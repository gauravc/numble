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
            light: '#D3D6DA',
            dark: '#3A3A3C',
          },
          green: '#538D4E',
          yellow: '#B59F3B',
          gray: {
            light: '#787C7E',
            dark: '#3A3A3C',
          },
        },
        keyboard: '#818384',
        border: {
          light: '#D3D6DA',
          dark: '#3A3A3C',
        },
        primary: '#538D4E',
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
