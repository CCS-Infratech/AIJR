"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { clearAdminSession, createAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function loginAdmin(formData: FormData) {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  const email = typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";

  if (!email || !password) {
    redirect("/admin/login?error=invalid");
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });

  if (!user || !user.active || user.role !== "SUPER_ADMIN") {
    redirect("/admin/login?error=invalid");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    redirect("/admin/login?error=invalid");
  }

  await createAdminSession({ userId: user.id, role: user.role });
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}
