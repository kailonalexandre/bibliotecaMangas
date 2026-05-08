import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

const cookieName = "mangas_session";

function secret() {
  return process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET || "dev-secret-change-me";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function createSessionValue(userId: string) {
  return `${userId}.${sign(userId)}`;
}

export function verifySessionValue(value?: string) {
  if (!value) return null;
  const [userId, signature] = value.split(".");
  if (!userId || !signature) return null;
  const expected = sign(userId);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return null;
  return timingSafeEqual(left, right) ? userId : null;
}

export async function getCurrentUser() {
  const userId = verifySessionValue(cookies().get(cookieName)?.value);
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true } });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export function setSession(userId: string) {
  cookies().set(cookieName, createSessionValue(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export function clearSession() {
  cookies().delete(cookieName);
}
