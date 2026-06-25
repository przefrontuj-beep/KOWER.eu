import fs from "fs";
import readline from "readline";

async function run() {
  const filePath = "C:\\Users\\damia\\.gemini\\antigravity\\brain\\3ac03115-f443-41ef-91d0-40ccaf07a741\\.system_generated\\logs\\transcript_full.jsonl";
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    if (line.includes("VisibilityOrderManager.tsx")) {
      try {
        const data = JSON.parse(line);
        console.log(`\n--- Match at line ${lineCount} ---`);
        console.log(`Type: ${data.type || "unknown"}, Source: ${data.source || "unknown"}, Index: ${data.step_index}`);
        
        // Check if there are tool calls in this line
        if (data.tool_calls) {
          data.tool_calls.forEach((tc, idx) => {
            if (tc.name === "default_api:write_to_file" || tc.name === "default_api:replace_file_content") {
              const target = tc.args.TargetFile || tc.args.TargetFile;
              if (target && target.includes("VisibilityOrderManager.tsx")) {
                console.log(`  Tool call ${idx}: ${tc.name}`);
                console.log(`  Arg description: ${tc.args.Description || "none"}`);
                console.log(`  Content length: ${tc.args.CodeContent?.length || tc.args.ReplacementContent?.length || 0}`);
              }
            }
          });
        }
      } catch (err) {
        // Not JSON
      }
    }
  }
  console.log("\nFinished scanning transcript.");
}

run();
