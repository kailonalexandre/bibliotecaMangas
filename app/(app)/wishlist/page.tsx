import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function WishlistPage() {
  await requireUser();
  const mangas = await prisma.manga.findMany({
    where: { OR: [{ status: "WISHLIST" }, { volumes: { some: { owned: false } } }] },
    include: { volumes: { orderBy: { number: "asc" } } },
    orderBy: { title: "asc" }
  });

  return (
    <div className="grid gap-5">
      <h1 className="text-3xl font-bold tracking-tight">Wishlist</h1>
      {mangas.length ? <div className="grid gap-3 md:grid-cols-2">
        {mangas.map((manga) => {
          const wanted = manga.status === "WISHLIST" ? "Titulo desejado" : `Volumes desejados: ${manga.volumes.filter((volume) => !volume.owned).map((volume) => volume.number).join(", ")}`;
          return (
            <Link href={`/mangas/${manga.id}`} key={manga.id} className="rounded-xl border border-line bg-surface p-4 shadow-soft transition hover:border-accent/60">
              <h2 className="font-semibold">{manga.title}</h2>
              <p className="mt-2 text-sm text-muted">{wanted}</p>
            </Link>
          );
        })}
      </div> : <EmptyState title="Wishlist vazia" description="Quando marcar titulos ou volumes desejados, eles aparecem aqui." />}
    </div>
  );
}
