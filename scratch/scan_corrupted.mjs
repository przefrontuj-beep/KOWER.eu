import fs from "fs";
import path from "path";

const badChars = ["Ĺ", "Ă", "Ä", "Ã"];

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".git" && file !== ".next") {
        scanDir(fullPath);
      }
    } else {
      const ext = path.extname(file);
      if ([".ts", ".tsx", ".js", ".jsx", ".css", ".json", ".md"].includes(ext)) {
        const content = fs.readFileSync(fullPath, "utf8");
        for (const bad of badChars) {
          if (content.includes(bad)) {
            console.log(`Found corrupted character "${bad}" in: ${fullPath}`);
            // Let's find the lines
            const lines = content.split("\n");
            lines.forEach((line, idx) => {
              if (line.includes(bad)) {
                console.log(`  Line ${idx + 1}: ${line.trim()}`);
              }
            });
            break;
          }
        }
      }
    }
  }
}

console.log("Scanning admin code...");
scanDir("app/kower-admin-2026");
scanDir("components/admin");
console.log("Scan finished.");
