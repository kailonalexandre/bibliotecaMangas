import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { csvEscape } from "@/lib/manga";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireUser();
  const mangas = await prisma.manga.findMany({ include: { volumes: { orderBy: { number: "asc" } } }, orderBy: { title: "asc" } });
  const header = ["manga", "autor", "editora", "status", "volume", "possui", "lido", "emprestado", "emprestado_para", "onde_comprar", "preco_pago", "condicao"];
  const rows = mangas.flatMap((manga) =>
    (manga.volumes.length ? manga.volumes : [null]).map((volume) => [
      manga.title,
      manga.author,
      manga.publisher,
      manga.status,
      volume?.number,
      volume?.owned,
      volume?.read,
      volume?.borrowed,
      volume?.borrowedTo,
      volume?.purchaseSource,
      volume?.paidPrice,
      volume?.condition
    ])
  );
  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="mangas-controll.csv"'
    }
  });
}
