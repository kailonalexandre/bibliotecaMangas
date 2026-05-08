import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await requireUser();
  const body = await request.json();
  const manga = await prisma.manga.update({
    where: { id: params.id },
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

export async function POST(request: Request, { params }: { params: { id: string } }) {
  await requireUser();
  const form = await request.formData();
  if (form.get("_method") === "DELETE") {
    await prisma.manga.delete({ where: { id: params.id } });
    redirect("/dashboard");
  }
  return NextResponse.json({ error: "Metodo invalido" }, { status: 400 });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await requireUser();
  await prisma.manga.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
