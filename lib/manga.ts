import type { Manga, MangaStatus, MangaVolume } from "@prisma/client";

export const statusLabels: Record<MangaStatus, string> = {
  COLLECTING: "Colecionando",
  COMPLETE: "Completo",
  PAUSED: "Pausado",
  SOLD: "Vendido",
  WISHLIST: "Wishlist"
};

export const conditionLabels = {
  NEW: "Novo",
  USED: "Usado",
  DAMAGED: "Danificado"
};

export type MangaWithVolumes = Manga & { volumes: MangaVolume[] };

export function collectionStats(manga: MangaWithVolumes) {
  const total = manga.totalVolumes || manga.volumes.length || 0;
  const owned = manga.volumes.filter((volume) => volume.owned).length;
  const read = manga.volumes.filter((volume) => volume.read).length;
  const missing = total ? Math.max(total - owned, 0) : 0;
  const percent = total ? Math.round((owned / total) * 100) : 0;
  return { total, owned, read, missing, percent };
}

export function csvEscape(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}
