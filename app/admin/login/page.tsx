import Link from "next/link";

import { loginAdmin } from "@/lib/admin-actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f7f1] px-4 py-10">
      <section className="w-full max-w-md rounded-[2rem] border border-[#e3e4dc] bg-white p-7 shadow-xl shadow-[#056839]/5 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#056839]">
          AIJR Admin
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#15231c]">
          Sign in securely.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#66746c]">
          Use the administrator account created through the secure local setup process.
        </p>

        {error === "invalid" && (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            Invalid email or password.
          </p>
        )}

        <form action={loginAdmin} className="mt-7 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-4 py-3.5 text-sm text-[#15231c] outline-none transition focus:border-[#056839] focus:ring-4 focus:ring-[#056839]/10"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-4 py-3.5 text-sm text-[#15231c] outline-none transition focus:border-[#056839] focus:ring-4 focus:ring-[#056839]/10"
            />
          </div>

          <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-[#056839] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#034d2a]">
            Sign in
          </button>
        </form>

        <Link href="/" className="mt-7 inline-block text-sm font-semibold text-[#056839] hover:text-[#034d2a]">
          ← Back to AIJR website
        </Link>
      </section>
    </main>
  );
}
