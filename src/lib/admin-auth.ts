import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "aijr_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type AdminSession = {
  userId: string;
  role: string;
};

function getSessionSecret() {
  const value = process.env.ADMIN_SESSION_SECRET;

  if (!value || value.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be set to at least 32 characters.");
  }

  return new TextEncoder().encode(value);
}

export async function createAdminSession(session: AdminSession) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);
  const token = await new SignJWT({ role: session.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getSessionSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSessionSecret());

    if (!payload.sub || typeof payload.role !== "string") return null;

    return { userId: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) redirect("/admin/login");

  const user = await prisma.adminUser.findUnique({
    where: { id: session.userId },
    select: { id: true, role: true, active: true },
  });

  if (!user || !user.active || user.role !== "SUPER_ADMIN") {
    await clearAdminSession();
    redirect("/admin/login");
  }

  return user;
}
