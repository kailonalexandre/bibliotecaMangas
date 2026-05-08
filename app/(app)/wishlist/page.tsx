import Link from "next/link";
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
      <h1 className="text-2xl font-bold">Wishlist</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {mangas.map((manga) => {
          const wanted = manga.status === "WISHLIST" ? "Titulo desejado" : `Volumes desejados: ${manga.volumes.filter((volume) => !volume.owned).map((volume) => volume.number).join(", ")}`;
          return (
            <Link href={`/mangas/${manga.id}`} key={manga.id} className="rounded-md border border-line bg-white p-4 hover:border-accent">
              <h2 className="font-semibold">{manga.title}</h2>
              <p className="mt-2 text-sm text-stone-600">{wanted}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
