import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  await requireUser();
  const manga = await prisma.manga.findUnique({ where: { id: params.id }, include: { volumes: true } });
  if (!manga?.totalVolumes) redirect(`/mangas/${params.id}`);
  const existing = new Set(manga.volumes.map((volume) => volume.number));
  await prisma.mangaVolume.createMany({
    data: Array.from({ length: manga.totalVolumes }, (_, index) => index + 1)
      .filter((number) => !existing.has(number))
      .map((number) => ({ mangaId: manga.id, number })),
    skipDuplicates: true
  });
  redirect(`/mangas/${params.id}`);
}
