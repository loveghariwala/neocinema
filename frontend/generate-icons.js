const sharp = require('sharp');
const path = require('path');

const PUBLIC = path.join(__dirname, 'public');
const LOGO = path.join(PUBLIC, 'logo.png');

async function run() {
    // The source logo has a fake checkerboard (baked-in, not real alpha).
    // Strategy: Extract ONLY the circular icon part (the "N" emblem) which is centered.
    // The logo is 3004x1408. The circle is roughly in the center.
    
    const meta = await sharp(LOGO).metadata();
    const circleSize = meta.height; // 1408 - the circle roughly fits the height
    const left = Math.floor((meta.width - circleSize) / 2);
    
    // Extract the center square containing the icon
    const iconSquare = await sharp(LOGO)
        .extract({ left: left, top: 0, width: circleSize, height: circleSize })
        .toBuffer();

    // For OG banner: place the icon on a pure black 1200x630 canvas
    const iconForBanner = await sharp(iconSquare)
        .resize(500, 500, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer();

    // We need to mask out the checkerboard. Since the checkerboard is light grey/white
    // and the icon is dark with fire colors, we can threshold: 
    // Any pixel where R>200 AND G>200 AND B>200 => make it black
    const raw = await sharp(iconSquare)
        .resize(500, 500, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 255 } })
        .ensureAlpha()
        .raw()
        .toBuffer();
    
    const iconMeta = await sharp(iconSquare).resize(500, 500, { fit: 'contain' }).metadata();
    const w = 500, h = 500;
    
    // Process pixels: replace light grey checkerboard with black
    const cleaned = Buffer.from(raw);
    for (let i = 0; i < cleaned.length; i += 4) {
        const r = cleaned[i], g = cleaned[i+1], b = cleaned[i+2];
        // If pixel is light (part of checkerboard), make it black
        if (r > 180 && g > 180 && b > 180) {
            cleaned[i] = 0;
            cleaned[i+1] = 0;
            cleaned[i+2] = 0;
            cleaned[i+3] = 255;
        }
        // Also handle the medium-grey checkerboard squares
        if (r > 150 && g > 150 && b > 150 && Math.abs(r - g) < 10 && Math.abs(g - b) < 10) {
            cleaned[i] = 0;
            cleaned[i+1] = 0;
            cleaned[i+2] = 0;
            cleaned[i+3] = 255;
        }
    }
    
    const cleanedIcon = await sharp(cleaned, { raw: { width: w, height: h, channels: 4 } })
        .png()
        .toBuffer();

    // OG Banner
    await sharp({
        create: { width: 1200, height: 630, channels: 3, background: { r: 0, g: 0, b: 0 } }
    })
        .composite([{
            input: cleanedIcon,
            left: Math.floor((1200 - w) / 2),
            top: Math.floor((630 - h) / 2),
        }])
        .jpeg({ quality: 92 })
        .toFile(path.join(PUBLIC, 'og_banner.jpg'));
    console.log('✅ og_banner.jpg created (clean black background)');

    // Also regenerate icon.png and apple-icon.png with clean background
    // icon.png 192x192
    const iconRaw192 = await sharp(iconSquare)
        .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 255 } })
        .ensureAlpha()
        .raw()
        .toBuffer();
    
    const cleaned192 = Buffer.from(iconRaw192);
    for (let i = 0; i < cleaned192.length; i += 4) {
        const r = cleaned192[i], g = cleaned192[i+1], b = cleaned192[i+2];
        if (r > 150 && g > 150 && b > 150 && Math.abs(r - g) < 10 && Math.abs(g - b) < 10) {
            cleaned192[i] = 0; cleaned192[i+1] = 0; cleaned192[i+2] = 0; cleaned192[i+3] = 255;
        }
    }
    await sharp(cleaned192, { raw: { width: 192, height: 192, channels: 4 } })
        .png()
        .toFile(path.join(PUBLIC, 'icon.png'));
    console.log('✅ icon.png (192x192) recreated with clean background');

    // apple-icon.png 512x512
    const iconRaw512 = await sharp(iconSquare)
        .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 255 } })
        .ensureAlpha()
        .raw()
        .toBuffer();
    
    const cleaned512 = Buffer.from(iconRaw512);
    for (let i = 0; i < cleaned512.length; i += 4) {
        const r = cleaned512[i], g = cleaned512[i+1], b = cleaned512[i+2];
        if (r > 150 && g > 150 && b > 150 && Math.abs(r - g) < 10 && Math.abs(g - b) < 10) {
            cleaned512[i] = 0; cleaned512[i+1] = 0; cleaned512[i+2] = 0; cleaned512[i+3] = 255;
        }
    }
    await sharp(cleaned512, { raw: { width: 512, height: 512, channels: 4 } })
        .flatten({ background: { r: 0, g: 0, b: 0 } })
        .png()
        .toFile(path.join(PUBLIC, 'apple-icon.png'));
    console.log('✅ apple-icon.png (512x512) recreated with clean background');

    // favicon.ico 48x48
    const iconRaw48 = await sharp(iconSquare)
        .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 255 } })
        .ensureAlpha()
        .raw()
        .toBuffer();
    
    const cleaned48 = Buffer.from(iconRaw48);
    for (let i = 0; i < cleaned48.length; i += 4) {
        const r = cleaned48[i], g = cleaned48[i+1], b = cleaned48[i+2];
        if (r > 150 && g > 150 && b > 150 && Math.abs(r - g) < 10 && Math.abs(g - b) < 10) {
            cleaned48[i] = 0; cleaned48[i+1] = 0; cleaned48[i+2] = 0; cleaned48[i+3] = 255;
        }
    }
    const favicon48 = await sharp(cleaned48, { raw: { width: 48, height: 48, channels: 4 } })
        .png()
        .toBuffer();

    // ICO format
    const fs = require('fs');
    const icoHeader = Buffer.alloc(6);
    icoHeader.writeUInt16LE(0, 0);
    icoHeader.writeUInt16LE(1, 2);
    icoHeader.writeUInt16LE(1, 4);
    const icoEntry = Buffer.alloc(16);
    icoEntry.writeUInt8(48, 0);
    icoEntry.writeUInt8(48, 1);
    icoEntry.writeUInt8(0, 2);
    icoEntry.writeUInt8(0, 3);
    icoEntry.writeUInt16LE(1, 4);
    icoEntry.writeUInt16LE(32, 6);
    icoEntry.writeUInt32LE(favicon48.length, 8);
    icoEntry.writeUInt32LE(22, 12);
    fs.writeFileSync(path.join(PUBLIC, 'favicon.ico'), Buffer.concat([icoHeader, icoEntry, favicon48]));
    console.log('✅ favicon.ico (48x48) recreated with clean background');

    console.log('\n🎉 All icons regenerated with checkerboard removed!');
}

run().catch(err => { console.error(err); process.exit(1); });
