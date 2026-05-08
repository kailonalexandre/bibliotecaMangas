import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function LoginPage({ searchParams }: { searchParams: { error?: string; registered?: string } }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <form action="/api/auth/login" method="post" className="w-full max-w-sm rounded-md border border-line bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-accent" />
          <h1 className="text-xl font-bold">Mangas Controll</h1>
        </div>
        {searchParams.error ? <p className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">E-mail ou senha invalidos.</p> : null}
        {searchParams.registered ? <p className="mb-4 rounded-md bg-teal-50 px-3 py-2 text-sm text-accent">Conta criada. Entre com seu e-mail e senha.</p> : null}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" defaultValue="ana@example.com" required />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" defaultValue="manga123" required />
          </div>
          <button className="min-h-10 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white">Entrar</button>
          <Link href="/register" className="text-center text-sm font-semibold text-accent hover:text-teal-800">
            Criar conta com convite
          </Link>
        </div>
      </form>
    </main>
  );
}
