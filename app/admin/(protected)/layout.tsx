import type { ReactNode } from "react";

import AdminShell from "@/components/admin/AdminShell";
import { logoutAdmin } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/admin-auth";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  return (
    <AdminShell logoutAction={logoutAdmin}>
      {children}
    </AdminShell>
  );
}
