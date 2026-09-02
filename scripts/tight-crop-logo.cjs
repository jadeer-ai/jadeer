const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processUserLogo() {
  const inputPath = path.join(__dirname, '../public/Logo.jpeg');
  if (!fs.existsSync(inputPath)) {
    console.error('Logo.jpeg not found in public/');
    return;
  }
  const inputBuffer = fs.readFileSync(inputPath);
  
  const img = sharp(inputBuffer);
  const metadata = await img.metadata();
  console.log(`Processing Logo.jpeg: ${metadata.width}x${metadata.height}`);

  const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Make near-white background transparent with anti-aliasing
  const transparentBuffer = Buffer.from(data);
  for (let i = 0; i < transparentBuffer.length; i += 4) {
    const r = transparentBuffer[i];
    const g = transparentBuffer[i + 1];
    const b = transparentBuffer[i + 2];
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;

    if (luma > 230) {
      transparentBuffer[i + 3] = 0; // Transparent
    } else if (luma > 150) {
      transparentBuffer[i + 3] = Math.round(255 * (1 - (luma - 150) / 80));
      transparentBuffer[i] = 23;
      transparentBuffer[i + 1] = 33;
      transparentBuffer[i + 2] = 50;
    } else {
      transparentBuffer[i + 3] = 255;
      transparentBuffer[i] = 23;
      transparentBuffer[i + 1] = 33;
      transparentBuffer[i + 2] = 50;
    }
  }

  // Trim empty transparent edges to get tight bounding box
  const trimmed = await sharp(transparentBuffer, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 10 })
    .png()
    .toBuffer({ resolveWithObject: true });

  console.log(`Trimmed logo bounds: ${trimmed.info.width}x${trimmed.info.height}`);

  // Write to public/images/jadeer-logo-tight.png
  const tightPath = path.join(__dirname, '../public/images/jadeer-logo-tight.png');
  fs.mkdirSync(path.dirname(tightPath), { recursive: true });
  fs.writeFileSync(tightPath, trimmed.data);
  console.log(`Saved to ${tightPath}`);

  // Write to public/Jadeer-logo.png
  const publicLogoPath = path.join(__dirname, '../public/Jadeer-logo.png');
  fs.writeFileSync(publicLogoPath, trimmed.data);
  console.log(`Saved to ${publicLogoPath}`);

  // Write to src/assets/jadeer-logo.png
  const assetLogoPath = path.join(__dirname, '../src/assets/jadeer-logo.png');
  fs.writeFileSync(assetLogoPath, trimmed.data);
  console.log(`Saved to ${assetLogoPath}`);
}

processUserLogo().catch(console.error);
