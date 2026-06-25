"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  FilePlus2,
  ImagePlus,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  UploadCloud,
} from "lucide-react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import { logAdminActivity } from "@/lib/admin/activity";
import { deleteAdminImage, uploadAdminImage } from "@/lib/admin/image-upload";
import { slugify, slugToDocumentId } from "@/lib/admin/utils";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import type { AdminRecord, ContentStatus } from "@/types/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export type EntityField = {
  key: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "email"
    | "tel"
    | "url"
    | "select"
    | "switch"
    | "image"
    | "status";
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  help?: string;
  options?: ReadonlyArray<{ value: string; label: string }>;
  fullWidth?: boolean;
};

type FormValue = string | number | boolean;
type FormState = Record<string, FormValue>;

type EntityManagerProps = {
  collectionName: string;
  entityName: string;
  entityNamePlural: string;
  title: string;
  description: string;
  fields: EntityField[];
  defaultValues: FormState;
  primaryField: string;
  secondaryField?: string;
  searchFields: string[];
  publicBasePath?: string;
  seedItems?: Array<Record<string, unknown>>;
  filterRecord?: (record: AdminRecord) => boolean;
  maxItems?: number;
};

const pageSize = 12;

function getRecordLabel(record: AdminRecord, primaryField: string) {
  const value = record[primaryField];
  return typeof value === "string" && value.trim() ? value : "Bez nazwy";
}

function getString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" ? value : "";
}

function getNumber(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "number" ? value : Number(value) || 0;
}

function getBoolean(record: Record<string, unknown>, key: string) {
  return record[key] === true;
}

function normalizeForm(
  record: Record<string, unknown>,
  fields: EntityField[],
  defaults: FormState,
) {
  const result: FormState = { ...defaults };
  for (const field of fields) {
    if (field.type === "switch") {
      result[field.key] = getBoolean(record, field.key);
    } else if (field.type === "number") {
      result[field.key] = getNumber(record, field.key);
    } else {
      result[field.key] = getString(record, field.key);
    }
  }
  return result;
}

export function EntityManager({
  collectionName,
  entityName,
  entityNamePlural,
  title,
  description,
  fields,
  defaultValues,
  primaryField,
  secondaryField,
  searchFields,
  publicBasePath,
  seedItems = [],
  filterRecord,
  maxItems = 120,
}: EntityManagerProps) {
  const { user } = useAdminAuth();
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(Boolean(db));
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AdminRecord | null>(null);
  const [form, setForm] = useState<FormState>(defaultValues);
  const [imageFiles, setImageFiles] = useState<Record<string, File>>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recordToDelete, setRecordToDelete] = useState<AdminRecord | null>(null);

  useEffect(() => {
    if (!db) {
      return;
    }

    let cancelled = false;
    const activeDb = db;
    void getDocs(query(collection(activeDb, collectionName), limit(maxItems)))
      .then((snapshot) => {
        if (cancelled) {
          return;
        }

        const nextRecords = snapshot.docs
          .map((document) => ({
            id: document.id,
            ...document.data(),
          }) as AdminRecord)
          .filter((record) => (filterRecord ? filterRecord(record) : true))
          .sort((left, right) => {
            const leftOrder = typeof left.order === "number" ? left.order : 9999;
            const rightOrder = typeof right.order === "number" ? right.order : 9999;
            if (leftOrder !== rightOrder) {
              return leftOrder - rightOrder;
            }
            return getRecordLabel(left, primaryField).localeCompare(
              getRecordLabel(right, primaryField),
              "pl",
            );
          });
        setRecords(nextRecords);
      })
      .catch((error) => {
        console.error(`Błąd pobierania kolekcji ${collectionName}:`, error);
        if (!cancelled) {
          toast.error(`Nie udało się pobrać: ${entityNamePlural.toLowerCase()}.`);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [collectionName, entityNamePlural, filterRecord, maxItems, primaryField, reloadKey]);

  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLocaleLowerCase("pl");
    if (!normalizedSearch) {
      return records;
    }

    return records.filter((record) =>
      searchFields.some((field) =>
        String(record[field] || "")
          .toLocaleLowerCase("pl")
          .includes(normalizedSearch),
      ),
    );
  }, [records, searchFields, searchValue]);

  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const visibleRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);

  function refresh() {
    setLoading(true);
    setReloadKey((value) => value + 1);
  }

  function openNew() {
    setEditingRecord(null);
    setForm(defaultValues);
    setImageFiles({});
    setUploadProgress(0);
    setFormOpen(true);
  }

  function openEdit(record: AdminRecord) {
    setEditingRecord(record);
    setForm(normalizeForm(record, fields, defaultValues));
    setImageFiles({});
    setUploadProgress(0);
    setFormOpen(true);
  }

  function updateField(key: string, value: FormValue) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    for (const field of fields) {
      const value = form[field.key];
      if (
        field.required &&
        (value === undefined ||
          value === null ||
          (typeof value === "string" && !value.trim()))
      ) {
        toast.error(`Pole „${field.label}” jest wymagane.`);
        return false;
      }

      if (
        field.maxLength &&
        typeof value === "string" &&
        value.length > field.maxLength
      ) {
        toast.error(`Pole „${field.label}” może mieć maksymalnie ${field.maxLength} znaków.`);
        return false;
      }
    }

    const slug = typeof form.slug === "string" ? form.slug.trim() : "";
    if (
      slug &&
      records.some(
        (record) =>
          record.id !== editingRecord?.id &&
          typeof record.slug === "string" &&
          record.slug === slug,
      )
    ) {
      toast.error("Ten slug jest już używany. Wybierz inny.");
      return false;
    }

    return true;
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !user || saving || !validate()) {
      return;
    }

    setSaving(true);
    try {
      const titleValue = String(form[primaryField] || entityName);
      const slugValue =
        typeof form.slug === "string" && form.slug.trim()
          ? slugify(form.slug)
          : slugify(titleValue);
      const documentId =
        editingRecord?.id ||
        (slugValue ? slugToDocumentId(slugValue) : doc(collection(db, collectionName)).id);
      const payload: Record<string, unknown> = {
        ...form,
        ...(Object.prototype.hasOwnProperty.call(form, "slug")
          ? { slug: slugValue }
          : {}),
        updatedAt: serverTimestamp(),
        updatedBy: user.email || user.uid,
      };

      if (!editingRecord) {
        payload.createdAt = serverTimestamp();
        payload.createdBy = user.email || user.uid;
      }

      for (const field of fields.filter((item) => item.type === "image")) {
        const file = imageFiles[field.key];
        if (!file) {
          continue;
        }

        const uploaded = await uploadAdminImage(file, {
          folder: `${collectionName}/${documentId}`,
          label: `${titleValue}-${field.key}`,
          onProgress: setUploadProgress,
        });
        payload[field.key] = uploaded.imageUrl;
        payload[`${field.key}Thumbnail`] = uploaded.thumbnailUrl;
        payload[`${field.key}Path`] = uploaded.storagePath;
        payload[`${field.key}ThumbnailPath`] = uploaded.thumbnailStoragePath;
      }

      await setDoc(doc(db, collectionName, documentId), payload, { merge: true });
      await logAdminActivity({
        user,
        action: editingRecord ? "update" : "create",
        entityType: collectionName,
        entityId: documentId,
        entityLabel: titleValue,
      });

      toast.success(editingRecord ? "Zapisano zmiany." : `Dodano: ${entityName.toLowerCase()}.`);
      setFormOpen(false);
      refresh();
    } catch (error) {
      console.error(`Błąd zapisu ${collectionName}:`, error);
      toast.error("Nie udało się zapisać zmian. Spróbuj ponownie.");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  }

  async function handleDelete() {
    if (!db || !user || !recordToDelete) {
      return;
    }

    try {
      const imagePaths = fields
        .filter((field) => field.type === "image")
        .flatMap((field) => [
          getString(recordToDelete, `${field.key}Path`),
          getString(recordToDelete, `${field.key}ThumbnailPath`),
        ]);
      await deleteAdminImage(imagePaths);
      await deleteDoc(doc(db, collectionName, recordToDelete.id));
      await logAdminActivity({
        user,
        action: "delete",
        entityType: collectionName,
        entityId: recordToDelete.id,
        entityLabel: getRecordLabel(recordToDelete, primaryField),
      });
      toast.success("Element został usunięty.");
      setRecordToDelete(null);
      refresh();
    } catch (error) {
      console.error(`Błąd usuwania ${collectionName}:`, error);
      toast.error("Nie udało się usunąć elementu.");
    }
  }

  async function handleSeed() {
    if (!db || !user || seedItems.length === 0) {
      return;
    }

    setSaving(true);
    try {
      const batch = writeBatch(db);
      for (const item of seedItems.slice(0, 450)) {
        const itemSlug =
          typeof item.slug === "string"
            ? slugToDocumentId(item.slug)
            : slugToDocumentId(String(item[primaryField] || ""));
        const itemRef = doc(db, collectionName, itemSlug || doc(collection(db, collectionName)).id);
        batch.set(
          itemRef,
          {
            ...item,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdBy: user.email || user.uid,
            updatedBy: user.email || user.uid,
          },
          { merge: true },
        );
      }
      await batch.commit();
      await logAdminActivity({
        user,
        action: "create",
        entityType: collectionName,
        entityId: "initial-import",
        entityLabel: `Import ${seedItems.length} rekordów`,
      });
      toast.success("Zaimportowano istniejące treści projektu.");
      refresh();
    } catch (error) {
      console.error(`Błąd importu ${collectionName}:`, error);
      toast.error("Nie udało się zaimportować istniejących treści.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Zarządzanie treścią"
        title={title}
        description={description}
        icon={FilePlus2}
        actions={
          <Button onClick={openNew}>
            <FilePlus2 data-icon="inline-start" />
            Dodaj {entityName.toLowerCase()}
          </Button>
        }
      />

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>{entityNamePlural}</CardTitle>
            <CardDescription>
              {filteredRecords.length} elementów · maksymalnie {maxItems} pobieranych na widok
            </CardDescription>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value);
                setPage(1);
              }}
              className="pl-9"
              placeholder={`Szukaj: ${entityNamePlural.toLowerCase()}…`}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-14" />
              ))}
            </div>
          ) : visibleRecords.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nazwa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Kolejność</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleRecords.map((record) => {
                    const imageField = fields.find((field) => field.type === "image");
                    const imageUrl = imageField ? getString(record, imageField.key) : "";
                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex min-w-[220px] items-center gap-3">
                            {imageUrl ? (
                              <span className="relative size-10 shrink-0 overflow-hidden rounded-lg border bg-muted">
                                <Image
                                  src={imageUrl}
                                  alt=""
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </span>
                            ) : null}
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {getRecordLabel(record, primaryField)}
                              </p>
                              {secondaryField ? (
                                <p className="max-w-md truncate text-xs text-muted-foreground">
                                  {String(record[secondaryField] || "")}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={(record.status as ContentStatus) || "draft"} />
                        </TableCell>
                        <TableCell>{typeof record.order === "number" ? record.order : "—"}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" aria-label="Otwórz akcje">
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuGroup>
                                <DropdownMenuItem onSelect={() => openEdit(record)}>
                                  <Pencil />
                                  Edytuj
                                </DropdownMenuItem>
                                {publicBasePath && record.slug ? (
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`${publicBasePath}/${record.slug}`.replaceAll("//", "/")}
                                      target="_blank"
                                    >
                                      <ExternalLink />
                                      Podgląd strony
                                    </Link>
                                  </DropdownMenuItem>
                                ) : null}
                                <DropdownMenuItem
                                  variant="destructive"
                                  onSelect={() => setRecordToDelete(record)}
                                >
                                  <Trash2 />
                                  Usuń
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {pageCount > 1 ? (
                <Pagination className="mt-5">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        text="Poprzednia"
                        aria-disabled={page === 1}
                        onClick={(event) => {
                          event.preventDefault();
                          setPage((current) => Math.max(1, current - 1));
                        }}
                      />
                    </PaginationItem>
                    <PaginationItem className="px-3 text-sm text-muted-foreground">
                      {page} / {pageCount}
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        text="Następna"
                        aria-disabled={page === pageCount}
                        onClick={(event) => {
                          event.preventDefault();
                          setPage((current) => Math.min(pageCount, current + 1));
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              ) : null}
            </>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FilePlus2 />
                </EmptyMedia>
                <EmptyTitle>Brak elementów</EmptyTitle>
                <EmptyDescription>
                  Dodaj pierwszy element albo zaimportuj treści, które już istnieją w projekcie.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="flex-row justify-center">
                <Button onClick={openNew}>
                  <FilePlus2 data-icon="inline-start" />
                  Dodaj
                </Button>
                {seedItems.length > 0 ? (
                  <Button variant="outline" onClick={handleSeed} disabled={saving}>
                    <UploadCloud data-icon="inline-start" />
                    Importuj istniejące
                  </Button>
                ) : null}
              </EmptyContent>
            </Empty>
          )}
        </CardContent>
      </Card>

      <Sheet open={formOpen} onOpenChange={setFormOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              {editingRecord ? `Edytuj: ${getRecordLabel(editingRecord, primaryField)}` : `Dodaj ${entityName.toLowerCase()}`}
            </SheetTitle>
            <SheetDescription>
              Pola są walidowane przed zapisem. Zmiany szkicu nie pojawią się publicznie.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSave} className="flex flex-1 flex-col">
            <FieldGroup className="grid grid-cols-1 gap-5 px-4 sm:grid-cols-2">
              {fields.map((field) => {
                const stringValue =
                  typeof form[field.key] === "string" ? String(form[field.key]) : "";
                const invalid = Boolean(
                  field.required && !String(form[field.key] ?? "").trim(),
                );

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
                        checked={Boolean(form[field.key])}
                        onCheckedChange={(checked) => updateField(field.key, checked)}
                      />
                    </Field>
                  );
                }

                if (field.type === "textarea") {
                  return (
                    <Field
                      key={field.key}
                      data-invalid={invalid || undefined}
                      className={field.fullWidth ? "sm:col-span-2" : ""}
                    >
                      <FieldLabel htmlFor={field.key}>{field.label}</FieldLabel>
                      <Textarea
                        id={field.key}
                        value={stringValue}
                        maxLength={field.maxLength}
                        rows={field.key.toLowerCase().includes("content") ? 10 : 5}
                        placeholder={field.placeholder}
                        aria-invalid={invalid || undefined}
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
                        onValueChange={(value) => updateField(field.key, value)}
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
                      {field.help ? <FieldDescription>{field.help}</FieldDescription> : null}
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
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="sr-only"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                setImageFiles((current) => ({ ...current, [field.key]: file }));
                              }
                            }}
                          />
                        </label>
                      </div>
                      {imageFiles[field.key] ? (
                        <FieldDescription>Wybrano: {imageFiles[field.key].name}</FieldDescription>
                      ) : field.help ? (
                        <FieldDescription>{field.help}</FieldDescription>
                      ) : null}
                    </Field>
                  );
                }

                return (
                  <Field
                    key={field.key}
                    data-invalid={invalid || undefined}
                    className={field.fullWidth ? "sm:col-span-2" : ""}
                  >
                    <FieldLabel htmlFor={field.key}>{field.label}</FieldLabel>
                    <Input
                      id={field.key}
                      type={field.type}
                      value={
                        field.type === "number"
                          ? Number(form[field.key] || 0)
                          : stringValue
                      }
                      min={field.min}
                      max={field.max}
                      maxLength={field.maxLength}
                      placeholder={field.placeholder}
                      aria-invalid={invalid || undefined}
                      onChange={(event) => {
                        const nextValue =
                          field.type === "number"
                            ? Number(event.target.value)
                            : event.target.value;
                        updateField(field.key, nextValue);
                        if (
                          field.key === primaryField &&
                          Object.prototype.hasOwnProperty.call(form, "slug") &&
                          !editingRecord
                        ) {
                          updateField("slug", slugify(event.target.value));
                        }
                      }}
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
            </FieldGroup>

            <SheetFooter className="border-t">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Anuluj
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Zapisywanie…" : "Zapisz zmiany"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={Boolean(recordToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setRecordToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy na pewno chcesz usunąć ten element?</AlertDialogTitle>
            <AlertDialogDescription>
              Usunięcie jest trwałe. Powiązane obrazy przesłane przez panel również zostaną usunięte ze Storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Usuń trwale
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
