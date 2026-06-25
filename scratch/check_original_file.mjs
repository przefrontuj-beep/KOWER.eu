import fs from "fs";

const content = fs.readFileSync("components/admin/VisibilityOrderManager.tsx.original", "utf8");
const lines = content.split(/\r?\n/);
console.log(`Total lines in original file: ${lines.length}`);
console.log("Last 20 lines:");
lines.slice(-20).forEach((l, idx) => {
  console.log(`${lines.length - 20 + idx + 1}: ${l}`);
});
