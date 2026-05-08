import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("manga123", 10);

  await prisma.user.upsert({
    where: { email: "ana@example.com" },
    update: {},
    create: { name: "Ana", email: "ana@example.com", passwordHash }
  });

  await prisma.user.upsert({
    where: { email: "leo@example.com" },
    update: {},
    create: { name: "Leo", email: "leo@example.com", passwordHash }
  });

  const mangas: {
    title: string;
    originalTitle: string;
    author: string;
    publisher: string;
    status: "COLLECTING" | "COMPLETE" | "PAUSED" | "SOLD" | "WISHLIST";
    totalVolumes: number;
    description: string;
    coverUrl: string;
    owned: number[];
    read: number[];
    sources: Record<number, string>;
  }[] = [
    {
      title: "Cidade de Papel",
      originalTitle: "Kami no Machi",
      author: "Mika Haru",
      publisher: "Aurora Comics",
      status: "COLLECTING" as const,
      totalVolumes: 8,
      description: "Drama urbano sobre cartas perdidas e memorias de bairro.",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781421545822-L.jpg",
      owned: [1, 2, 4],
      read: [1, 2],
      sources: { 3: "Distribuidora", 5: "Shogun", 6: "Amazon" }
    },
    {
      title: "Noite do Cometa",
      originalTitle: "Suisei no Yoru",
      author: "Ren Aoki",
      publisher: "Nimbo",
      status: "COMPLETE" as const,
      totalVolumes: 5,
      description: "Aventura de ficcao cientifica em cinco volumes.",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781974700523-L.jpg",
      owned: [1, 2, 3, 4, 5],
      read: [1, 2, 3, 4, 5],
      sources: {}
    },
    {
      title: "Caderno de Estrelas",
      originalTitle: "Hoshi Note",
      author: "Yuna Sato",
      publisher: "Luar Press",
      status: "WISHLIST" as const,
      totalVolumes: 3,
      description: "Slice of life escolar com astronomia.",
      coverUrl: "https://covers.openlibrary.org/b/isbn/9781421582698-L.jpg",
      owned: [],
      read: [],
      sources: { 1: "Amazon", 2: "Shogun" }
    }
  ];

  for (const item of mangas) {
    const manga = await prisma.manga.upsert({
      where: { title: item.title },
      update: {},
      create: {
        title: item.title,
        originalTitle: item.originalTitle,
        author: item.author,
        publisher: item.publisher,
        status: item.status,
        totalVolumes: item.totalVolumes,
        description: item.description,
        coverUrl: item.coverUrl
      }
    });

    for (let number = 1; number <= item.totalVolumes; number += 1) {
      await prisma.mangaVolume.upsert({
        where: { mangaId_number: { mangaId: manga.id, number } },
        update: { purchaseSource: item.sources[number] || null },
        create: {
          mangaId: manga.id,
          number,
          owned: item.owned.includes(number),
          read: item.read.includes(number),
          purchaseSource: item.sources[number] || null,
          condition: number % 2 === 0 ? "USED" : "NEW"
        }
      });
    }
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
