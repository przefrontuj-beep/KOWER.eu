import fs from "fs";
import path from "path";
import readline from "readline";

const resolvedBrainDir = "C:\\Users\\damia\\.gemini\\antigravity\\brain";

async function scanTranscript(filePath, convId) {
  if (!fs.existsSync(filePath)) return null;
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
        if (data.tool_calls) {
          for (let i = 0; i < data.tool_calls.length; i++) {
            const tc = data.tool_calls[i];
            const target = tc.args?.TargetFile || tc.args?.AbsolutePath || "";
            if (target.includes("VisibilityOrderManager.tsx")) {
              console.log(`Match in ${convId} (line ${lineCount}): tool=${tc.name}, keys=${Object.keys(tc.args).join(",")}`);
              if (tc.name === "default_api:write_to_file" || tc.name === "default_api:replace_file_content") {
                const content = tc.args.CodeContent || tc.args.ReplacementContent || "";
                if (content.length > 500) {
                  return {
                    convId,
                    lineCount,
                    tool: tc.name,
                    content
                  };
                }
              }
            }
          }
        }
      } catch (err) {
        // Ignore
      }
    }
  }
  return null;
}

async function run() {
  console.log("Scanning all conversations...");
  const dirs = fs.readdirSync(resolvedBrainDir);
  let found = null;
  
  for (const dir of dirs) {
    const fullPath = path.join(resolvedBrainDir, dir);
    if (fs.statSync(fullPath).isDirectory()) {
      const transcriptPath = path.join(fullPath, ".system_generated", "logs", "transcript_full.jsonl");
      const result = await scanTranscript(transcriptPath, dir);
      if (result) {
        console.log(`\nFound matching content!`);
        console.log(`Conv: ${result.convId}, Tool: ${result.tool}, Length: ${result.content.length}`);
        
        if (result.tool === "default_api:write_to_file") {
          const targetPath = "c:\\KOWER2\\components\\admin\\VisibilityOrderManager.tsx";
          fs.writeFileSync(targetPath, result.content, "utf8");
          console.log(`Restored to: ${targetPath}`);
          found = result;
          break;
        }
      }
    }
  }
  
  if (!found) {
    console.log("\nFinished. No full file content restored yet.");
  }
}

run();
