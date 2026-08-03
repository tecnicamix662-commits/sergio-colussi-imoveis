const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const brainDir = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\a64e04e4-4b84-46e3-8962-e58fab4f08ba';
const desktopDir = path.join(process.env.USERPROFILE, 'Desktop');
const publicDir = 'C:\\Users\\User\\Documents\\Sergio\\public';

// Design 1: Tag de Canto Elegante Preto e Branco
const svgTag = `<svg width="520" height="140" viewBox="0 0 520 140" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="5" width="510" height="130" rx="20" fill="#000000" fill-opacity="0.82" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.5"/>
  
  <!-- Icon Emblem -->
  <rect x="25" y="25" width="90" height="90" rx="16" fill="#ffffff"/>
  <text x="70" y="82" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="36" font-weight="bold" fill="#000000">SC</text>
  
  <!-- Text -->
  <text x="135" y="60" font-family="'Times New Roman', Georgia, serif" font-size="24" font-weight="bold" fill="#ffffff" letter-spacing="1.5">SÉRGIO COLUSSI</text>
  <text x="135" y="85" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#e4e4e7" letter-spacing="2">CORRETOR DE IMÓVEIS • CRECI 92.920-F</text>
  <text x="135" y="106" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#a1a1aa" letter-spacing="1 font-mono">www.sergiocolussi.com.br</text>
</svg>`;

// Design 2: Barra Horizontal de Rodapé Preto e Branco
const svgBar = `<svg width="1200" height="100" viewBox="0 0 1200 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="1200" height="100" fill="#000000" fill-opacity="0.85"/>
  <line x1="0" y1="0" x2="1200" y2="0" stroke="#ffffff" stroke-width="2" stroke-opacity="0.8"/>
  
  <!-- Left Side: Monogram -->
  <rect x="30" y="20" width="60" height="60" rx="12" fill="#ffffff"/>
  <text x="60" y="60" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="26" font-weight="bold" fill="#000000">SC</text>

  <!-- Title & CRECI -->
  <text x="110" y="48" font-family="'Times New Roman', Georgia, serif" font-size="22" font-weight="bold" fill="#ffffff" letter-spacing="2">SÉRGIO COLUSSI <tspan fill="#a1a1aa">IMÓVEIS</tspan></text>
  <text x="110" y="72" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#d4d4d8" letter-spacing="3">EXCLUSIVIDADE • TRANSPARÊNCIA • CRECI 92.920-F</text>

  <!-- Right Side: Website -->
  <text x="1170" y="58" text-anchor="end" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" letter-spacing="2">www.sergiocolussi.com.br</text>
</svg>`;

// Design 3: Marca d'Água 100% Transparente (Apenas Texto e Logo em Branco Puro para Sobreposição)
const svgClean = `<svg width="600" height="120" viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg">
  <filter id="shadow">
    <feDropShadow dx="1" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.9"/>
  </filter>

  <g filter="url(#shadow)">
    <!-- Icon Emblem -->
    <rect x="10" y="15" width="90" height="90" rx="18" fill="#ffffff"/>
    <text x="55" y="72" text-anchor="middle" font-family="'Times New Roman', Georgia, serif" font-size="38" font-weight="bold" fill="#000000">SC</text>
    
    <!-- Text -->
    <text x="120" y="56" font-family="'Times New Roman', Georgia, serif" font-size="26" font-weight="bold" fill="#ffffff" letter-spacing="2">SÉRGIO COLUSSI</text>
    <text x="120" y="82" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#ffffff" letter-spacing="2.5">CORRETOR DE IMÓVEIS • CRECI 92.920-F</text>
    <text x="120" y="102" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#e4e4e7" letter-spacing="1.5">www.sergiocolussi.com.br</text>
  </g>
</svg>`;

const tagBrain = path.join(brainDir, 'marca_dagua_tag_bw.png');
const barBrain = path.join(brainDir, 'marca_dagua_barra_bw.png');
const cleanBrain = path.join(brainDir, 'marca_dagua_transparente_bw.png');

const tagDesktop = path.join(desktopDir, 'MARCA_DAGUA_TAG_BW.png');
const barDesktop = path.join(desktopDir, 'MARCA_DAGUA_BARRA_BW.png');
const cleanDesktop = path.join(desktopDir, 'MARCA_DAGUA_TRANSPARENTE_BW.png');

const tagPublic = path.join(publicDir, 'marca-dagua-tag-bw.png');
const barPublic = path.join(publicDir, 'marca-dagua-barra-bw.png');
const cleanPublic = path.join(publicDir, 'marca-dagua-transparente-bw.png');

Promise.all([
  sharp(Buffer.from(svgTag)).png().toFile(tagBrain).then(() => {
    fs.copyFileSync(tagBrain, tagDesktop);
    fs.copyFileSync(tagBrain, tagPublic);
  }),
  sharp(Buffer.from(svgBar)).png().toFile(barBrain).then(() => {
    fs.copyFileSync(barBrain, barDesktop);
    fs.copyFileSync(barBrain, barPublic);
  }),
  sharp(Buffer.from(svgClean)).png().toFile(cleanBrain).then(() => {
    fs.copyFileSync(cleanBrain, cleanDesktop);
    fs.copyFileSync(cleanBrain, cleanPublic);
  }),
]).then(() => {
  console.log('BW_WATERMARKS_SUCCESS');
}).catch(err => console.error(err));
