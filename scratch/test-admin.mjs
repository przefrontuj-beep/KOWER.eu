import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

try {
  console.log("Initializing firebase-admin...");
  const app = initializeApp({
    projectId: "kower-84922"
  });
  const db = getFirestore(app);
  console.log("Fetching collections...");
  const collections = await db.listCollections();
  console.log("Collections found:", collections.map(c => c.id));
} catch (e) {
  console.error("Initialization / authentication error:", e);
}
