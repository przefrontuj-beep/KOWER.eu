import fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import * as admin from 'firebase-admin';

try {
  const config = JSON.parse(fs.readFileSync('C:\\Users\\damia\\.config\\configstore\\firebase-tools.json', 'utf8'));
  const refreshToken = config.tokens.refresh_token;

  const client = new OAuth2Client(
    "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
    "j9iVZfS8kkCEFUPaAeJV0sAi"
  );

  client.setCredentials({ refresh_token: refreshToken });

  console.log("Refreshing access token...");
  const tokenRes = await client.getAccessToken();
  const accessToken = tokenRes.token;
  console.log("Access token refreshed.");

  console.log("Initializing firebase-admin...");
  admin.initializeApp({
    credential: admin.credential.accessToken(accessToken),
    projectId: "kower-84922"
  });

  const db = admin.firestore();
  console.log("Fetching collections using firebase-admin...");
  const collections = await db.listCollections();
  console.log("Collections found:", collections.map(c => c.id));
} catch (e) {
  console.error("Error:", e);
}
