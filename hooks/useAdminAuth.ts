"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase/client";

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(
    isFirebaseConfigured ? null : "Firebase is not configured."
  );
  const router = useRouter();

  useEffect(() => {
    const activeAuth = auth;
    if (!isFirebaseConfigured || !activeAuth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(activeAuth, async (currentUser) => {
      if (currentUser) {
        try {
          if (db) {
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists() && userDocSnap.data()?.role === "admin") {
              setUser(currentUser);
              setError(null);
            } else {
              // Wyloguj użytkownika, który nie ma roli admin
              try {
                await signOut(activeAuth);
              } catch (e) {
                console.error("Wylogowanie nieautoryzowanego użytkownika nie powiodło się:", e);
              }
              setUser(null);
              setError("Brak dostępu: Twoje konto nie posiada uprawnień administratora.");
              router.push("/kower-admin-2026/login?error=unauthorized");
            }
          } else {
            setError("Baza danych nie jest skonfigurowana.");
            setUser(null);
          }
        } catch (e) {
          console.error("Błąd autoryzacji:", e);
          try {
            await signOut(activeAuth);
          } catch (err) {
            console.error("Błąd wylogowywania:", err);
          }
          setUser(null);
          setError("Wystąpił błąd autoryzacji konta.");
          router.push("/kower-admin-2026/login?error=error");
        }
      } else {
        setUser(null);
        setError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const logout = async () => {
    const activeAuth = auth;
    if (!activeAuth) return;
    setLoading(true);
    try {
      await signOut(activeAuth);
      router.push("/kower-admin-2026/login");
    } catch (e: unknown) {
      console.error("Błąd podczas wylogowywania:", e);
      const errMsg = e instanceof Error ? e.message : "Wystąpił błąd podczas wylogowywania.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, logout };
}
