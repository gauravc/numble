const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create a simple icon programmatically
const svgBuffer = Buffer.from(`
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#538D4E" rx="64"/>
  <text x="256" y="340" font-family="system-ui, -apple-system, sans-serif" font-size="280" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">N</text>
</svg>
`);

const publicDir = path.join(__dirname, '..', 'public');

async function generateIcons() {
  // Generate 192x192 icon
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  console.log('✓ Generated icon-192.png');

  // Generate 512x512 icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  console.log('✓ Generated icon-512.png');

  // Generate apple-touch-icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('✓ Generated apple-touch-icon.png');

  // Generate favicon
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  console.log('✓ Generated favicon.png');
}

generateIcons().catch(console.error);
