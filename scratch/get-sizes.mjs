import fs from 'fs';
import path from 'path';

function getJpegSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer[0] !== 0xFF || buffer[1] !== 0xD8) {
    throw new Error('Not a JPEG file');
  }
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xFF) {
      offset++;
      continue;
    }
    const marker = buffer[offset + 1];
    if (marker === 0xD9 || marker === 0xDA) {
      break;
    }
    const length = buffer.readUInt16BE(offset + 2);
    if (marker === 0xC0 || marker === 0xC2) {
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return { width, height };
    }
    offset += 2 + length;
  }
  throw new Error('SOF marker not found');
}

const dir = "C:\\Users\\damia\\OneDrive\\Pulpit\\KOWER_GALERIA";
const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.jpg'));

for (const file of files) {
  try {
    const size = getJpegSize(path.join(dir, file));
    console.log(`${file}: ${size.width}x${size.height}`);
  } catch (e) {
    console.error(`Error parsing ${file}:`, e.message);
  }
}
