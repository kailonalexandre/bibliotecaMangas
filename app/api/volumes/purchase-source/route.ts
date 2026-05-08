import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  await requireUser();
  const body = await request.json();
  const mangaId = String(body.mangaId || "");
  const number = Number(body.number);
  const source = String(body.purchaseSource || "").trim();
  const owned = body.owned === true;

  if (!mangaId || !Number.isInteger(number) || number < 1) {
    return NextResponse.json({ error: "Dados invalidos" }, { status: 400 });
  }

  const volume = await prisma.mangaVolume.upsert({
    where: { mangaId_number: { mangaId, number } },
    update: {
      purchaseSource: source || null,
      ...(owned ? { owned: true } : {})
    },
    create: {
      mangaId,
      number,
      owned,
      read: false,
      purchaseSource: source || null
    }
  });

  return NextResponse.json({ ok: true, id: volume.id });
}
