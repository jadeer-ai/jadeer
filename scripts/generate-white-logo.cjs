const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function makeWhiteLogo() {
  const inputPath = path.join(__dirname, '../public/Logo.jpeg');
  const inputBuffer = fs.readFileSync(inputPath);
  const img = sharp(inputBuffer);
  const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

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
      // Bone White #F8F9FA
      transparentBuffer[i] = 248;
      transparentBuffer[i + 1] = 249;
      transparentBuffer[i + 2] = 250;
    } else {
      transparentBuffer[i + 3] = 255;
      // Bone White #F8F9FA
      transparentBuffer[i] = 248;
      transparentBuffer[i + 1] = 249;
      transparentBuffer[i + 2] = 250;
    }
  }

  const trimmed = await sharp(transparentBuffer, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 10 })
    .png()
    .toBuffer({ resolveWithObject: true });

  const outPath = path.join(__dirname, '../public/images/jadeer-logo-white.png');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, trimmed.data);
  console.log('Successfully saved Bone White logo to', outPath, 'size:', trimmed.info.width, 'x', trimmed.info.height);
}

makeWhiteLogo().catch(console.error);
