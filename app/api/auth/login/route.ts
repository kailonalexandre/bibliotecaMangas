import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { setSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") || "").toLowerCase().trim();
  const password = String(form.get("password") || "");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) redirect("/login?error=1");
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) redirect("/login?error=1");
  setSession(user.id);
  redirect("/dashboard");
}
