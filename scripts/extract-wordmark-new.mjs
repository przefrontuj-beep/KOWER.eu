import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "..", "public", "brand", "kower-wordmark-new.png");
const OUT = path.resolve(__dirname, "..", "public", "brand", "kower-wordmark-new-cutout.png");

const BG_THRESHOLD = 220; 
const EDGE_FEATHER = 3;

async function run() {
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const total = width * height;
  
  // 0 = unvisited, 1 = background, 2 = foreground
  const mask = new Uint8Array(total);
  const visited = new Uint8Array(total);

  const isBgColor = (r, g, b) => r >= BG_THRESHOLD && g >= BG_THRESHOLD && b >= BG_THRESHOLD;

  console.log("Analyzing image components...");

  // BFS to extract a connected component of background-like pixels
  const getComponent = (startX, startY) => {
    const comp = [];
    const queue = new Uint32Array(total);
    let head = 0;
    let tail = 0;

    const push = (x, y) => {
      const p = y * width + x;
      if (visited[p]) return;
      visited[p] = 1;
      queue[tail++] = p;
    };

    push(startX, startY);

    while (head < tail) {
      const p = queue[head++];
      comp.push(p);
      const x = p % width;
      const y = (p - x) / width;

      const checkNeighbor = (nx, ny) => {
        const np = ny * width + nx;
        if (visited[np]) return;
        const ni = np * 4;
        if (isBgColor(data[ni], data[ni + 1], data[ni + 2])) {
          push(nx, ny);
        }
      };

      if (x > 0)         checkNeighbor(x - 1, y);
      if (x < width - 1) checkNeighbor(x + 1, y);
      if (y > 0)         checkNeighbor(x, y - 1);
      if (y < height - 1) checkNeighbor(x, y + 1);
    }

    return comp;
  };

  // Scan all pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      if (visited[p]) continue;

      const i = p * 4;
      if (isBgColor(data[i], data[i + 1], data[i + 2])) {
        const comp = getComponent(x, y);
        // Background components are large (e.g. outer background, hole of 'O', loop of 'R')
        // Highlight components inside letters are very small (e.g., lights, metallic glare)
        if (comp.length > 100) {
          for (const pixel of comp) {
            mask[pixel] = 1; // Mark as background
          }
        } else {
          for (const pixel of comp) {
            mask[pixel] = 2; // Mark as foreground (small reflection)
          }
        }
      } else {
        visited[p] = 1;
        mask[p] = 2; // Mark as foreground (dark pixel)
      }
    }
  }

  // Build the output buffer with transparency and edge feathering
  console.log("Applying transparency and feathering...");
  const out = Buffer.alloc(total * 4);
  const featherRadius = EDGE_FEATHER;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      const i = p * 4;
      out[i]     = data[i];
      out[i + 1] = data[i + 1];
      out[i + 2] = data[i + 2];

      if (mask[p] === 1) {
        out[i + 3] = 0; // Transparent
      } else {
        // Foreground - check distance to nearest background pixel for edge smoothing
        let nearest = featherRadius + 1;
        const x0 = Math.max(0, x - featherRadius);
        const x1 = Math.min(width - 1, x + featherRadius);
        const y0 = Math.max(0, y - featherRadius);
        const y1 = Math.min(height - 1, y + featherRadius);

        outer:
        for (let yy = y0; yy <= y1; yy++) {
          for (let xx = x0; xx <= x1; xx++) {
            if (mask[yy * width + xx] === 1) {
              const d = Math.max(Math.abs(xx - x), Math.abs(yy - y));
              if (d < nearest) {
                nearest = d;
                if (nearest === 1) break outer;
              }
            }
          }
        }

        if (nearest <= featherRadius) {
          const a = Math.round((nearest / featherRadius) * 255);
          out[i + 3] = a;
        } else {
          out[i + 3] = 255;
        }
      }
    }
  }

  // Save the trimmed image
  console.log("Trimming transparent margins and saving...");
  await sharp(out, { raw: { width, height, channels: 4 } })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(OUT);

  const finalMeta = await sharp(OUT).metadata();
  console.log(`Successfully wrote extracted wordmark to ${OUT}`);
  console.log(`Output dimensions: ${finalMeta.width}x${finalMeta.height}`);
}

run().catch(console.error);
