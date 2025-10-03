import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Numble - Daily Math Equation Puzzle',
  description: 'Guess the daily equation in 6 tries. A new math puzzle every day!',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Numble',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#538D4E',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
