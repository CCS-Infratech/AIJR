"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-[1.5rem] border border-red-100 bg-white p-7 text-center shadow-lg shadow-red-950/5 sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.24em] text-red-600">
          Something went wrong
        </p>

        <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#15231c]">
          We could not load this admin page.
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#66746c]">
          The application encountered an unexpected problem. You can retry the
          page without leaving the administration area.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#056839] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#034d2a]"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  );
}
