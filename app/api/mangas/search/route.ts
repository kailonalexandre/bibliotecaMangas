import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { searchExternalManga } from "@/lib/cover-search";

export async function GET(request: Request) {
  await requireUser();
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "";
  const results = await searchExternalManga(title);
  return NextResponse.json({ results });
}
