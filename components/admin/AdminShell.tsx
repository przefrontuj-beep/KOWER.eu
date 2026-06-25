"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  LogOut,
  Menu,
  Wifi,
  WifiOff,
} from "lucide-react";
import { ADMIN_BASE_PATH, ADMIN_NAVIGATION } from "@/lib/admin/constants";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

function NavigationList({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Nawigacja panelu" className="flex flex-col gap-1">
      {ADMIN_NAVIGATION.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200",
              active
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white/90",
            )}
          >
            {active ? (
              <span
                className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-[#6da44d]"
                aria-hidden="true"
              />
            ) : null}
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.08]">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarLogo() {
  return (
    <div className="relative flex h-20 items-center border-b border-[#2a4a1e]/40 px-5">
      <Image
        src="/logo/kower-logo.png"
        alt="Kower"
        width={146}
        height={48}
        className="relative h-auto w-[134px]"
        priority
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#6da44d]/30 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

function UserSection({
  email,
  onLogout,
}: {
  email: string;
  onLogout: () => void;
}) {
  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="border-t border-[#2a4a1e]/40 p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#487330] text-sm font-semibold text-white">
          {initial}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-white">{email}</p>
          <p className="text-xs text-white/50">Administrator KOWER</p>
        </div>
      </div>
      <Button
        variant="outline"
        className="mt-3 w-full justify-start border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
        onClick={onLogout}
      >
        <LogOut data-icon="inline-start" />
        Wyloguj
      </Button>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, error, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLogin = pathname === `${ADMIN_BASE_PATH}/login`;

  useEffect(() => {
    if (!isLogin && !loading && !user) {
      router.replace(`${ADMIN_BASE_PATH}/login`);
    }
  }, [isLogin, loading, router, user]);

  const currentItem = useMemo(
    () =>
      [...ADMIN_NAVIGATION]
        .reverse()
        .find((item) => pathname.startsWith(item.href)),
    [pathname],
  );

  if (isLogin) {
    return children;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-5 lg:p-8">
        <div className="mx-auto flex max-w-7xl gap-6">
          <Skeleton className="hidden h-[calc(100vh-4rem)] w-64 animate-pulse rounded-xl lg:block" />
          <div className="flex flex-1 flex-col gap-5">
            <Skeleton className="h-16 w-full animate-pulse rounded-xl" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-32 animate-pulse rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-80 w-full animate-pulse rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[#2a4a1e]/40 bg-gradient-to-b from-[#1a2e12] to-[#0f1c0a] lg:flex lg:flex-col">
        <SidebarLogo />

        <div className="flex-1 overflow-y-auto p-3">
          <NavigationList pathname={pathname} />
        </div>

        <UserSection email={user.email ?? ""} onLogout={logout} />
      </aside>

      <div className="lg:pl-64">
        {/* Top header bar */}
        <header className="sticky top-0 z-40 border-b bg-background/94 backdrop-blur-xl">
          <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Otwórz menu panelu"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[88vw] max-w-sm border-[#2a4a1e]/40 bg-gradient-to-b from-[#1a2e12] to-[#0f1c0a] p-0"
              >
                <SheetHeader className="border-b border-[#2a4a1e]/40 p-5 text-left">
                  <SidebarLogo />
                  <SheetTitle className="px-5 pt-2 text-white">Panel KOWER</SheetTitle>
                  <SheetDescription className="px-5 text-white/50">
                    Zarządzanie realizacjami i zdjęciami.
                  </SheetDescription>
                </SheetHeader>
                <div className="overflow-y-auto p-3">
                  <NavigationList pathname={pathname} onNavigate={() => setMobileOpen(false)} />
                </div>
                <UserSection email={user.email ?? ""} onLogout={logout} />
              </SheetContent>
            </Sheet>

            {/* Breadcrumb */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Panel</span>
                <span className="text-muted-foreground/50" aria-hidden="true">·</span>
                <span className="truncate font-medium text-foreground">
                  {currentItem?.label || "Administracja"}
                </span>
              </div>
            </div>

            {/* Firebase badge */}
            {isFirebaseConfigured ? (
              <Badge
                variant="outline"
                className="border-emerald-200 bg-emerald-500/10 text-emerald-700"
              >
                <span className="relative mr-1.5 flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                Firebase połączony
              </Badge>
            ) : (
              <Badge variant="destructive">
                <WifiOff className="mr-1.5 size-3.5" />
                Brak Firebase
              </Badge>
            )}

            <Button asChild variant="outline" className="hidden rounded-full sm:inline-flex">
              <Link href="/" target="_blank">
                Zobacz stronę
                <ExternalLink data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </header>

        {error ? (
          <div className="border-b border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:px-6 lg:px-8">
            {error}
          </div>
        ) : null}

        <main className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
