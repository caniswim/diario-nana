// Script simples para gerar ícones PWA placeholder
// Use este para gerar ícones temporários até você criar os ícones finais

const fs = require('fs');
const path = require('path');

// Criar um SVG simples que pode ser usado como ícone
const createSVGIcon = (size, text) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#5B8DEF"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold">
    ${text}
  </text>
</svg>`;

// Criar diretório public se não existir
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Gerar ícones SVG (navegadores convertem automaticamente)
const icon192 = createSVGIcon(192, 'D');
const icon512 = createSVGIcon(512, 'D');
const appleIcon = createSVGIcon(180, 'D');

// Salvar como SVG (navegadores modernos suportam)
fs.writeFileSync(path.join(publicDir, 'icon-192.svg'), icon192);
fs.writeFileSync(path.join(publicDir, 'icon-512.svg'), icon512);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), appleIcon);

console.log('✅ Ícones SVG gerados com sucesso!');
console.log('📁 Localização: public/');
console.log('📝 Substitua depois por ícones PNG reais usando:');
console.log('   - https://realfavicongenerator.net');
console.log('   - ou ferramentas como pwa-asset-generator');
