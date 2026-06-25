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
    const gallerySnapshot = await db.collection("kowerGallery").get();
    console.log(`Total documents in kowerGallery: ${gallerySnapshot.size}`);

    gallerySnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`\nDocument: ${doc.id}`);
      console.log(`  title: ${data.title}`);
      console.log(`  createdAt: ${data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : JSON.stringify(data.createdAt)) : "MISSING"}`);
      console.log(`  updatedAt: ${data.updatedAt ? (data.updatedAt.toDate ? data.updatedAt.toDate().toISOString() : JSON.stringify(data.updatedAt)) : "MISSING"}`);
      console.log(`  order: ${data.order}`);
      console.log(`  isPublished: ${data.isPublished}`);
    });

  } catch (err) {
    console.error("Error running query:", err);
  } finally {
    if (fs.existsSync(credsPath)) {
      fs.unlinkSync(credsPath);
    }
  }
}

run();
