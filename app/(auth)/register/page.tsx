import { BookOpen } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const errorMessages: Record<string, string> = {
  invalid: "Nao foi possivel criar a conta. Verifique os dados e tente novamente.",
  weak: "A senha nao atende aos requisitos minimos.",
  rate: "Muitas tentativas. Tente novamente mais tarde.",
  config: "Registro indisponivel. Configure o codigo de convite no servidor."
};

export default function RegisterPage({ searchParams }: { searchParams: { error?: string } }) {
  const message = searchParams.error ? errorMessages[searchParams.error] || errorMessages.invalid : "";

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <form action="/api/auth/register" method="post" className="w-full max-w-md rounded-xl border border-line bg-surface p-6 shadow-soft">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-white">
              <BookOpen className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold">Criar conta</h1>
              <p className="text-sm text-muted">Cadastro protegido por convite.</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {message ? <p className="mb-4 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">{message}</p> : null}

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="name">Nome</label>
            <input id="name" name="name" autoComplete="name" required />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" autoComplete="new-password" minLength={10} required />
            <p className="text-xs leading-5 text-muted">Minimo 10 caracteres, letra maiuscula, letra minuscula, numero e caractere especial.</p>
          </div>
          <div className="grid gap-2">
            <label htmlFor="confirmPassword">Confirmar senha</label>
            <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={10} required />
          </div>
          <div className="grid gap-2">
            <label htmlFor="inviteCode">Codigo de convite</label>
            <input id="inviteCode" name="inviteCode" type="password" autoComplete="off" required />
          </div>
          <button className="min-h-10 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95">Criar conta</button>
          <Link href="/login" className="text-center text-sm font-semibold text-accent hover:text-teal-800">
            Voltar ao login
          </Link>
        </div>
      </form>
    </main>
  );
}
