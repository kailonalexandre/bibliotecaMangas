import { BookMarked } from "lucide-react";
import Link from "next/link";
import { collectionStats, statusLabels, type MangaWithVolumes } from "@/lib/manga";

export function MangaCard({ manga }: { manga: MangaWithVolumes }) {
  const stats = collectionStats(manga);

  return (
    <Link href={`/mangas/${manga.id}`} className="group grid grid-cols-[92px_1fr] gap-3 rounded-md border border-line bg-white p-3 transition hover:border-accent/60 hover:shadow-sm">
      <div className="aspect-[2/3] overflow-hidden rounded-md bg-stone-100">
        {manga.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={manga.coverUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-stone-400">
            <BookMarked className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h2 className="line-clamp-2 font-semibold leading-tight text-ink group-hover:text-accent">{manga.title}</h2>
          <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-semibold text-accent">{statusLabels[manga.status]}</span>
        </div>
        <p className="mt-1 truncate text-sm text-stone-600">{manga.author || "Autor nao informado"}</p>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-stone-600">
            <span>{stats.owned}/{stats.total || "?"} volumes</span>
            <span>{stats.percent}%</span>
          </div>
          <div className="h-2 rounded-full bg-stone-100">
            <div className="h-2 rounded-full bg-accent" style={{ width: `${stats.percent}%` }} />
          </div>
        </div>
        <p className="mt-3 text-xs text-stone-500">{stats.read} lidos · {stats.missing} faltantes</p>
      </div>
    </Link>
  );
}
