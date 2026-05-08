import { MangaForm } from "@/components/MangaForm";
import { requireUser } from "@/lib/auth";

export default async function NewMangaPage() {
  await requireUser();
  return (
    <div className="grid gap-5">
      <h1 className="text-3xl font-bold tracking-tight">Novo manga</h1>
      <MangaForm />
    </div>
  );
}
