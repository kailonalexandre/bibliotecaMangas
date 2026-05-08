import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  await requireUser();
  const body = await request.json();
  const data: { owned?: boolean; read?: boolean; borrowed?: boolean; purchaseSource?: string | null } = {};
  if (typeof body.owned === "boolean") data.owned = body.owned;
  if (typeof body.read === "boolean") data.read = body.read;
  if (typeof body.borrowed === "boolean") data.borrowed = body.borrowed;
  if (typeof body.purchaseSource === "string") data.purchaseSource = body.purchaseSource.trim() || null;
  await prisma.mangaVolume.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true });
}
