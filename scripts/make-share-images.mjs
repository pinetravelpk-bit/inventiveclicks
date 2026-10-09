// Regenerates public/logo.png (schema logo) and app/opengraph-image.jpg
// (social / AI preview card) from the theme artwork. Run: node scripts/make-share-images.mjs
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const favicon = await readFile('public/favicon.svg');
await sharp(favicon, { density: 600 }).resize(512, 512).png().toFile('public/logo.png');

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
const favMark = await sharp(favicon, { density: 300 }).resize(64, 64).png().toBuffer();
await sharp(hero)
  .composite([{ input: overlay }, { input: favMark, left: 1066, top: 52 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile('app/opengraph-image.jpg');
console.log('Wrote public/logo.png and app/opengraph-image.jpg');
