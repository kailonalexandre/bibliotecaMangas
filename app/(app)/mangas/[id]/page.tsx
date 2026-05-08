import { notFound } from "next/navigation";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/Badge";
import { ButtonLink } from "@/components/Button";
import { MangaForm } from "@/components/MangaForm";
import { VolumeToggle } from "@/components/VolumeToggle";
import { collectionStats, conditionLabels, statusLabels } from "@/lib/manga";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function MangaDetailPage({ params, searchParams }: { params: { id: string }; searchParams: { edit?: string } }) {
  await requireUser();
  const manga = await prisma.manga.findUnique({ where: { id: params.id }, include: { volumes: { orderBy: { number: "asc" } } } });
  if (!manga) notFound();
  const stats = collectionStats(manga);

  if (searchParams.edit === "1") {
    return (
      <div className="grid gap-5">
        <h1 className="text-3xl font-bold tracking-tight">Editar manga</h1>
        <MangaForm manga={manga} />
      </div>
    );
  }

  return (
    <div className="grid gap-7">
      <section className="grid gap-5 rounded-2xl border border-line bg-surface p-4 shadow-soft md:grid-cols-[200px_1fr] md:p-5">
        <div className="aspect-[2/3] overflow-hidden rounded-xl border border-line bg-surface-2 shadow-sm">
          {manga.coverUrl ? <img src={manga.coverUrl} alt="" className="h-full w-full object-cover" /> : null}
        </div>
        <div className="grid content-start gap-4">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant="accent">{statusLabels[manga.status]}</Badge>
              <Badge>{stats.owned}/{stats.total || "?"} volumes</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{manga.title}</h1>
            <p className="mt-1 text-muted">{manga.originalTitle || ""}</p>
          </div>
          <p className="text-sm text-muted">{manga.author || "Autor nao informado"} · {manga.publisher || "Editora nao informada"}</p>
          {manga.description ? <p className="max-w-3xl text-sm leading-6 text-muted">{manga.description}</p> : null}
          {manga.notes ? <p className="rounded-xl border border-line bg-surface-2 p-3 text-sm text-muted">{manga.notes}</p> : null}
          <div className="flex flex-wrap gap-2">
            <ButtonLink href={`/mangas/${manga.id}?edit=1`} variant="secondary">
              <Edit className="h-4 w-4" />
              Editar
            </ButtonLink>
            <form action={`/api/mangas/${manga.id}/volumes/generate`} method="post">
              <button className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95">
                <PlusCircle className="h-4 w-4" />
                Gerar volumes
              </button>
            </form>
            <form action={`/api/mangas/${manga.id}`} method="post">
              <input type="hidden" name="_method" value="DELETE" />
              <button className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-berry px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95">
                <Trash2 className="h-4 w-4" />
                Excluir
              </button>
            </form>
          </div>
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-bold">Volumes</h2>
        <div className="grid gap-2">
          {manga.volumes.map((volume) => (
            <article key={volume.id} className="grid gap-3 rounded-xl border border-line bg-surface p-3 shadow-sm md:grid-cols-[90px_1fr_170px] md:items-center">
              <div className="font-semibold">Vol. {volume.number}</div>
              <div className="flex flex-wrap gap-4">
                <VolumeToggle id={volume.id} name="owned" checked={volume.owned} label="Possuido" />
                <VolumeToggle id={volume.id} name="read" checked={volume.read} label="Lido" />
                <VolumeToggle id={volume.id} name="borrowed" checked={volume.borrowed} label="Emprestado" />
              </div>
              <p className="text-sm text-muted">{conditionLabels[volume.condition]}{volume.borrowedTo ? ` · com ${volume.borrowedTo}` : ""}</p>
            </article>
          ))}
          {!manga.volumes.length ? <p className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">Nenhum volume criado. Use gerar volumes.</p> : null}
        </div>
      </section>
    </div>
  );
}
