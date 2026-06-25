import { NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebaseAdminServices } from "@/lib/firebase/admin";
import { db as publicDb } from "@/lib/firebase/client";
import { siteConfig } from "@/lib/site";

export const runtime = "nodejs";

/* ── Rate Limiting (in-memory, per-IP) ── */
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // max 5 requests per window

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap) {
    if (now > value.resetAt) rateLimitMap.delete(key);
  }
}, 5 * 60_000);

/* ── CORS ── */
const ALLOWED_ORIGINS = new Set([
  siteConfig.baseUrl,
  siteConfig.baseUrl.replace("https://", "https://www."),
  "http://localhost:3000",
  "http://localhost:3001",
]);

function corsHeaders(origin: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : ALLOWED_ORIGINS.values().next().value;
  return {
    "Access-Control-Allow-Origin": allowedOrigin!,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}
const maxFiles = 5;
const maxFileSize = 10 * 1024 * 1024;
const maxEmailAttachmentTotal = 18 * 1024 * 1024;
const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

function getText(data: FormData, key: string) {
  return String(data.get(key) || "").trim();
}

function safeFileName(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() || "bin";
  const baseName = fileName
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${baseName || "zalacznik"}.${extension}`;
}

async function verifyRecaptcha(token: string) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn("RECAPTCHA_SECRET_KEY nie jest ustawiony — odrzucam żądanie dla bezpieczeństwa.");
    return false;
  }
  if (!token) {
    return false;
  }

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
    cache: "no-store",
  });
  const result = (await response.json()) as {
    success?: boolean;
    score?: number;
    action?: string;
  };

  return (
    result.success === true &&
    (result.action === undefined || result.action === "contact_form") &&
    (result.score === undefined || result.score >= 0.5)
  );
}

async function fileToAttachment(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return {
    filename: safeFileName(file.name),
    content: buffer.toString("base64"),
  };
}

async function persistLead(
  lead: {
    name: string;
    email: string;
    phone: string;
    message: string;
    scope: string;
    topic: string;
  },
  files: File[],
) {
  const services = getFirebaseAdminServices();
  const attachmentMetadata = files.map((file) => ({
    name: safeFileName(file.name),
    type: file.type,
    size: file.size,
  }));

  if (services) {
    const leadRef = services.db.collection("leads").doc();
    const storedAttachments = [];
    const storedPaths: string[] = [];

    try {
      for (const [index, file] of files.entries()) {
        const storagePath = `kower/leads/${leadRef.id}/${index + 1}-${safeFileName(file.name)}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        await services.storage.bucket().file(storagePath).save(buffer, {
          resumable: false,
          metadata: {
            contentType: file.type,
            cacheControl: "private, max-age=0, no-store",
          },
        });
        storedPaths.push(storagePath);
        storedAttachments.push({
          ...attachmentMetadata[index],
          storagePath,
        });
      }

      await leadRef.set({
        ...lead,
        source: "formularz-www",
        status: "new",
        adminNote: "",
        attachments: storedAttachments,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      await Promise.allSettled(
        storedPaths.map((path) => services.storage.bucket().file(path).delete()),
      );
      throw error;
    }

    return leadRef.id;
  }

  if (!publicDb) {
    throw new Error("Firebase nie jest skonfigurowany.");
  }

  const leadRef = await addDoc(collection(publicDb, "leads"), {
    ...lead,
    source: "formularz-www",
    status: "new",
    adminNote: "",
    attachments: attachmentMetadata,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return leadRef.id;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    /* ── Rate Limit ── */
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, message: "Zbyt wiele prób. Spróbuj ponownie za minutę." },
        { status: 429, headers },
      );
    }

    /* ── CORS ── */
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return NextResponse.json(
        { ok: false, message: "Niedozwolone źródło żądania." },
        { status: 403, headers },
      );
    }

    const data = await request.formData();
    const name = getText(data, "name");
    const email = getText(data, "email").toLowerCase();
    const phone = getText(data, "phone");
    const scope = getText(data, "scope");
    const topic = getText(data, "topic");
    const message = getText(data, "message");
    const website = getText(data, "website");
    const rodo = data.get("rodo");
    const recaptchaToken = getText(data, "recaptchaToken");
    const files = data
      .getAll("attachments")
      .filter((value): value is File => value instanceof File && value.size > 0);

    if (website) {
      return NextResponse.json({ ok: true, delivered: false });
    }

    if (
      name.length < 2 ||
      name.length > 120 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 160 ||
      phone.length > 40 ||
      message.length < 5 ||
      message.length > 5000 ||
      scope.length > 120 ||
      topic.length > 120 ||
      !rodo
    ) {
      return NextResponse.json(
        { ok: false, message: "Uzupełnij poprawnie wymagane pola formularza." },
        { status: 400 },
      );
    }

    if (files.length > maxFiles) {
      return NextResponse.json(
        { ok: false, message: `Możesz załączyć maksymalnie ${maxFiles} plików.` },
        { status: 400 },
      );
    }

    const invalidType = files.find((file) => !allowedTypes.has(file.type));
    if (invalidType) {
      return NextResponse.json(
        { ok: false, message: `Plik ${invalidType.name} ma nieobsługiwany format.` },
        { status: 400 },
      );
    }

    const oversized = files.find((file) => file.size > maxFileSize);
    if (oversized) {
      return NextResponse.json(
        { ok: false, message: `Plik ${oversized.name} jest za duży.` },
        { status: 400 },
      );
    }

    if (!(await verifyRecaptcha(recaptchaToken))) {
      return NextResponse.json(
        { ok: false, message: "Nie udało się potwierdzić reCAPTCHA." },
        { status: 400 },
      );
    }

    let leadId = "";
    let leadSaved = false;
    try {
      leadId = await persistLead(
        { name, email, phone, message, scope, topic },
        files,
      );
      leadSaved = true;
    } catch (persistenceError) {
      console.error("Nie udało się zapisać zgłoszenia w Firebase:", persistenceError);
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const recipient =
      process.env.KOWER_CONTACT_EMAIL ||
      process.env.CONTACT_TO_EMAIL ||
      siteConfig.email;
    const sender = process.env.KOWER_FORM_FROM || "Kower <onboarding@resend.dev>";
    const totalFileSize = files.reduce((sum, file) => sum + file.size, 0);
    const canAttachToEmail = totalFileSize <= maxEmailAttachmentTotal;
    const fileSummary = files.length
      ? files
          .map(
            (file) =>
              `- ${safeFileName(file.name)} (${Math.round(file.size / 1024)} KB, ${file.type})`,
          )
          .join("\n")
      : "Brak załączników.";

    const text = [
      leadId ? `ID zgłoszenia: ${leadId}` : "ID zgłoszenia: brak zapisu w Firebase",
      `Temat: ${topic || "Formularz Kower"}`,
      `Typ zapytania: ${scope || "nie podano"}`,
      `Imię i nazwisko: ${name}`,
      `Email: ${email}`,
      `Telefon: ${phone || "nie podano"}`,
      "",
      "Wiadomość:",
      message,
      "",
      "Załączniki:",
      fileSummary,
      !canAttachToEmail && files.length
        ? "Załączniki zapisano prywatnie w Firebase Storage."
        : "",
    ].join("\n");

    if (!resendApiKey || !recipient || recipient.startsWith("[")) {
      if (!leadSaved) {
        return NextResponse.json(
          {
            ok: false,
            delivered: false,
            leadSaved: false,
            message:
              "Nie udało się zapisać zgłoszenia. Spróbuj ponownie.",
          },
          { status: 503 },
        );
      }
      return NextResponse.json({
        ok: true,
        delivered: false,
        leadSaved,
        leadId,
        message: "Zgłoszenie zostało zapisane.",
      });
    }

    const attachments = canAttachToEmail
      ? await Promise.all(files.map(fileToAttachment))
      : [];
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email,
        subject: `Kower: ${topic || scope || "nowe zapytanie"}`,
        text,
        attachments,
      }),
    });

    if (!resendResponse.ok && !leadSaved) {
      console.error("Resend odrzucił wiadomość:", await resendResponse.text());
      return NextResponse.json(
        {
          ok: false,
          delivered: false,
          leadSaved: false,
          message: "Nie udało się wysłać ani zapisać zgłoszenia.",
        },
        { status: 502 },
      );
    }

    if (!resendResponse.ok) {
      console.error("Resend odrzucił wiadomość:", await resendResponse.text());
      return NextResponse.json({
        ok: true,
        delivered: false,
        leadSaved,
        leadId,
        message: "Zgłoszenie zapisano w panelu, ale e-mail nie został wysłany.",
      });
    }

    return NextResponse.json({
      ok: true,
      delivered: true,
      leadSaved,
      leadId,
      attachmentMode: canAttachToEmail ? "email-attachments" : "private-storage",
    });
  } catch (error) {
    console.error("Błąd obsługi formularza:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Nie udało się zapisać zgłoszenia. Spróbuj ponownie.",
      },
      { status: 500 },
    );
  }
}
