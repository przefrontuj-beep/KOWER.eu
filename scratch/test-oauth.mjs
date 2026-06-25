import fs from 'fs';
import { OAuth2Client } from 'google-auth-library';

try {
  const config = JSON.parse(fs.readFileSync('C:\\Users\\damia\\.config\\configstore\\firebase-tools.json', 'utf8'));
  const refreshToken = config.tokens.refresh_token;

  const client = new OAuth2Client(
    "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
    "j9iVZfS8kkCEFUPaAeJV0sAi"
  );

  client.setCredentials({ refresh_token: refreshToken });

  console.log("Refreshing access token...");
  const res = await client.getAccessToken();
  console.log("Access token retrieved:", res.token ? "SUCCESS" : "FAILED");
} catch (e) {
  console.error("Error:", e);
}
