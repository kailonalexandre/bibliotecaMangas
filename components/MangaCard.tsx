import { BookMarked } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { collectionStats, statusLabels, type MangaWithVolumes } from "@/lib/manga";

export function MangaCard({ manga }: { manga: MangaWithVolumes }) {
  const stats = collectionStats(manga);

  const complete = stats.total > 0 && stats.owned >= stats.total;

  return (
    <Link href={`/mangas/${manga.id}`} className="group grid grid-cols-[96px_1fr] gap-4 rounded-xl border border-line bg-surface p-3 shadow-soft transition hover:-translate-y-0.5 hover:border-accent/60">
      <div className="aspect-[2/3] overflow-hidden rounded-lg bg-surface-2 shadow-sm">
        {manga.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={manga.coverUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-muted">
            <BookMarked className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h2 className="line-clamp-2 font-semibold leading-tight text-ink group-hover:text-accent">{manga.title}</h2>
          <Badge variant={complete ? "success" : "accent"}>{complete ? "Completo" : statusLabels[manga.status]}</Badge>
        </div>
        <p className="mt-1 truncate text-sm text-muted">{manga.author || "Autor nao informado"}</p>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>{stats.owned}/{stats.total || "?"} volumes</span>
            <span>{stats.percent}%</span>
          </div>
          <div className="h-2 rounded-full bg-surface-2">
            <div className="h-2 rounded-full bg-accent" style={{ width: `${stats.percent}%` }} />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">{stats.read} lidos · {stats.missing} faltantes</p>
      </div>
    </Link>
  );
}
