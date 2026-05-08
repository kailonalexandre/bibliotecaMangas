import { BookOpen, Download, Heart, LayoutDashboard, LogOut, Search } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/missing", label: "Faltantes", icon: Search },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/export", label: "CSV", icon: Download }
];

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-ink">
            <BookOpen className="h-5 w-5 text-accent" />
            Mangas Controll
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-stone-600 sm:block">{user.name}</span>
            <form action="/api/auth/logout" method="post">
              <button className="grid h-10 w-10 place-items-center rounded-md border border-line bg-white text-ink" title="Sair">
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex min-w-fit items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-white">
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
