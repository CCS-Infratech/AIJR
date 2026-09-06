import Link from "next/link";
import { BarChart3, FolderOpen, ImageIcon, LayoutDashboard, Mail, Settings, Users } from "lucide-react";

import { logoutAdmin } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/admin-auth";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin", available: true },
  { label: "Events & News", icon: BarChart3, available: false },
  { label: "Gallery / Media", icon: ImageIcon, available: false },
  { label: "Leadership", icon: Users, available: false },
  { label: "Membership", icon: FolderOpen, available: false },
  { label: "Messages", icon: Mail, available: false },
  { label: "Settings", icon: Settings, available: false },
];

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[#f8f7f1] text-[#15231c]">
      <aside className="border-b border-[#e3e4dc] bg-[#034d2a] text-white lg:fixed lg:inset-y-0 lg:w-72 lg:border-b-0 lg:border-r lg:border-white/10">
        <div className="flex items-center justify-between px-6 py-5 lg:block lg:px-7 lg:py-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ead493]">AIJR</p>
            <p className="mt-1 text-lg font-bold">Admin</p>
          </div>
          <form action={logoutAdmin} className="lg:mt-10">
            <button type="submit" className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/75 transition hover:bg-white/10 hover:text-white">
              Sign out
            </button>
          </form>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-4 pb-4 lg:block lg:space-y-1 lg:px-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const className = "flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition";

            return item.available ? (
              <Link key={item.label} href={item.href!} className={`${className} bg-white/10 font-semibold text-white`}>
                <Icon size={17} />
                {item.label}
              </Link>
            ) : (
              <span key={item.label} className={`${className} cursor-not-allowed text-white/40`} title="Available in a future admin phase">
                <Icon size={17} />
                {item.label}
              </span>
            );
          })}
        </nav>
      </aside>

      <main className="lg:ml-72">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">{children}</div>
      </main>
    </div>
  );
}
