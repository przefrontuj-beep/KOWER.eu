import { NextResponse } from "next/server";
import { getFirebaseAdminServices } from "@/lib/firebase/admin";

export const runtime = "nodejs";

async function getAdminRequest(request: Request) {
  const services = getFirebaseAdminServices();
  if (!services) {
    return { error: "Prywatne załączniki wymagają konfiguracji Firebase Admin.", status: 503 };
  }

  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  if (!token) {
    return { error: "Nieprawidłowe żądanie.", status: 400 };
  }

  try {
    const decoded = await services.auth.verifyIdToken(token);
    const profile = await services.db.collection("users").doc(decoded.uid).get();
    const isAdmin = decoded.admin === true || profile.data()?.role === "admin";
    if (!isAdmin || profile.data()?.disabled === true) {
      return { error: "Brak dostępu.", status: 403 };
    }
    return { services };
  } catch {
    return { error: "Brak dostępu.", status: 403 };
  }
}

export async function GET(request: Request) {
  const adminRequest = await getAdminRequest(request);
  if ("error" in adminRequest) {
    return NextResponse.json(
      { message: adminRequest.error },
      { status: adminRequest.status },
    );
  }
  const path = new URL(request.url).searchParams.get("path") || "";
  if (!path.startsWith("kower/leads/")) {
    return NextResponse.json({ message: "Nieprawidłowe żądanie." }, { status: 400 });
  }

  try {
    const { services } = adminRequest;
    const [url] = await services.storage
      .bucket()
      .file(path)
      .getSignedUrl({
        action: "read",
        expires: Date.now() + 5 * 60 * 1000,
      });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Błąd udostępniania załącznika:", error);
    return NextResponse.json(
      { message: "Nie udało się przygotować bezpiecznego linku." },
      { status: 403 },
    );
  }
}

export async function DELETE(request: Request) {
  const adminRequest = await getAdminRequest(request);
  if ("error" in adminRequest) {
    return NextResponse.json(
      { message: adminRequest.error },
      { status: adminRequest.status },
    );
  }

  const leadId = new URL(request.url).searchParams.get("leadId") || "";
  if (!/^[a-zA-Z0-9_-]{6,128}$/.test(leadId)) {
    return NextResponse.json({ message: "Nieprawidłowe zgłoszenie." }, { status: 400 });
  }

  try {
    const { services } = adminRequest;
    const leadRef = services.db.collection("leads").doc(leadId);
    const lead = await leadRef.get();
    if (!lead.exists) {
      return NextResponse.json({ message: "Zgłoszenie nie istnieje." }, { status: 404 });
    }

    const attachments = Array.isArray(lead.data()?.attachments)
      ? lead.data()?.attachments as Array<{ storagePath?: string }>
      : [];
    await Promise.allSettled(
      attachments
        .map((attachment) => attachment.storagePath)
        .filter((path): path is string => Boolean(path?.startsWith("kower/leads/")))
        .map((path) => services.storage.bucket().file(path).delete()),
    );
    await leadRef.delete();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Błąd usuwania zgłoszenia i załączników:", error);
    return NextResponse.json(
      { message: "Nie udało się usunąć zgłoszenia." },
      { status: 500 },
    );
  }
}
