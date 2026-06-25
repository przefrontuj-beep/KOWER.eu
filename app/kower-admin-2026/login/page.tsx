"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Mail, Lock, Loader2, AlertTriangle } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading, error: authError } = useAdminAuth();

  useEffect(() => {
    // Jeśli użytkownik jest już zalogowany jako admin, przekieruj
    if (!loading && user) {
      router.push("/kower-admin-2026/strona-glowna");
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!isFirebaseConfigured || !auth || !db) {
      setLocalError("Firebase nie został skonfigurowany. Sprawdź plik .env.");
      return;
    }

    if (!email || !password) {
      setLocalError("Proszę wpisać adres e-mail oraz hasło.");
      return;
    }

    setSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Sprawdzenie roli w Firestore
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists() && userDocSnap.data()?.role === "admin") {
        // Zaktualizowanie czasu ostatniego logowania
        await updateDoc(userDocRef, {
          lastLoginAt: serverTimestamp()
        });
        router.push("/kower-admin-2026/strona-glowna");
      } else {
        // Wylogowanie, ponieważ to nie jest administrator
        await signOut(auth);
        setLocalError("Brak dostępu: Twoje konto nie posiada uprawnień administratora.");
      }
    } catch (err: unknown) {
      console.error("Błąd logowania:", err);
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/invalid-credential" || firebaseError.code === "auth/user-not-found" || firebaseError.code === "auth/wrong-password") {
        setLocalError("Nieprawidłowy e-mail lub hasło.");
      } else if (firebaseError.code === "auth/too-many-requests") {
        setLocalError("Zbyt wiele nieudanych prób. Konto tymczasowo zablokowane.");
      } else {
        setLocalError(firebaseError.message || "Wystąpił błąd podczas logowania.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const activeError = localError || authError;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-[#f8f4ec] via-[#eee6da] to-[#e4dfd5]">
      {/* Decorative background circle */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#487330]/[0.04] blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_rgba(31,26,20,0.08)] p-10 rounded-3xl">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo/kower-logo.png"
            alt="Kower Pracownia Meblarska"
            width={150}
            height={52}
            className="h-auto w-[150px] mb-6"
            priority
          />

          <div className="flex items-center justify-center size-12 rounded-2xl bg-[#487330]/10 mb-4">
            <ShieldCheck className="size-6 text-[#487330]" />
          </div>

          <h1 className="font-serif text-2xl font-semibold text-[#24231f] text-center">
            Panel Administratora
          </h1>
          <p className="text-xs text-[#8a8578] mt-2 tracking-wide uppercase">
            Zaloguj się, aby zarządzać stroną
          </p>
        </div>

        {!isFirebaseConfigured && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 leading-5 flex items-center gap-3">
            <AlertTriangle className="size-4 shrink-0" />
            <span>
              <strong>Brak konfiguracji Firebase:</strong> Zmienne środowiskowe nie zostały załadowane. Wklej je do pliku <code>.env.local</code> lub w ustawieniach Netlify.
            </span>
          </div>
        )}

        {activeError && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-5 flex items-center gap-3">
            <AlertTriangle className="size-4 shrink-0" />
            <span>{activeError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.08em] text-[#2c2b27]">
              Adres e-mail
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8a8578]" />
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="admin@kower.pl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting || loading || !isFirebaseConfigured}
                className="w-full h-12 pl-11 border-[#d6d0c3] focus-visible:ring-[#487330] rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.08em] text-[#2c2b27]">
              Hasło
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8a8578]" />
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting || loading || !isFirebaseConfigured}
                className="w-full h-12 pl-11 border-[#d6d0c3] focus-visible:ring-[#487330] rounded-xl"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting || loading || !isFirebaseConfigured}
            className="w-full h-12 bg-gradient-to-r from-[#487330] to-[#3a5d26] hover:from-[#3a5d26] hover:to-[#2d4a1e] text-white font-bold uppercase tracking-[0.12em] text-xs rounded-xl transition-all cursor-pointer mt-4"
          >
            {submitting ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Zaloguj się"
            )}
          </Button>
        </form>
      </div>

      <p className="text-xs text-[#8a8578]/60 mt-6">
        © 2026 KOWER Pracownia Meblarska
      </p>
    </div>
  );
}
