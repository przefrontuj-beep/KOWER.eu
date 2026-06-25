import fs from 'fs';
import path from 'path';
import { Storage } from '@google-cloud/storage';

try {
  const config = JSON.parse(fs.readFileSync('C:\\Users\\damia\\.config\\configstore\\firebase-tools.json', 'utf8'));
  const refreshToken = config.tokens.refresh_token;

  const creds = {
    type: "authorized_user",
    client_id: "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
    client_secret: "j9iVZfS8kkCEFUPaAeJV0sAi",
    refresh_token: refreshToken
  };

  const credsPath = path.resolve('scratch/temp-creds.json');
  fs.writeFileSync(credsPath, JSON.stringify(creds, null, 2));

  process.env.GOOGLE_APPLICATION_CREDENTIALS = credsPath;

  console.log("Initializing storage with GOOGLE_APPLICATION_CREDENTIALS...");
  const storage = new Storage({
    projectId: "kower-84922"
  });

  const bucket = storage.bucket("kower-84922.firebasestorage.app");
  console.log("Listing files in bucket...");
  const [files] = await bucket.getFiles({ prefix: 'kower/gallery/', maxResults: 5 });
  console.log("Files found:", files.map(f => f.name));

  // Cleanup credentials file
  fs.unlinkSync(credsPath);
} catch (e) {
  console.error("Error:", e);
}
