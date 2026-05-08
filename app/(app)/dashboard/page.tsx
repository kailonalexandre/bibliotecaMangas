import { Prisma } from "@prisma/client";
import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { MangaCard } from "@/components/MangaCard";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  await requireUser();
  const where: Prisma.MangaWhereInput = {};
  const q = searchParams.q?.trim();
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { author: { contains: q, mode: "insensitive" } },
      { publisher: { contains: q, mode: "insensitive" } }
    ];
  }
  if (searchParams.status) where.status = searchParams.status as any;

  const mangas = await prisma.manga.findMany({ where, include: { volumes: { orderBy: { number: "asc" } } }, orderBy: { title: "asc" } });
  const filtered = mangas.filter((manga) => {
    const total = manga.totalVolumes || manga.volumes.length;
    const owned = manga.volumes.filter((volume) => volume.owned).length;
    if (searchParams.complete === "complete" && owned < total) return false;
    if (searchParams.complete === "incomplete" && total && owned >= total) return false;
    if (searchParams.read === "read" && manga.volumes.some((volume) => volume.owned && !volume.read)) return false;
    if (searchParams.read === "unread" && !manga.volumes.some((volume) => volume.owned && !volume.read)) return false;
    return true;
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Colecao</h1>
          <p className="mt-1 text-sm text-muted">{filtered.length} titulos encontrados</p>
        </div>
        <ButtonLink href="/mangas/new">
          <Plus className="h-4 w-4" />
          Novo manga
        </ButtonLink>
      </div>
      <form className="grid gap-3 rounded-xl border border-line bg-surface p-3 shadow-soft md:grid-cols-[1fr_160px_170px_150px_auto]">
        <input name="q" placeholder="Titulo, autor ou editora" defaultValue={searchParams.q || ""} />
        <select name="status" defaultValue={searchParams.status || ""}>
          <option value="">Todos status</option>
          <option value="COLLECTING">Colecionando</option>
          <option value="COMPLETE">Completo</option>
          <option value="PAUSED">Pausado</option>
          <option value="SOLD">Vendido</option>
          <option value="WISHLIST">Wishlist</option>
        </select>
        <select name="complete" defaultValue={searchParams.complete || ""}>
          <option value="">Completo/incompleto</option>
          <option value="complete">Colecao completa</option>
          <option value="incomplete">Colecao incompleta</option>
        </select>
        <select name="read" defaultValue={searchParams.read || ""}>
          <option value="">Leitura</option>
          <option value="read">Tudo lido</option>
          <option value="unread">Tem nao lido</option>
        </select>
        <button className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:opacity-90">Filtrar</button>
      </form>
      {filtered.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((manga) => <MangaCard key={manga.id} manga={manga} />)}
        </section>
      ) : (
        <EmptyState title="Nenhum manga encontrado" description="Cadastre seu primeiro titulo ou ajuste os filtros para ver sua colecao." actionHref="/mangas/new" actionLabel="Novo manga" />
      )}
    </div>
  );
}
