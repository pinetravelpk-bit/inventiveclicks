// Regenerates brand images from public/brand/ic-logo-source.png and the theme artwork:
// header logo, favicons, schema logo (public/logo.png) and app/opengraph-image.jpg.
// Run: node scripts/make-share-images.mjs
import sharp from 'sharp';

const src = 'public/brand/ic-logo-source.png';
const mark = await sharp(src).trim({ threshold: 20 }).toBuffer();
await sharp(mark).resize({ height: 132 }).png({ compressionLevel: 9 }).toFile('public/brand/ic-logo.png');
const square = (size, pad, background = { r: 0, g: 0, b: 0, alpha: 0 }) => sharp(mark).resize(size - pad * 2, size - pad * 2, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).extend({ top: pad, bottom: pad, left: pad, right: pad, background }).png({ compressionLevel: 9, palette: size >= 180, quality: 90 });
await square(512, 40).toFile('public/logo.png');
await square(48, 2).toFile('public/favicon-48.png');
await square(32, 1).toFile('public/favicon-32.png');
await square(180, 18, { r: 5, g: 9, b: 18, alpha: 1 }).toFile('public/apple-touch-icon.png');
await square(192, 12, { r: 5, g: 9, b: 18, alpha: 1 }).toFile('public/icon-192.png');

const W = 1200, H = 630;
const hero = await sharp('public/images/hero-hd.webp').resize(W, H, { fit: 'cover', position: 'right' }).toBuffer();
const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="fade" x2="1"><stop offset="0" stop-color="#050912" stop-opacity=".96"/><stop offset=".55" stop-color="#050912" stop-opacity=".7"/><stop offset="1" stop-color="#050912" stop-opacity="0"/></linearGradient>
    <linearGradient id="brand" x2="1"><stop stop-color="#8b5cf6"/><stop offset="1" stop-color="#ec4899"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fade)"/>
  <g font-family="Segoe UI, Arial, sans-serif" fill="#f4f6ff">
    <text x="72" y="118" font-size="34" font-weight="700">Inventive Clicks</text>
    <text x="72" y="152" font-size="18" fill="#aab3c9">Ideas. Strategy. Real Results.</text>
    <text x="72" y="300" font-size="76" font-weight="800">Bold Ideas.</text>
    <text x="72" y="390" font-size="76" font-weight="800"><tspan fill="url(#brand)" font-style="italic">Brighter</tspan> Results.</text>
    <text x="72" y="468" font-size="26" fill="#c9d1e6">Digital marketing · SEO · PPC · Web development · Branding</text>
    <text x="72" y="560" font-size="22" font-weight="600" fill="#8fd8ff">inventiveclicks.com</text>
  </g>
</svg>`);
const favMark = await sharp(mark).resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
await sharp(hero)
  .composite([{ input: overlay }, { input: favMark, left: 1066, top: 52 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile('app/opengraph-image.jpg');
console.log('Wrote public/logo.png and app/opengraph-image.jpg');
