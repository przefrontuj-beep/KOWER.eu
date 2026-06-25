"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, FileText, Paperclip, X, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

type FormState = "idle" | "success" | "error" | "sending";
type FormVariant = "contact" | "estimate" | "wholesale" | "consultation";

const maxFiles = 5;
const maxFileSize = 10 * 1024 * 1024;
const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha?: {
      ready(callback: () => void): void;
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  }
}

const topicLabels: Record<FormVariant, string> = {
  contact: "Kontakt",
  estimate: "Wycena",
  wholesale: "Zapytanie hurtowe",
  consultation: "Konsultacja",
};

const inquiryTypes = [
  "meble na wymiar",
  "lamele detaliczne",
  "lamele hurtowe",
  "AGD",
  "cięcie płyt",
  "oklejanie płyt",
  "materiały i fronty",
  "inne",
];

function formatFileSize(size: number) {
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ContactForm({ variant = "contact" }: { variant?: FormVariant }) {
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const isConsultation = variant === "consultation";
  const selectedFileSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);

  function validateFiles(nextFiles: File[]) {
    if (nextFiles.length > maxFiles) {
      return `Możesz załączyć maksymalnie ${maxFiles} plików.`;
    }

    const invalidType = nextFiles.find((file) => !allowedTypes.includes(file.type));
    if (invalidType) {
      return `Plik ${invalidType.name} ma nieobsługiwany format. Dodaj JPG, PNG, WEBP albo PDF.`;
    }

    const oversized = nextFiles.find((file) => file.size > maxFileSize);
    if (oversized) {
      return `Plik ${oversized.name} jest za duży. Maksymalny rozmiar jednego pliku to 10 MB.`;
    }

    return "";
  }

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFiles = Array.from(event.target.files || []);
    const validationError = validateFiles(nextFiles);

    if (validationError) {
      setStatus("error");
      setError(validationError);
      setFiles([]);
      event.target.value = "";
      return;
    }

    setError("");
    setStatus("idle");
    setFiles(nextFiles);
  }

  function removeFile(fileName: string) {
    setFiles((current) => current.filter((file) => file.name !== fileName));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "");
    const rodo = data.get("rodo");
    const validationError = validateFiles(files);

    if (!email.includes("@")) {
      setStatus("error");
      setError("Podaj poprawny adres e-mail.");
      return;
    }

    if (!rodo) {
      setStatus("error");
      setError("Zaznacz zgodę na kontakt w sprawie zapytania.");
      return;
    }

    if (validationError) {
      setStatus("error");
      setError(validationError);
      return;
    }

    setStatus("sending");
    setError("");

    try {
      if (recaptchaSiteKey && window.grecaptcha) {
        const recaptchaToken = await new Promise<string>((resolve, reject) => {
          window.grecaptcha?.ready(() => {
            window.grecaptcha
              ?.execute(recaptchaSiteKey, { action: "contact_form" })
              .then(resolve)
              .catch(reject);
          });
        });
        data.set("recaptchaToken", recaptchaToken);
      }

      const response = await fetch("/api/consultation", {
        method: "POST",
        body: data,
      });
      const result = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Nie udało się wysłać formularza.");
      }

      setStatus("success");
      setFiles([]);
      form.reset();
    } catch (submitError) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Nie udało się wysłać formularza.");
    }
  }

  return (
    <>
      {recaptchaSiteKey ? (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
          strategy="afterInteractive"
        />
      ) : null}
      <form
      id="formularz"
      className="border border-[#e6e2d9] bg-[#faf8f5] p-8 md:p-12 shadow-[0_20px_70px_rgba(42,38,28,0.06)] rounded-[28px]"
      data-resend-ready="true"
      data-recaptcha-ready="true"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="topic" value={topicLabels[variant]} />
      <input
        className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Header section as shown in the screenshot */}
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8a8273] mb-2">
          — {topicLabels[variant]}
        </p>
        <h2 className="font-serif text-[32px] md:text-[38px] lg:text-[42px] font-normal leading-tight text-[#2c2b28] tracking-tight">
          Prześlij zapytanie
        </h2>
      </div>

      <FieldGroup className="grid gap-6 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="name" className="text-[13px] font-semibold text-[#5c584f] mb-1.5">
            Imię i nazwisko
          </FieldLabel>
          <Input
            required
            id="name"
            name="name"
            autoComplete="name"
            className="h-14 border border-[#e5e1d8] bg-white px-4 text-base rounded-[12px] outline-none text-[#2c2b28] placeholder:text-[#a09b91] focus-visible:ring-1 focus-visible:ring-[#487330] focus-visible:border-[#487330] shadow-none"
            placeholder="Jan Kowalski"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email" className="text-[13px] font-semibold text-[#5c584f] mb-1.5">
            E-mail
          </FieldLabel>
          <Input
            required
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            className="h-14 border border-[#e5e1d8] bg-white px-4 text-base rounded-[12px] outline-none text-[#2c2b28] placeholder:text-[#a09b91] focus-visible:ring-1 focus-visible:ring-[#487330] focus-visible:border-[#487330] shadow-none"
            placeholder="email@domena.pl"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="phone" className="text-[13px] font-semibold text-[#5c584f] mb-1.5">
            Telefon
          </FieldLabel>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="h-14 border border-[#e5e1d8] bg-white px-4 text-base rounded-[12px] outline-none text-[#2c2b28] placeholder:text-[#a09b91] focus-visible:ring-1 focus-visible:ring-[#487330] focus-visible:border-[#487330] shadow-none"
            placeholder="+48"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="scope" className="text-[13px] font-semibold text-[#5c584f] mb-1.5">
            Typ zapytania
          </FieldLabel>
          <Select
            name="scope"
            defaultValue={isConsultation ? "meble na wymiar" : variant}
          >
            <SelectTrigger 
              id="scope"
              className="h-14 border border-[#e5e1d8] bg-white px-4 text-base rounded-[12px] w-full flex items-center justify-between outline-none text-[#2c2b28] focus:border-[#487330] focus-visible:ring-1 focus-visible:ring-[#487330] shadow-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-[#fbfaf5] border border-[#d9d3c7]">
              <SelectGroup>
                {!isConsultation && (
                  <SelectItem value={variant} className="hover:bg-[#e6edd9] hover:text-[#3c5f27] focus:bg-[#e6edd9] focus:text-[#3c5f27]">
                    {topicLabels[variant]}
                  </SelectItem>
                )}
                {inquiryTypes.map((type) => (
                  <SelectItem key={type} value={type} className="hover:bg-[#e6edd9] hover:text-[#3c5f27] focus:bg-[#e6edd9] focus:text-[#3c5f27]">
                    {type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field className="md:col-span-2">
          <FieldLabel htmlFor="message" className="text-[13px] font-semibold text-[#5c584f] mb-1.5">
            Wiadomość
          </FieldLabel>
          <Textarea
            required
            id="message"
            name="message"
            rows={6}
            className="resize-none border border-[#e5e1d8] bg-white px-4 py-3.5 text-base rounded-[12px] outline-none min-h-[144px] text-[#2c2b28] placeholder:text-[#a09b91] focus-visible:ring-1 focus-visible:ring-[#487330] focus-visible:border-[#487330] shadow-none"
            placeholder="Opisz wymiary, materiał, ilości, termin albo etap projektu."
          />
        </Field>

        <Field className="md:col-span-2 gap-3">
          <label className="flex min-h-[96px] cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-[#487330] bg-[#fdfdfb]/40 px-4 py-6 text-center text-sm rounded-[12px] transition hover:border-[#487330]/80 hover:bg-white">
            <Paperclip className="h-5 w-5 text-[#487330]" aria-hidden="true" />
            <span className="font-semibold text-[#2c2b28] text-[14px]">Załącz pliki do konsultacji</span>
            <span className="text-[12px] text-[#8a857c]">JPG, PNG, WEBP lub PDF. Maksymalnie 5 plików, 10 MB każdy.</span>
            <input
              className="sr-only"
              name="attachments"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
              multiple
              onChange={handleFiles}
            />
          </label>

          {files.length > 0 && (
            <div className="grid gap-2 border border-[#d8ddd0] bg-[#fffdf7] p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#487330]">
                Wybrane pliki ({files.length}) · {formatFileSize(selectedFileSize)}
              </p>
              {files.map((file) => (
                <div key={file.name} className="flex items-center justify-between gap-3 text-sm text-[#34372f]">
                  <span className="inline-flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#8a947f]" aria-hidden="true" />
                    {file.name} · {formatFileSize(file.size)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(file.name)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d8ddd0] text-[#61675c] transition hover:border-[#487330] hover:text-[#487330] focus-ring cursor-pointer"
                    aria-label={`Usuń plik ${file.name}`}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Field>

        <div className="border border-[#ebdccb]/30 bg-[#faf8f2] border-[#e8e4db] px-4 py-3.5 rounded-[12px] flex items-center gap-3 text-[13px] text-[#7a7265] leading-relaxed md:col-span-2 shadow-none">
          <Shield className="h-5 w-5 text-[#7a7265] shrink-0" strokeWidth={1.8} />
          <div>
            <span className="font-semibold text-[#5c564c]">Ochrona antyspamowa.</span>{" "}
            {recaptchaSiteKey
              ? "Formularz jest chroniony przez reCAPTCHA."
              : "Ochrona reCAPTCHA zostanie aktywowana po konfiguracji kluczy środowiskowych."}
          </div>
        </div>

        <Field orientation="horizontal" className="md:col-span-2 items-start gap-3">
          <Checkbox id="rodo" name="rodo" required className="size-[18px] rounded-[4px] border-[#e5e1d8] cursor-pointer mt-1 focus-visible:ring-[#487330] focus-visible:border-[#487330] data-checked:bg-[#487330] data-checked:border-[#487330]" />
          <FieldLabel htmlFor="rodo" className="text-[14px] leading-relaxed text-[#5c584f] font-normal cursor-pointer">
            Wyrażam zgodę na kontakt w sprawie mojego zapytania i akceptuję przetwarzanie danych zgodnie z{" "}
            <Link href="/polityka-prywatnosci" className="underline hover:text-[#487330]">
              polityką prywatności
            </Link>.
          </FieldLabel>
        </Field>

        <div className="flex flex-col gap-4 md:col-span-2 pt-2">
          <Button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex h-[56px] items-center justify-center gap-3 bg-[#3f4d2f] px-9 text-[12px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(63,77,47,0.18)] hover:shadow-[0_12px_28px_rgba(63,77,47,0.28)] rounded-full hover:bg-[#323e25] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer transition duration-300 w-fit self-start"
          >
            {status === "sending" ? "Wysyłanie…" : "Wyślij zapytanie"}
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Button>
          {status === "success" && (
            <p className="text-sm font-medium text-[#3c5f27] mt-2">
              Dziękujemy. Zgłoszenie zostało zapisane i przekazane do obsługi.
            </p>
          )}
          {status === "error" && <p className="text-sm font-medium text-red-700 mt-2">{error}</p>}
        </div>
      </FieldGroup>
      </form>
    </>
  );
}
