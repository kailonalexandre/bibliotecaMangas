import { BookOpen } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage({ searchParams }: { searchParams: { error?: string; registered?: string } }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <form action="/api/auth/login" method="post" className="w-full max-w-sm rounded-xl border border-line bg-surface p-6 shadow-soft">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-white">
              <BookOpen className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold">Mangas Controll</h1>
              <p className="text-sm text-muted">Entre na sua biblioteca</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        {searchParams.error ? <p className="mb-4 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">E-mail ou senha invalidos.</p> : null}
        {searchParams.registered ? <p className="mb-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">Conta criada. Entre com seu e-mail e senha.</p> : null}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" defaultValue="ana@example.com" required />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" defaultValue="manga123" required />
          </div>
          <button className="min-h-10 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95">Entrar</button>
          <Link href="/register" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:bg-surface-2">
            Registre-se
          </Link>
        </div>
      </form>
    </main>
  );
}
