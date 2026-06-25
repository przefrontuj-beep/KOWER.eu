import fs from "fs";

const totalLines = 1400;
const linesArray = new Array(totalLines + 1).fill(null);

const scratchFiles = fs.readdirSync("scratch");

scratchFiles.forEach(file => {
  if (file.startsWith("view_") && file.endsWith(".txt")) {
    const content = fs.readFileSync(`scratch/${file}`, "utf8");
    const lines = content.split(/\r?\n/);
    lines.forEach(line => {
      const match = line.match(/^\s*(\d+): (.*)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        const code = match[2];
        if (num >= 1 && num <= totalLines) {
          linesArray[num] = code;
        }
      }
    });
  }
});

console.log("Printing reconstructed lines 1030 to 1135:");
for (let i = 1030; i <= 1135; i++) {
  console.log(`${i}: ${linesArray[i]}`);
}
