const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(process.cwd(), 'src', 'lib', 'fonts');

export function registerAllFonts() {
  const fonts = [
    { file: 'Montserrat-Thin.ttf', weight: '100', alias: 'Montserrat-Thin' },
    { file: 'Montserrat-ExtraLight.ttf', weight: '200', alias: 'Montserrat-ExtraLight' },
    { file: 'Montserrat-Regular.ttf', weight: '400', alias: 'Montserrat-Regular' },
    { file: 'Montserrat-Bold.ttf', weight: '700', alias: 'Montserrat-Bold' },
  ];

  console.log('[testcanvas] fontsDir=', fontsDir);
  fonts.forEach(f => {
    const p = path.join(fontsDir, f.file);
    console.log('[testcanvas] checking', p, 'exists=', fs.existsSync(p));
    try {
      if (fs.existsSync(p)) {
        registerFont(p, { family: 'Montserrat', weight: f.weight });
        registerFont(p, { family: f.alias, weight: '400' });
        console.log('[testcanvas] registered', f.file);
      }
    } catch (err) {
      console.warn('[testcanvas] registerFont failed for', p, err && err);
    }
  });
}

export function makeTestImageBuffer() {
  // ensure fonts registered in this process
  registerAllFonts();

  const width = 1200, height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  const samples = [
    { label: 'Thin 100', font: `100 48px 'Montserrat'`, y: 120 },
    { label: 'ExtraLight 200', font: `200 48px 'Montserrat'`, y: 200 },
    { label: 'Regular 400', font: `400 48px 'Montserrat'`, y: 280 },
    { label: 'Bold 700', font: `700 48px 'Montserrat'`, y: 360 },
    { label: 'Fallback ExtraLight', font: `48px 'Montserrat-ExtraLight'`, y: 440 },
    { label: 'Fallback Bold', font: `48px 'Montserrat-Bold'`, y: 520 },
  ];

  ctx.fillStyle = '#111';
  ctx.textBaseline = 'middle';

  samples.forEach(s => {
    ctx.font = s.font;
    const text = `${s.label} — The quick brown fox jumps over the lazy dog 0123456789`;
    ctx.fillText(text, 60, s.y);
  });

  return canvas.toBuffer('image/png');
}
