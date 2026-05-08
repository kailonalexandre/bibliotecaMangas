import { Download } from "lucide-react";
import { ButtonLink } from "@/components/Button";
import { requireUser } from "@/lib/auth";

export default async function ExportPage() {
  await requireUser();
  return (
    <div className="grid gap-4 rounded-xl border border-line bg-surface p-5 shadow-soft">
      <h1 className="text-3xl font-bold tracking-tight">Exportacao CSV</h1>
      <p className="max-w-2xl text-sm leading-6 text-muted">Baixe um arquivo com titulos e volumes, incluindo status de posse, leitura e emprestimo.</p>
      <ButtonLink href="/api/export" className="w-fit">
        <Download className="h-4 w-4" />
        Baixar CSV
      </ButtonLink>
    </div>
  );
}
