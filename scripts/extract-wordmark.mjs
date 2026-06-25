// One-shot script to create a transparent-background KOWER wordmark
// from the dark-stone reference PNG.
//
// Strategy: flood-fill from all 4 edges with a color-distance tolerance.
// The flood reaches every pixel of the dark stone backdrop because the
// backdrop is connected to the image borders, while the letter interiors
// (which are also dark) stay opaque because they are spatially enclosed
// by the metallic bevels of the letters.
//
// Output: /public/brand/kower-hero-wordmark.png (RGBA, transparent bg)

import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "..", "public", "brand", "kower-3d-hero.png");
const OUT = path.resolve(__dirname, "..", "public", "brand", "kower-hero-wordmark.png");

// Tolerances tuned for this specific render.
//   FILL_TOLERANCE  – flood neighbour accepted if RGB distance to seed <= this
//   EDGE_FEATHER    – pixels within this distance of the boundary get partial alpha
const FILL_TOLERANCE = 56;
const EDGE_FEATHER = 18;

async function run() {
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info; // channels === 4
  if (channels !== 4) throw new Error(`Expected 4 channels, got ${channels}`);

  const total = width * height;
  // 0 = unvisited, 1 = background (will become transparent),
  // 2 = kept (foreground / inside letter)
  const mask = new Uint8Array(total);

  // Seed colour: average of the four corners (the stone backdrop)
  const idx = (x, y) => (y * width + x) * 4;
  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  let sr = 0, sg = 0, sb = 0;
  for (const [cx, cy] of corners) {
    const i = idx(cx, cy);
    sr += data[i]; sg += data[i + 1]; sb += data[i + 2];
  }
  sr = sr / corners.length;
  sg = sg / corners.length;
  sb = sb / corners.length;

  // BFS flood fill from every border pixel.
  // Use a Uint32Array stack, encoding y * width + x, with manual top pointer.
  const stack = new Uint32Array(total);
  let top = 0;

  const tryPush = (x, y) => {
    const p = y * width + x;
    if (mask[p] !== 0) return;
    const i = p * 4;
    const dr = data[i] - sr;
    const dg = data[i + 1] - sg;
    const db = data[i + 2] - sb;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    if (dist <= FILL_TOLERANCE) {
      mask[p] = 1;
      stack[top++] = p;
    } else {
      mask[p] = 2; // foreground
    }
  };

  // Seed border
  for (let x = 0; x < width; x++) {
    tryPush(x, 0);
    tryPush(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    tryPush(0, y);
    tryPush(width - 1, y);
  }

  while (top > 0) {
    const p = stack[--top];
    const x = p % width;
    const y = (p - x) / width;
    if (x > 0)         tryPush(x - 1, y);
    if (x < width - 1) tryPush(x + 1, y);
    if (y > 0)         tryPush(x, y - 1);
    if (y < height - 1)tryPush(x, y + 1);
  }

  // Build alpha buffer from mask, with simple edge feathering on the
  // foreground/background boundary so the cut isn't stair-stepped.
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
        // Background → fully transparent
        out[i + 3] = 0;
      } else {
        // Foreground → look around for nearest background pixel for feather
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
          // Linear feather
          const a = Math.round((nearest / featherRadius) * 255);
          out[i + 3] = a;
        } else {
          out[i + 3] = 255;
        }
      }
    }
  }

  // Trim transparent borders so the wordmark fits its bounding box and
  // can be placed cleanly inside the hero without dead space.
  const baseImage = sharp(out, {
    raw: { width, height, channels: 4 },
  });

  await baseImage
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(OUT);

  const finalMeta = await sharp(OUT).metadata();
  console.log(`Wrote ${OUT}`);
  console.log(`Final size: ${finalMeta.width}x${finalMeta.height}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
