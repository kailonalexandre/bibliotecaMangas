import { MissingVolumePlanner, type MissingVolumeItem } from "@/components/MissingVolumePlanner";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function MissingPage() {
  await requireUser();
  const mangas = await prisma.manga.findMany({ include: { volumes: { orderBy: { number: "asc" } } }, orderBy: { title: "asc" } });
  const items: MissingVolumeItem[] = mangas.flatMap((manga) => {
    const total = manga.totalVolumes || manga.volumes.length;
    const volumes = new Map(manga.volumes.map((volume) => [volume.number, volume]));
    return Array.from({ length: total }, (_, index) => index + 1)
      .map((number) => ({ number, volume: volumes.get(number) }))
      .filter(({ volume }) => !volume?.owned)
      .map(({ number, volume }) => ({
        mangaId: manga.id,
        mangaTitle: manga.title,
        volumeId: volume?.id || null,
        number,
        purchaseSource: volume?.purchaseSource || ""
      }));
  });

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lista de compra</h1>
        <p className="mt-1 text-sm text-muted">{items.length} volumes faltantes</p>
      </div>
      <MissingVolumePlanner items={items} />
    </div>
  );
}
