const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const brainDir = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\a64e04e4-4b84-46e3-8962-e58fab4f08ba';
const desktopDir = path.join(process.env.USERPROFILE, 'Desktop');
const publicDir = 'C:\\Users\\User\\Documents\\Sergio\\public';

// SVG que recria o emblema monograma exato 'SC' com o telhado e a tipografia sem 'IMOBILIÁRIA PREMIUM'
const svgExactBW = `<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#e4e4e7"/>
      <stop offset="100%" stop-color="#a1a1aa"/>
    </linearGradient>
    <filter id="glow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Fundo Preto Fosco Texturizado -->
  <rect width="800" height="800" fill="#09090b"/>
  <rect width="800" height="800" fill="#18181b" opacity="0.4"/>

  <g filter="url(#glow)">
    <!-- Monograma SC com Telhado -->
    <!-- S -->
    <path d="M 330 220 C 370 210, 420 225, 420 260 C 420 300, 340 315, 340 355 C 340 395, 420 410, 420 450 C 420 490, 360 500, 310 485 C 290 478, 275 465, 270 450 L 305 440 C 310 450, 325 462, 350 465 C 380 468, 385 450, 385 442 C 385 420, 310 405, 310 355 C 310 305, 385 290, 385 258 C 385 242, 365 240, 345 242 C 325 244, 315 255, 310 265 L 275 250 C 285 230, 305 222, 330 220 Z" fill="url(#silverGrad)"/>

    <!-- C Interligado -->
    <path d="M 520 250 C 500 230, 460 220, 410 220 C 320 220, 250 290, 250 375 C 250 460, 320 530, 410 530 C 465 530, 510 510, 530 480 L 495 455 C 480 475, 450 490, 410 490 C 345 490, 295 440, 295 375 C 295 310, 345 260, 410 260 C 445 260, 475 275, 490 295 L 520 250 Z" fill="url(#silverGrad)"/>

    <!-- Roof Line (Telhado com Chaminé) -->
    <path d="M 330 380 L 460 290 L 590 380 L 565 395 L 460 320 L 355 395 Z" fill="url(#silverGrad)"/>
    <path d="M 530 310 L 530 280 L 550 280 L 550 324 Z" fill="url(#silverGrad)"/>

    <!-- Typography: SÉRGIO COLUSSI -->
    <text x="400" y="600" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="44" font-weight="bold" fill="#ffffff" letter-spacing="3">SÉRGIO COLUSSI</text>

    <!-- Subtitle: CORRETOR DE IMÓVEIS (SEM IMOBILIÁRIA PREMIUM) -->
    <text x="400" y="645" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#e4e4e7" letter-spacing="4">CORRETOR DE IMÓVEIS</text>

    <!-- CRECI 92.920-F -->
    <text x="400" y="685" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#a1a1aa" letter-spacing="3">CRECI 92.920-F</text>

    <!-- Accent Line -->
    <line x1="330" y1="710" x2="470" y2="710" stroke="#ffffff" stroke-width="2" stroke-opacity="0.8"/>
  </g>
</svg>`;

// Design Transparente para usar como marca d'água em fotos de imóveis
const svgWatermarkTransparent = `<svg width="800" height="300" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
  <filter id="shadow">
    <feDropShadow dx="2" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.85"/>
  </filter>

  <g filter="url(#shadow)" fill="#ffffff">
    <!-- Emblem Left -->
    <path d="M 90 60 C 110 55, 135 62, 135 80 C 135 100, 95 107, 95 127 C 95 147, 135 155, 135 175 C 135 195, 105 200, 80 192 L 95 170 C 105 175, 115 178, 120 170 C 120 160, 80 152, 80 127 C 80 102, 120 95, 120 79 Z"/>
    <path d="M 175 75 C 165 65, 145 60, 120 60 C 75 60, 40 95, 40 137 C 40 180, 75 215, 120 215 C 150 215, 170 200, 180 185 L 160 170 C 150 182, 135 192, 120 192 C 90 192, 65 167, 65 137 C 65 107, 90 82, 120 82 C 140 82, 155 90, 162 100 Z"/>
    <path d="M 90 140 L 145 100 L 200 140 L 185 150 L 145 120 L 105 150 Z"/>

    <!-- Text Right -->
    <text x="230" y="115" font-family="'Times New Roman', Georgia, serif" font-size="38" font-weight="bold" fill="#ffffff" letter-spacing="2">SÉRGIO COLUSSI</text>
    <text x="230" y="150" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" letter-spacing="3">CORRETOR DE IMÓVEIS • CRECI 92.920-F</text>
    <text x="230" y="180" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#e4e4e7" letter-spacing="2">www.sergiocolussi.com.br</text>
  </g>
</svg>`;

const brainLogoPath = path.join(brainDir, 'logo_sergio_colussi_bw_final.png');
const brainWatermarkPath = path.join(brainDir, 'marca_dagua_oficial_bw.png');

const desktopLogoPath = path.join(desktopDir, 'Logo-Sergio-Colussi-Oficial-BW.png');
const desktopWatermarkPath = path.join(desktopDir, 'Marca-Dagua-Oficial-Sergio-Colussi.png');

const publicLogoPath = path.join(publicDir, 'logo-sergio-colussi-oficial-bw.png');
const publicWatermarkPath = path.join(publicDir, 'marca-dagua-oficial-sergio-colussi.png');

Promise.all([
  sharp(Buffer.from(svgExactBW)).png().toFile(brainLogoPath).then(() => {
    fs.copyFileSync(brainLogoPath, desktopLogoPath);
    fs.copyFileSync(brainLogoPath, publicLogoPath);
  }),
  sharp(Buffer.from(svgWatermarkTransparent)).png().toFile(brainWatermarkPath).then(() => {
    fs.copyFileSync(brainWatermarkPath, desktopWatermarkPath);
    fs.copyFileSync(brainWatermarkPath, publicWatermarkPath);
  }),
]).then(() => {
  console.log('EXACT_BW_LOGO_SUCCESS');
}).catch(err => console.error(err));
