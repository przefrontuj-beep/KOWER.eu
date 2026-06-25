"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Clipboard,
  Download,
  Inbox,
  Mail,
  MoreHorizontal,
  Phone,
  Search,
  Trash2,
} from "lucide-react";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { logAdminActivity } from "@/lib/admin/activity";
import { formatFirestoreDate } from "@/lib/admin/utils";
import type { LeadRecord } from "@/types/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const statusOptions = [
  { value: "new", label: "Nowe" },
  { value: "in_progress", label: "W trakcie" },
  { value: "completed", label: "Zakończone" },
  { value: "spam", label: "Spam" },
] as const;

function statusLabel(status: LeadRecord["status"]) {
  return statusOptions.find((option) => option.value === status)?.label || "Nowe";
}

function statusVariant(status: LeadRecord["status"]) {
  if (status === "new") return "default";
  if (status === "spam") return "destructive";
  return "secondary";
}

export function LeadsManager() {
  const { user } = useAdminAuth();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(Boolean(db));
  const [reloadKey, setReloadKey] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeLead, setActiveLead] = useState<LeadRecord | null>(null);
  const [status, setStatus] = useState<LeadRecord["status"]>("new");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<LeadRecord | null>(null);

  useEffect(() => {
    if (!db) {
      return;
    }
    let cancelled = false;
    const activeDb = db;
    void getDocs(query(collection(activeDb, "leads"), limit(100)))
      .then((snapshot) => {
        if (cancelled) {
          return;
        }
        setLeads(
          snapshot.docs
            .map((document) => ({
              id: document.id,
              ...document.data(),
            }) as LeadRecord)
            .sort((left, right) => {
              const leftSeconds =
                typeof left.createdAt === "object" && left.createdAt && "seconds" in left.createdAt
                  ? Number(left.createdAt.seconds)
                  : 0;
              const rightSeconds =
                typeof right.createdAt === "object" && right.createdAt && "seconds" in right.createdAt
                  ? Number(right.createdAt.seconds)
                  : 0;
              return rightSeconds - leftSeconds;
            }),
        );
      })
      .catch((error) => {
        console.error("Błąd pobierania zgłoszeń:", error);
        toast.error("Nie udało się pobrać zgłoszeń.");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    if (loading || leads.length === 0) {
      return;
    }
    const timer = window.setTimeout(() => {
      const leadId = new URLSearchParams(window.location.search).get("open");
      const lead = leads.find((item) => item.id === leadId);
      if (lead) {
        openLead(lead);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [leads, loading]);

  const filteredLeads = useMemo(() => {
    const search = searchValue.trim().toLocaleLowerCase("pl");
    return leads.filter((lead) => {
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesSearch =
        !search ||
        [lead.name, lead.email, lead.phone, lead.message, lead.scope]
          .join(" ")
          .toLocaleLowerCase("pl")
          .includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [leads, searchValue, statusFilter]);

  function refresh() {
    setLoading(true);
    setReloadKey((value) => value + 1);
  }

  function openLead(lead: LeadRecord) {
    setActiveLead(lead);
    setStatus(lead.status || "new");
    setAdminNote(lead.adminNote || "");
  }

  async function copyValue(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    toast.success(`Skopiowano ${label}.`);
  }

  async function saveLead() {
    if (!db || !user || !activeLead || saving) {
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, "leads", activeLead.id), {
        status,
        adminNote: adminNote.trim(),
        updatedAt: serverTimestamp(),
        updatedBy: user.email || user.uid,
      });
      await logAdminActivity({
        user,
        action: "update",
        entityType: "leads",
        entityId: activeLead.id,
        entityLabel: activeLead.name,
      });
      toast.success("Zapisano status i notatkę.");
      setActiveLead(null);
      refresh();
    } catch (error) {
      console.error("Błąd aktualizacji zgłoszenia:", error);
      toast.error("Nie udało się zapisać zgłoszenia.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteLead() {
    if (!db || !user || !toDelete) {
      return;
    }
    try {
      const token = await user.getIdToken();
      const response = await fetch(
        `/api/admin/attachment?leadId=${encodeURIComponent(toDelete.id)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) {
        const result = (await response.json()) as { message?: string };
        throw new Error(result.message || "Nie udało się usunąć zgłoszenia.");
      }
      await logAdminActivity({
        user,
        action: "delete",
        entityType: "leads",
        entityId: toDelete.id,
        entityLabel: toDelete.name,
      });
      toast.success("Zgłoszenie zostało usunięte.");
      setToDelete(null);
      setActiveLead(null);
      refresh();
    } catch (error) {
      console.error("Błąd usuwania zgłoszenia:", error);
      toast.error("Nie udało się usunąć zgłoszenia.");
    }
  }

  async function downloadAttachment(storagePath: string) {
    if (!user) {
      return;
    }
    try {
      const token = await user.getIdToken();
      const response = await fetch(
        `/api/admin/attachment?path=${encodeURIComponent(storagePath)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = (await response.json()) as { url?: string; message?: string };
      if (!response.ok || !result.url) {
        throw new Error(result.message || "Brak linku do pliku.");
      }
      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Błąd pobierania załącznika:", error);
      toast.error("Nie udało się otworzyć załącznika.");
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Obsługa klienta"
        title="Zgłoszenia"
        description="Wiadomości z formularzy, załączniki, status obsługi i prywatne notatki administratora."
        icon={Inbox}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle>Skrzynka zgłoszeń</CardTitle>
              <CardDescription>{filteredLeads.length} wyników</CardDescription>
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(240px,1fr)_180px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  className="pl-9"
                  placeholder="Szukaj zgłoszenia…"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Wszystkie statusy</SelectItem>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-24" />
            ))
          ) : filteredLeads.length > 0 ? (
            filteredLeads.map((lead) => (
              <button
                key={lead.id}
                type="button"
                onClick={() => openLead(lead)}
                className="flex w-full flex-col gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-muted/50 sm:flex-row sm:items-center"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{lead.name}</p>
                    <Badge variant={statusVariant(lead.status)}>
                      {statusLabel(lead.status)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatFirestoreDate(lead.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {lead.message}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {lead.attachments?.length || 0} zał.
                  <MoreHorizontal />
                </div>
              </button>
            ))
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Inbox />
                </EmptyMedia>
                <EmptyTitle>Brak zgłoszeń</EmptyTitle>
                <EmptyDescription>
                  Nowe wiadomości z formularza pojawią się tutaj.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>

      <Sheet
        open={Boolean(activeLead)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveLead(null);
          }
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {activeLead ? (
            <>
              <SheetHeader>
                <SheetTitle>{activeLead.name}</SheetTitle>
                <SheetDescription>
                  {formatFirestoreDate(activeLead.createdAt)} · {activeLead.topic || activeLead.scope}
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-6 px-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => copyValue(activeLead.phone, "telefon")}
                    disabled={!activeLead.phone}
                  >
                    <Phone data-icon="inline-start" />
                    {activeLead.phone || "Brak telefonu"}
                    <Clipboard data-icon="inline-end" />
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => copyValue(activeLead.email, "e-mail")}
                  >
                    <Mail data-icon="inline-start" />
                    <span className="truncate">{activeLead.email}</span>
                    <Clipboard data-icon="inline-end" />
                  </Button>
                </div>

                <section className="rounded-xl border bg-muted/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Wiadomość
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7">
                    {activeLead.message}
                  </p>
                </section>

                {activeLead.attachments?.length > 0 ? (
                  <section>
                    <h3 className="font-serif text-xl font-semibold">Załączniki</h3>
                    <div className="mt-3 flex flex-col gap-2">
                      {activeLead.attachments.map((attachment) => (
                        <div
                          key={`${attachment.name}-${attachment.size}`}
                          className="flex items-center justify-between gap-3 rounded-lg border p-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{attachment.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {Math.round(attachment.size / 1024)} KB · {attachment.type}
                            </p>
                          </div>
                          {attachment.storagePath ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadAttachment(attachment.storagePath as string)}
                            >
                              <Download data-icon="inline-start" />
                              Otwórz
                            </Button>
                          ) : (
                            <Badge variant="secondary">Tylko w e-mailu</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="lead-status">Status</FieldLabel>
                    <Select
                      value={status}
                      onValueChange={(value) => setStatus(value as LeadRecord["status"])}
                    >
                      <SelectTrigger id="lead-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lead-note">Notatka administratora</FieldLabel>
                    <Textarea
                      id="lead-note"
                      rows={5}
                      maxLength={2000}
                      value={adminNote}
                      onChange={(event) => setAdminNote(event.target.value)}
                    />
                    <FieldDescription>{adminNote.length}/2000 znaków</FieldDescription>
                  </Field>
                </FieldGroup>
              </div>

              <SheetFooter className="border-t">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Więcej</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onSelect={() => {
                          setStatus("completed");
                          toast.info("Status ustawiono na „Zakończone”. Zapisz zmiany.");
                        }}
                      >
                        <Check />
                        Oznacz jako obsłużone
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => setToDelete(activeLead)}
                      >
                        <Trash2 />
                        Usuń
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={saveLead} disabled={saving}>
                  {saving ? "Zapisywanie…" : "Zapisz zmiany"}
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Czy usunąć zgłoszenie?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta operacja jest trwała. Załączniki przechowywane w Storage należy usuwać zgodnie z polityką retencji danych.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={deleteLead}>
              Usuń zgłoszenie
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
