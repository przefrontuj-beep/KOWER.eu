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
  const tokenRes = await client.getAccessToken();
  const accessToken = tokenRes.token;

  console.log("Uploading file via REST API...");
  const content = "Hello Firebase Storage REST API";
  const bucketName = "kower-84922.firebasestorage.app";
  const filePath = "kower/gallery/test/hello.txt";
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o?name=${encodeURIComponent(filePath)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'text/plain'
    },
    body: content
  });

  if (response.ok) {
    const data = await response.json();
    console.log("Upload SUCCESS!");
    console.log("Response:", data);
  } else {
    const errText = await response.text();
    console.error("Upload FAILED:", response.status, errText);
  }
} catch (e) {
  console.error("Error:", e);
}
