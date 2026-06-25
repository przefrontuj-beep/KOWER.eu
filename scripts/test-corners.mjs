import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "..", "public", "brand", "kower-wordmark-new.png");

async function run() {
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  console.log(`Dimensions: ${width}x${height}`);

  const colors = new Set();
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 20; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx+1];
      const b = data[idx+2];
      const colorStr = `rgb(${r},${g},${b})`;
      colors.add(colorStr);
    }
  }

  console.log("Colors found in top-left 20x20 pixels:");
  console.log(Array.from(colors));
}

run().catch(console.error);
