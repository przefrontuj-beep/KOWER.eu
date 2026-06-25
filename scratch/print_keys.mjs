import { Firestore } from "@google-cloud/firestore";
import fs from "fs";
import path from "path";

async function run() {
  const credsPath = path.resolve('scratch/temp-creds.json');
  try {
    const config = JSON.parse(fs.readFileSync('C:\\Users\\damia\\.config\\configstore\\firebase-tools.json', 'utf8'));
    const refreshToken = config.tokens.refresh_token;

    const creds = {
      type: "authorized_user",
      client_id: "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
      client_secret: "j9iVZfS8kkCEFUPaAeJV0sAi",
      refresh_token: refreshToken
    };

    if (!fs.existsSync('scratch')) {
      fs.mkdirSync('scratch');
    }
    fs.writeFileSync(credsPath, JSON.stringify(creds, null, 2));
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credsPath;

    const db = new Firestore({ projectId: "kower-84922" });
    const doc = await db.collection("kowerGallery").doc("realizacja-01").get();
    console.log("kowerGallery/realizacja-01:", JSON.stringify(doc.data(), null, 2));

    const realDoc = await db.collection("realizations").doc("realizacja-01").get();
    console.log("realizations/realizacja-01:", JSON.stringify(realDoc.data(), null, 2));

  } catch (err) {
    console.error("Error:", err);
  } finally {
    if (fs.existsSync(credsPath)) {
      fs.unlinkSync(credsPath);
    }
  }
}

run();
