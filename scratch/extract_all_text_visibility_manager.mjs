import fs from "fs";
import readline from "readline";

async function run() {
  const filePath = "C:\\Users\\damia\\.gemini\\antigravity\\brain\\3ac03115-f443-41ef-91d0-40ccaf07a741\\.system_generated\\logs\\transcript_full.jsonl";
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let index = 0;
  for await (const line of rl) {
    index++;
    if (line.includes("VisibilityOrderManager.tsx")) {
      try {
        const data = JSON.parse(line);
        // Let's check where the content is
        if (data.content && data.content.includes("File Path:")) {
          console.log(`Match at line ${index}: type=${data.type}, content length=${data.content.length}`);
          fs.writeFileSync(`scratch/view_${index}.txt`, data.content, "utf8");
        }
      } catch (err) {
        // Not JSON
      }
    }
  }
}

run();
