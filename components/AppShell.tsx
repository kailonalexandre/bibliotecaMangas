import { BookOpen, Download, Heart, LayoutDashboard, LogOut, Search } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/missing", label: "Faltantes", icon: Search },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/export", label: "CSV", icon: Download }
];

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-3 font-bold text-ink">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-white shadow-sm">
              <BookOpen className="h-5 w-5" />
            </span>
            <span>
              <span className="block leading-tight">Mangas Controll</span>
              <span className="hidden text-xs font-medium text-muted sm:block">Biblioteca pessoal</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-muted transition hover:bg-surface hover:text-ink">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted sm:block">{user.name}</span>
            <ThemeToggle />
            <form action="/api/auth/logout" method="post">
              <button className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-surface text-ink shadow-sm transition hover:bg-surface-2" title="Sair">
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 lg:py-8">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-line bg-paper/95 px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="grid place-items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-muted transition hover:bg-surface hover:text-ink">
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
