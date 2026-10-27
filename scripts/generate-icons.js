import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Function to generate a simple uncompressed PNG buffer
function createPng(width, height, drawFn) {
  // PNG signature
  const signature = Buffer.from([138, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8 bits per channel
  ihdr.writeUInt8(6, 9); // RGBA color type
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw image data with filter byte (0) per scanline
  const rowStride = width * 4;
  const rawData = Buffer.alloc((1 + rowStride) * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + rowStride);
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // Compress IDAT chunk
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 calculation for PNG chunks
function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcPayload = Buffer.concat([typeBuf, data]);
  const crc = crc32(crcPayload);

  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ table[(c ^ buf[i]) & 0xff];
  }
  return (c ^ 0xffffffff) >>> 0;
}

const table = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  table[n] = c;
}

// Medical App Icon Drawer
function drawMedicalIcon(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background gradient: Deep sky blue to dark navy
  const normY = y / h;
  let bgR = Math.round(2 * (1 - normY) + 7 * normY);
  let bgG = Math.round(132 * (1 - normY) + 89 * normY);
  let bgB = Math.round(199 * (1 - normY) + 133 * normY);

  // Rounded corner for regular icon, full bleed for maskable
  const cornerRadius = w * 0.22;
  if (!isMaskable) {
    // Check squircle bounds
    const rx = Math.abs(dx) - (w / 2 - cornerRadius);
    const ry = Math.abs(dy) - (h / 2 - cornerRadius);
    if (rx > 0 && ry > 0 && Math.sqrt(rx * rx + ry * ry) > cornerRadius) {
      return [0, 0, 0, 0]; // Transparent outside squircle
    }
  }

  // Medical Cross & Caduceus Symbol
  const crossW = w * 0.12;
  const crossLen = w * 0.40;
  const inVerticalCross = Math.abs(dx) <= crossW / 2 && Math.abs(dy) <= crossLen / 2;
  const inHorizontalCross = Math.abs(dy) <= crossW / 2 && Math.abs(dx) <= crossLen / 2;

  // Stethoscope ring accent
  const ringRadius = w * 0.32;
  const inRing = Math.abs(dist - ringRadius) < w * 0.025;

  if (inVerticalCross || inHorizontalCross) {
    // Bright cyan/emerald medical cross
    return [56, 189, 248, 255]; // #38bdf8
  }

  if (inRing) {
    return [240, 249, 255, 220]; // Translucent accent ring
  }

  // Inner central emblem circle
  if (dist < crossW * 0.8) {
    return [255, 255, 255, 255];
  }

  return [bgR, bgG, bgB, 255];
}

// Output directory
const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate icons
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), createPng(192, 192, (x, y, w, h) => drawMedicalIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), createPng(512, 512, (x, y, w, h) => drawMedicalIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), createPng(512, 512, (x, y, w, h) => drawMedicalIcon(x, y, w, h, true)));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPng(180, 180, (x, y, w, h) => drawMedicalIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(outDir, 'favicon.ico'), createPng(32, 32, (x, y, w, h) => drawMedicalIcon(x, y, w, h, false)));

console.log('✅ PWA PNG icons generated successfully in /public!');
