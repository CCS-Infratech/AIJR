"use client";

import { Trash2 } from "lucide-react";

import { deleteEventNews } from "@/lib/event-news-actions";

export default function EventDeleteButton({ id, title }: { id: string; title: string }) {
  return (
    <form action={deleteEventNews} onSubmit={(event) => {
      if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) event.preventDefault();
    }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50">
        <Trash2 size={14} />
        Delete
      </button>
    </form>
  );
}
