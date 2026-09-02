const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processLogo() {
  const inputPath = path.join(__dirname, '../src/assets/jadeer-logo.png');
  const inputBuffer = fs.readFileSync(inputPath);
  const img = sharp(inputBuffer);
  const metadata = await img.metadata();
  console.log(`Original image: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

  // Get raw RGBA buffer
  const { data, info } = await img
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;

  // Make white background transparent
  const transparentBuffer = Buffer.from(data);
  for (let i = 0; i < transparentBuffer.length; i += 4) {
    const r = transparentBuffer[i];
    const g = transparentBuffer[i + 1];
    const b = transparentBuffer[i + 2];
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;

    if (luma > 230) {
      transparentBuffer[i + 3] = 0; // Transparent
    } else if (luma > 160) {
      // Soft anti-aliased edge
      transparentBuffer[i + 3] = Math.round(255 * (1 - (luma - 160) / 70));
      // Tint to deep charcoal navy #172132
      transparentBuffer[i] = 23;
      transparentBuffer[i + 1] = 33;
      transparentBuffer[i + 2] = 50;
    } else {
      transparentBuffer[i + 3] = 255;
      // Tint to deep charcoal navy #172132
      transparentBuffer[i] = 23;
      transparentBuffer[i + 1] = 33;
      transparentBuffer[i + 2] = 50;
    }
  }

  // Save transparent full logo
  const outputFull = path.join(__dirname, '../public/images/jadeer-logo-full.png');
  fs.mkdirSync(path.dirname(outputFull), { recursive: true });
  await sharp(transparentBuffer, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outputFull);
  console.log(`Saved transparent full logo to ${outputFull}`);

  // Copy to public/Jadeer-logo.png
  const publicLogo = path.join(__dirname, '../public/Jadeer-logo.png');
  await sharp(transparentBuffer, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(publicLogo);
  console.log(`Saved transparent logo to ${publicLogo}`);

  // Segment into 5 exact structural pieces:
  // 1. Piece Left Pillar (X < 415)
  const leftPillarBuf = Buffer.from(transparentBuffer);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const isLeftPillar = x < 415 && !(y > 450 && x > 275);
      if (!isLeftPillar) {
        leftPillarBuf[idx + 3] = 0;
      }
    }
  }
  await sharp(leftPillarBuf, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(path.join(__dirname, '../public/images/jadeer-part-left-pillar.png'));

  // 2. Piece Right Pillar (X > 609)
  const rightPillarBuf = Buffer.from(transparentBuffer);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const isRightPillar = x > 609 && !(y > 450 && x < 749);
      if (!isRightPillar) {
        rightPillarBuf[idx + 3] = 0;
      }
    }
  }
  await sharp(rightPillarBuf, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(path.join(__dirname, '../public/images/jadeer-part-right-pillar.png'));

  // 3. Piece Left Lower Ramp (Between X 275 and 512, Y > 430)
  const leftRampBuf = Buffer.from(transparentBuffer);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const isLeftRamp = x >= 275 && x <= 512 && y >= 430;
      if (!isLeftRamp) {
        leftRampBuf[idx + 3] = 0;
      }
    }
  }
  await sharp(leftRampBuf, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(path.join(__dirname, '../public/images/jadeer-part-left-ramp.png'));

  // 4. Piece Right Lower Ramp (Between X 512 and 749, Y > 430)
  const rightRampBuf = Buffer.from(transparentBuffer);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const isRightRamp = x >= 512 && x <= 749 && y >= 430;
      if (!isRightRamp) {
        rightRampBuf[idx + 3] = 0;
      }
    }
  }
  await sharp(rightRampBuf, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(path.join(__dirname, '../public/images/jadeer-part-right-ramp.png'));

  // 5. Piece Center Mark (Central dots and facing hooks: X between 415 and 609, Y between 180 and 430)
  const centerMarkBuf = Buffer.from(transparentBuffer);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const isCenterMark = x >= 415 && x <= 609 && y >= 180 && y <= 430;
      if (!isCenterMark) {
        centerMarkBuf[idx + 3] = 0;
      }
    }
  }
  await sharp(centerMarkBuf, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(path.join(__dirname, '../public/images/jadeer-part-center-mark.png'));

  console.log('Successfully generated all 5 exact transparent Jadeer logo parts!');
}

processLogo().catch(console.error);
