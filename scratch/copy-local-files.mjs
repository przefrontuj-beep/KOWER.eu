import fs from 'fs';
import path from 'path';

const srcDir = "C:\\Users\\damia\\OneDrive\\Pulpit\\KOWER_GALERIA";
const destDir = "c:\\KOWER2\\public\\realizacje";

try {
  console.log("Clearing destination folder...");
  if (fs.existsSync(destDir)) {
    const existingFiles = fs.readdirSync(destDir);
    for (const file of existingFiles) {
      const filePath = path.join(destDir, file);
      fs.unlinkSync(filePath);
      console.log(`Deleted old file: ${file}`);
    }
  } else {
    fs.mkdirSync(destDir, { recursive: true });
  }

  console.log("\nCopying new files...");
  const newFiles = fs.readdirSync(srcDir).filter(f => f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.jpg'));
  
  // Sort files by name so they get consistent numbering
  newFiles.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  newFiles.forEach((file, index) => {
    const srcPath = path.join(srcDir, file);
    const paddedIndex = String(index + 1).padStart(2, '0');
    const destPath = path.join(destDir, `realizacja-${paddedIndex}.jpeg`);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${file} -> realizacja-${paddedIndex}.jpeg`);
  });

  console.log("\nSuccess!");
} catch (e) {
  console.error("Error:", e);
}
