import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

const genericError = "/register?error=invalid";
const maxAttempts = 5;
const windowMs = 15 * 60 * 1000;

type RateEntry = {
  count: number;
  resetAt: number;
};

const globalForRateLimit = globalThis as unknown as {
  registerRateLimit?: Map<string, RateEntry>;
};

const registerRateLimit = globalForRateLimit.registerRateLimit ?? new Map<string, RateEntry>();
globalForRateLimit.registerRateLimit = registerRateLimit;

export async function POST(request: Request) {
  const ip = getClientIp();
  if (isRateLimited(ip)) redirect("/register?error=rate");

  const form = await request.formData();
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const confirmPassword = String(form.get("confirmPassword") || "");
  const inviteCode = String(form.get("inviteCode") || "");

  if (!process.env.REGISTER_INVITE_CODE?.trim()) redirect("/register?error=config");
  if (!isValidName(name) || !isValidEmail(email) || !password || !confirmPassword || !inviteCode) redirect(genericError);
  if (password !== confirmPassword) redirect(genericError);
  if (!isStrongPassword(password)) redirect("/register?error=weak");
  if (!safeEqual(inviteCode, process.env.REGISTER_INVITE_CODE)) redirect(genericError);

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) redirect(genericError);

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash
      }
    });
  } catch {
    redirect(genericError);
  }

  redirect("/login?registered=1");
}

function getClientIp() {
  const headerStore = headers();
  const forwardedFor = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || headerStore.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = registerRateLimit.get(ip);
  if (!current || current.resetAt <= now) {
    registerRateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  current.count += 1;
  registerRateLimit.set(ip, current);
  return current.count > maxAttempts;
}

function isValidName(name: string) {
  return name.length > 0 && name.length <= 120;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function isStrongPassword(password: string) {
  return (
    password.length >= 10 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function safeEqual(left: string, right: string) {
  const leftBuffer = createHash("sha256").update(left).digest();
  const rightBuffer = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftBuffer, rightBuffer);
}
