import fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import { Storage } from '@google-cloud/storage';

try {
  const config = JSON.parse(fs.readFileSync('C:\\Users\\damia\\.config\\configstore\\firebase-tools.json', 'utf8'));
  const refreshToken = config.tokens.refresh_token;

  const client = new OAuth2Client(
    "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
    "j9iVZfS8kkCEFUPaAeJV0sAi"
  );

  client.setCredentials({ refresh_token: refreshToken });

  console.log("Initializing storage...");
  const storage = new Storage({
    projectId: "kower-84922",
    authClient: client
  });

  const bucket = storage.bucket("kower-84922.firebasestorage.app");
  console.log("Listing files in bucket...");
  const [files] = await bucket.getFiles({ maxResults: 5 });
  console.log("Files found:", files.map(f => f.name));
} catch (e) {
  console.error("Error:", e);
}
