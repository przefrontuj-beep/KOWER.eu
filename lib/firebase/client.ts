import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  type AppCheck,
} from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Sprawdzenie, czy wszystkie zmienne konfiguracyjne są zdefiniowane
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId
);

let firebaseApp;
let firebaseAuth: ReturnType<typeof getAuth> | null = null;
let firebaseDb: ReturnType<typeof getFirestore> | null = null;
let firebaseStorage: ReturnType<typeof getStorage> | null = null;
let firebaseAppCheck: AppCheck | null = null;

if (isFirebaseConfigured) {
  try {
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    firebaseAuth = getAuth(firebaseApp);
    firebaseDb = getFirestore(firebaseApp);
    firebaseStorage = getStorage(firebaseApp);

    const appCheckSiteKey = process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY;
    if (typeof window !== "undefined" && appCheckSiteKey) {
      const globalWithAppCheck = globalThis as typeof globalThis & {
        __kowerAppCheck?: AppCheck;
      };
      firebaseAppCheck =
        globalWithAppCheck.__kowerAppCheck ||
        initializeAppCheck(firebaseApp, {
          provider: new ReCaptchaV3Provider(appCheckSiteKey),
          isTokenAutoRefreshEnabled: true,
        });
      globalWithAppCheck.__kowerAppCheck = firebaseAppCheck;
    }
  } catch (error) {
    console.error("Błąd inicjalizacji Firebase SDK:", error);
  }
} else {
  console.warn(
    "Zmienne środowiskowe Firebase nie zostały w pełni skonfigurowane. Włączono tryb fallback na dane lokalne."
  );
}

export const app = firebaseApp;
export const auth = firebaseAuth;
export const db = firebaseDb;
export const storage = firebaseStorage;
export const appCheck = firebaseAppCheck;
