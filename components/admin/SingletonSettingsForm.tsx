"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Save, SlidersHorizontal } from "lucide-react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { logAdminActivity } from "@/lib/admin/activity";
import { uploadAdminImage } from "@/lib/admin/image-upload";
import type { EntityField } from "@/components/admin/EntityManager";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type FormValue = string | number | boolean;
type FormState = Record<string, FormValue>;

function normalizeValue(value: unknown, field: EntityField, fallback: FormValue) {
  if (field.type === "switch") {
    return value === true;
  }
  if (field.type === "number") {
    return typeof value === "number" ? value : Number(value) || fallback;
  }
  return typeof value === "string" ? value : fallback;
}

export function SingletonSettingsForm({
  documentId,
  title,
  description,
  fields,
  defaults,
}: {
  documentId: "homepage" | "contact" | "global";
  title: string;
  description: string;
  fields: EntityField[];
  defaults: FormState;
}) {
  const { user } = useAdminAuth();
  const [form, setForm] = useState<FormState>(defaults);
  const [loading, setLoading] = useState(Boolean(db));
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<Record<string, File>>({});
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!db) {
      return;
    }

    let cancelled = false;
    const activeDb = db;
    void getDoc(doc(activeDb, "siteSettings", documentId))
      .then((snapshot) => {
        if (cancelled || !snapshot.exists()) {
          return;
        }
        const data = snapshot.data();
        const normalized = { ...defaults };
        for (const field of fields) {
          normalized[field.key] = normalizeValue(data[field.key], field, defaults[field.key]);
        }
        setForm(normalized);
      })
      .catch((error) => {
        console.error(`Błąd pobierania siteSettings/${documentId}:`, error);
        toast.error("Nie udało się pobrać ustawień.");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [defaults, documentId, fields]);

  function updateField(key: string, value: FormValue) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !user || saving) {
      return;
    }

    for (const field of fields) {
      if (field.required && !String(form[field.key] ?? "").trim()) {
        toast.error(`Pole „${field.label}” jest wymagane.`);
        return;
      }
      if (
        field.maxLength &&
        typeof form[field.key] === "string" &&
        String(form[field.key]).length > field.maxLength
      ) {
        toast.error(`Pole „${field.label}” jest za długie.`);
        return;
      }
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        ...form,
        updatedAt: serverTimestamp(),
        updatedBy: user.email || user.uid,
      };
      const nextForm = { ...form };

      for (const field of fields.filter((item) => item.type === "image")) {
        const file = imageFiles[field.key];
        if (!file) {
          continue;
        }
        const uploaded = await uploadAdminImage(file, {
          folder: `site-settings/${documentId}`,
          label: `${documentId}-${field.key}`,
          onProgress: setUploadProgress,
        });
        payload[field.key] = uploaded.imageUrl;
        payload[`${field.key}Path`] = uploaded.storagePath;
        payload[`${field.key}Thumbnail`] = uploaded.thumbnailUrl;
        nextForm[field.key] = uploaded.imageUrl;
      }

      await setDoc(doc(db, "siteSettings", documentId), payload, { merge: true });
      await logAdminActivity({
        user,
        action: "update",
        entityType: "siteSettings",
        entityId: documentId,
        entityLabel: title,
      });
      setForm(nextForm);
      setImageFiles({});
      toast.success("Zapisano zmiany.");
    } catch (error) {
      console.error(`Błąd zapisu siteSettings/${documentId}:`, error);
      toast.error("Nie udało się zapisać ustawień.");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Ustawienia strony"
        title={title}
        description={description}
        icon={SlidersHorizontal}
      />

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-20" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <FieldGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {fields.map((field) => {
                  const value = form[field.key];
                  const stringValue = typeof value === "string" ? value : "";

                  if (field.type === "switch") {
                    return (
                      <Field
                        key={field.key}
                        orientation="horizontal"
                        className={field.fullWidth ? "sm:col-span-2" : ""}
                      >
                        <div className="flex-1">
                          <FieldLabel htmlFor={field.key}>{field.label}</FieldLabel>
                          {field.help ? <FieldDescription>{field.help}</FieldDescription> : null}
                        </div>
                        <Switch
                          id={field.key}
                          checked={Boolean(value)}
                          onCheckedChange={(checked) => updateField(field.key, checked)}
                        />
                      </Field>
                    );
                  }

                  if (field.type === "textarea") {
                    return (
                      <Field key={field.key} className={field.fullWidth ? "sm:col-span-2" : ""}>
                        <FieldLabel htmlFor={field.key}>{field.label}</FieldLabel>
                        <Textarea
                          id={field.key}
                          rows={5}
                          value={stringValue}
                          maxLength={field.maxLength}
                          placeholder={field.placeholder}
                          onChange={(event) => updateField(field.key, event.target.value)}
                        />
                        <FieldDescription>
                          {field.help || (field.maxLength ? `${stringValue.length}/${field.maxLength} znaków` : "")}
                        </FieldDescription>
                      </Field>
                    );
                  }

                  if (field.type === "select" || field.type === "status") {
                    const options =
                      field.type === "status"
                        ? [
                            { value: "draft", label: "Szkic" },
                            { value: "published", label: "Opublikowane" },
                            { value: "hidden", label: "Ukryte" },
                          ]
                        : field.options || [];
                    return (
                      <Field key={field.key} className={field.fullWidth ? "sm:col-span-2" : ""}>
                        <FieldLabel htmlFor={field.key}>{field.label}</FieldLabel>
                        <Select
                          value={stringValue}
                          onValueChange={(nextValue) => updateField(field.key, nextValue)}
                        >
                          <SelectTrigger id={field.key}>
                            <SelectValue placeholder={field.placeholder || "Wybierz"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                    );
                  }

                  if (field.type === "image") {
                    return (
                      <Field key={field.key} className="sm:col-span-2">
                        <FieldLabel htmlFor={field.key}>{field.label}</FieldLabel>
                        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                          <Input
                            id={field.key}
                            type="url"
                            value={stringValue}
                            placeholder={field.placeholder || "https://…"}
                            onChange={(event) => updateField(field.key, event.target.value)}
                          />
                          <label className="inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium hover:bg-muted">
                            <ImagePlus />
                            Wybierz plik
                            <input
                              className="sr-only"
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) {
                                  setImageFiles((current) => ({ ...current, [field.key]: file }));
                                }
                              }}
                            />
                          </label>
                        </div>
                        <FieldDescription>
                          {imageFiles[field.key]?.name || field.help || "Wklej URL albo prześlij plik."}
                        </FieldDescription>
                      </Field>
                    );
                  }

                  return (
                    <Field key={field.key} className={field.fullWidth ? "sm:col-span-2" : ""}>
                      <FieldLabel htmlFor={field.key}>{field.label}</FieldLabel>
                      <Input
                        id={field.key}
                        type={field.type}
                        value={field.type === "number" ? Number(value || 0) : stringValue}
                        min={field.min}
                        max={field.max}
                        maxLength={field.maxLength}
                        placeholder={field.placeholder}
                        onChange={(event) =>
                          updateField(
                            field.key,
                            field.type === "number"
                              ? Number(event.target.value)
                              : event.target.value,
                          )
                        }
                      />
                      <FieldDescription>
                        {field.help || (field.maxLength ? `${stringValue.length}/${field.maxLength} znaków` : "")}
                      </FieldDescription>
                    </Field>
                  );
                })}

                {uploadProgress > 0 ? (
                  <Field className="sm:col-span-2">
                    <FieldLabel>Przesyłanie obrazu</FieldLabel>
                    <Progress value={uploadProgress} />
                    <FieldDescription>{uploadProgress}%</FieldDescription>
                  </Field>
                ) : null}

                <div className="flex justify-end gap-2 border-t pt-5 sm:col-span-2">
                  <Button type="submit" disabled={saving}>
                    <Save data-icon="inline-start" />
                    {saving ? "Zapisywanie…" : "Zapisz zmiany"}
                  </Button>
                </div>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
