import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  await requireUser();
  const body = await request.json();
  const manga = await prisma.manga.create({
    data: {
      title: body.title,
      originalTitle: body.originalTitle || null,
      author: body.author || null,
      publisher: body.publisher || null,
      description: body.description || null,
      coverUrl: body.coverUrl || null,
      status: body.status,
      totalVolumes: body.totalVolumes || null,
      notes: body.notes || null
    }
  });
  return NextResponse.json({ id: manga.id });
}
