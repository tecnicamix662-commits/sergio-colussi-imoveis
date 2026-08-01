const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Design 1: Modern Corner Tag Badge (Imobiliária de Alto Padrão)
const svgTag = `<svg width="500" height="130" viewBox="0 0 500 130" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="5" width="490" height="120" rx="20" fill="#0f172a" fill-opacity="0.88" stroke="#d97706" stroke-width="1.5" stroke-opacity="0.6"/>
  
  <!-- Icon Emblem -->
  <rect x="25" y="25" width="80" height="80" rx="14" fill="url(#goldGrad)"/>
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
  </defs>
  <text x="65" y="77" text-anchor="middle" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="#0f172a">SC</text>
  
  <!-- Text -->
  <text x="125" y="58" font-family="'Times New Roman', Georgia, serif" font-size="24" font-weight="bold" fill="#ffffff" letter-spacing="1">SÉRGIO COLUSSI</text>
  <text x="125" y="82" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#fbbf24" letter-spacing="2">CORRETOR DE IMÓVEIS • CRECI 92.920-F</text>
  <text x="125" y="102" font-family="Arial, sans-serif" font-size="12" font-weight="normal" fill="#94a3b8" letter-spacing="1">www.sergiocolussi.com.br</text>
</svg>`;

// Design 2: Modern Full Horizontal Footer Bar
const svgBar = `<svg width="1200" height="100" viewBox="0 0 1200 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="1200" height="100" fill="#0a0f1d" fill-opacity="0.85"/>
  <line x1="0" y1="0" x2="1200" y2="0" stroke="#d97706" stroke-width="2"/>
  
  <!-- Left Side: Monogram -->
  <rect x="30" y="20" width="60" height="60" rx="12" fill="#d97706"/>
  <text x="60" y="60" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-weight="bold" fill="#ffffff">SC</text>

  <!-- Title & CRECI -->
  <text x="110" y="48" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="#ffffff" letter-spacing="2">SÉRGIO COLUSSI <tspan fill="#fbbf24">IMÓVEIS</tspan></text>
  <text x="110" y="72" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#94a3b8" letter-spacing="3">EXCLUSIVIDADE • TRANSPARÊNCIA • CRECI 92.920-F</text>

  <!-- Right Side: Website -->
  <text x="1170" y="58" text-anchor="end" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" letter-spacing="2">www.sergiocolussi.com.br</text>
</svg>`;

const brainTagPath = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\18ab3310-5b2b-4ea7-a288-1d08a888daef\\marca_dagua_imobiliaria_moderna_tag.png';
const brainBarPath = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\18ab3310-5b2b-4ea7-a288-1d08a888daef\\marca_dagua_imobiliaria_moderna_barra.png';

const desktopTagPath = path.join(process.env.USERPROFILE, 'Desktop', 'MARCA_DAGUA_MODERNA_TAG.png');
const desktopBarPath = path.join(process.env.USERPROFILE, 'Desktop', 'MARCA_DAGUA_MODERNA_BARRA.png');

Promise.all([
  sharp(Buffer.from(svgTag)).png().toFile(brainTagPath).then(() => fs.copyFileSync(brainTagPath, desktopTagPath)),
  sharp(Buffer.from(svgBar)).png().toFile(brainBarPath).then(() => fs.copyFileSync(brainBarPath, desktopBarPath)),
]).then(() => {
  console.log('MODERN_WATERMARKS_SUCCESS');
}).catch(err => console.error(err));
