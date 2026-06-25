import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, where } from "firebase/firestore";
import fs from "fs";
import path from "path";

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
const config = {};
envContent.split("\n").forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2] ? match[2].trim() : "";
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    config[key] = value;
  }
});

const firebaseConfig = {
  apiKey: config.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: config.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: config.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: config.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: config.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("Firebase config loaded for project:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function dump() {
  try {
    const galleryRef = collection(db, "kowerGallery");
    const q = query(
      galleryRef,
      where("isPublished", "==", true),
      orderBy("order", "asc")
    );
    const snapshot = await getDocs(q);
    
    console.log(`\nFound ${snapshot.size} documents in kowerGallery:\n`);
    
    const docs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      docs.push({
        id: doc.id,
        title: data.title,
        featured: !!data.featured,
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
        order: data.order,
        imageUrl: data.imageUrl,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      });
    });

    console.table(docs.map(d => ({
      ID: d.id,
      Title: d.title,
      Featured: d.Featured ? "★ YES" : (d.featured ? "★ YES" : "no"),
      Published: d.isPublished ? "yes" : "NO",
      Order: d.order,
      ImageName: d.imageUrl ? d.imageUrl.split("/").pop().split("?")[0] : ""
    })));
    const realizationsRef = collection(db, "realizations");
    const realizationsQuery = query(realizationsRef, where("status", "==", "published"));
    const realizationsSnapshot = await getDocs(realizationsQuery);
    console.log(`\nFound ${realizationsSnapshot.size} documents in realizations:\n`);
    const realizations = [];
    realizationsSnapshot.forEach(doc => {
      const data = doc.data();
      realizations.push({
        id: doc.id,
        title: data.title,
        status: data.status,
        order: data.order,
        imagesCount: data.images ? data.images.length : 0,
        coverImage: data.coverImage
      });
    });
    console.table(realizations);
  } catch (err) {
    console.error("Error fetching documents:", err);
  }
}

dump();
