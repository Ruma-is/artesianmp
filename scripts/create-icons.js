const sharp = require('sharp');
const path = require('path');

async function createIcon(size) {
  const svgIcon = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background with rounded corners -->
      <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="#926829"/>
      
      <!-- Center circle -->
      <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.35}" fill="#faf8f5"/>
      
      <!-- Handshake symbol -->
      <g stroke="#926829" stroke-width="${size * 0.04}" fill="none" stroke-linecap="round">
        <!-- Left hand -->
        <path d="M ${size * 0.35} ${size * 0.5} L ${size * 0.45} ${size * 0.42}"/>
        
        <!-- Right hand -->
        <path d="M ${size * 0.65} ${size * 0.5} L ${size * 0.55} ${size * 0.42}"/>
        
        <!-- Connecting arc -->
        <path d="M ${size * 0.45} ${size * 0.42} Q ${size * 0.5} ${size * 0.38} ${size * 0.55} ${size * 0.42}"/>
      </g>
      
      <!-- "RC" text -->
      <text 
        x="${size / 2}" 
        y="${size * 0.58}" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.15}" 
        font-weight="bold" 
        fill="#926829" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >RC</text>
      
      <!-- Bottom text -->
      <text 
        x="${size / 2}" 
        y="${size * 0.85}" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.06}" 
        fill="#faf8f5" 
        text-anchor="middle"
      >Rural Connection</text>
    </svg>
  `;

  const outputPath = path.join(__dirname, '../public', `icon-${size}x${size}.png`);
  
  await sharp(Buffer.from(svgIcon))
    .png()
    .toFile(outputPath);
  
  console.log(`✅ Created icon-${size}x${size}.png`);
}

async function createScreenshots() {
  // Mobile screenshot placeholder (390x844)
  const mobileSvg = `
    <svg width="390" height="844" xmlns="http://www.w3.org/2000/svg">
      <rect width="390" height="844" fill="#faf8f5"/>
      <rect width="390" height="60" fill="#926829"/>
      <text x="195" y="35" font-family="Arial" font-size="24" fill="#faf8f5" text-anchor="middle" font-weight="bold">Rural Connection</text>
      <text x="195" y="422" font-family="Arial" font-size="18" fill="#926829" text-anchor="middle">📱 Mobile View</text>
      <text x="195" y="460" font-family="Arial" font-size="14" fill="#666" text-anchor="middle">Connecting Rural Artisans</text>
    </svg>
  `;
  
  await sharp(Buffer.from(mobileSvg))
    .png()
    .toFile(path.join(__dirname, '../public/screenshot-mobile.png'));
  
  console.log('✅ Created screenshot-mobile.png (390x844)');

  // Desktop screenshot placeholder (1920x1080)
  const desktopSvg = `
    <svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
      <rect width="1920" height="1080" fill="#faf8f5"/>
      <rect width="1920" height="80" fill="#926829"/>
      <text x="960" y="50" font-family="Arial" font-size="32" fill="#faf8f5" text-anchor="middle" font-weight="bold">Rural Connection - Empowering Rural Artisans</text>
      <text x="960" y="540" font-family="Arial" font-size="24" fill="#926829" text-anchor="middle">🖥️ Desktop View</text>
      <text x="960" y="590" font-family="Arial" font-size="18" fill="#666" text-anchor="middle">Discover authentic handcrafted products from rural artisans</text>
    </svg>
  `;
  
  await sharp(Buffer.from(desktopSvg))
    .png()
    .toFile(path.join(__dirname, '../public/screenshot-desktop.png'));
  
  console.log('✅ Created screenshot-desktop.png (1920x1080)');
}

async function main() {
  console.log('🎨 Generating PWA icons and screenshots...\n');
  
  try {
    await createIcon(192);
    await createIcon(512);
    await createScreenshots();
    
    console.log('\n🎉 All PWA assets created successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. git add public/*.png');
    console.log('2. git commit -m "Add proper PWA icons and screenshots"');
    console.log('3. git push origin main');
    console.log('\n✨ After deployment, your PWA will be installable!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
