import "server-only";

import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const projectId =
  process.env.FIREBASE_ADMIN_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
const storageBucket =
  process.env.FIREBASE_ADMIN_STORAGE_BUCKET ||
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

export const isFirebaseAdminConfigured = Boolean(
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    (projectId && clientEmail && privateKey),
);

function getAdminApp() {
  if (!isFirebaseAdminConfigured || !projectId) {
    return null;
  }

  if (getApps().length > 0) {
    return getApps()[0];
  }

  return initializeApp({
    credential:
      clientEmail && privateKey
        ? cert({
            projectId,
            clientEmail,
            privateKey,
          })
        : applicationDefault(),
    projectId,
    storageBucket,
  });
}

export function getFirebaseAdminServices() {
  const app = getAdminApp();
  if (!app) {
    return null;
  }

  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  };
}
