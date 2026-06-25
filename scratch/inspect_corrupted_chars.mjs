import fs from "fs";

const filePath = "components/admin/VisibilityOrderManager.tsx";
const content = fs.readFileSync(filePath, "utf8");

console.log("Analyzing U+FFFD (replacement characters) in VisibilityOrderManager.tsx:\n");
let count = 0;
for (let i = 0; i < content.length; i++) {
  if (content[i] === "\uFFFD") {
    count++;
    const start = Math.max(0, i - 15);
    const end = Math.min(content.length, i + 15);
    const slice = content.slice(start, end);
    const codes = [];
    for (let j = start; j < end; j++) {
      codes.push(content.charCodeAt(j).toString(16).toUpperCase().padStart(4, '0'));
    }
    console.log(`Match ${count} at index ${i}:`);
    console.log(`  Text:  ${slice.replace(/\n/g, ' ')}`);
    console.log(`  Codes: ${codes.join(" ")}`);
  }
}
