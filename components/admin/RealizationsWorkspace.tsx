"use client";

import { GalleryHorizontalEnd, Home, Images, Sparkles } from "lucide-react";
import { RealizationsManager } from "@/components/admin/RealizationsManager";
import { VisibilityOrderManager } from "@/components/admin/VisibilityOrderManager";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function RealizationsWorkspace() {
  return (
    <Tabs defaultValue="realizations" className="gap-6">
      <div className="rounded-2xl border bg-card/70 p-2 shadow-sm">
        <TabsList className="grid h-auto w-full grid-cols-1 gap-2 bg-transparent p-0 sm:grid-cols-3">
          <TabsTrigger
            value="realizations"
            className="h-auto justify-start gap-3 rounded-xl border bg-background px-4 py-3 text-left data-active:border-primary/30 data-active:bg-primary/10"
          >
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold">Realizacje</span>
              <span className="block text-xs text-muted-foreground">Dodawanie, opisy i zdjęcia</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="homepage"
            className="h-auto justify-start gap-3 rounded-xl border bg-background px-4 py-3 text-left data-active:border-primary/30 data-active:bg-primary/10"
          >
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Home aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold">Strona główna</span>
              <span className="block text-xs text-muted-foreground">Karuzela i kolejność zdjęć</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="gallery"
            className="h-auto justify-start gap-3 rounded-xl border bg-background px-4 py-3 text-left data-active:border-primary/30 data-active:bg-primary/10"
          >
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GalleryHorizontalEnd aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold">Galeria realizacji</span>
              <span className="block text-xs text-muted-foreground">Widoczność podstrony realizacji</span>
            </span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="realizations">
        <RealizationsManager />
      </TabsContent>
      <TabsContent value="homepage">
        <VisibilityOrderManager mode="homepage" />
      </TabsContent>
      <TabsContent value="gallery">
        <VisibilityOrderManager mode="gallery" />
      </TabsContent>

      <div className="rounded-2xl border bg-muted/35 p-4 text-sm text-muted-foreground">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-background text-primary">
            <Images aria-hidden="true" />
          </span>
          <p>
            Wszystkie najważniejsze zadania są teraz w jednej zakładce panelu:
            realizacje, upload zdjęć, karuzela strony głównej i kolejność galerii.
          </p>
        </div>
      </div>
    </Tabs>
  );
}
