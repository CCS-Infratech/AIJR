"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";

import { deleteMessage } from "@/lib/admin-content-actions";

type Props = {
  id: string;
  name: string;
  subject: string;
};

export default function MessageDeleteButton({
  id,
  name,
  subject,
}: Props) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const confirmed = useRef(false);

  return (
    <>
      <form
        ref={formRef}
        action={deleteMessage}
        onSubmit={(event) => {
          if (confirmed.current) {
            confirmed.current = false;
            return;
          }

          event.preventDefault();
          setOpen(true);
        }}
      >
        <input type="hidden" name="id" value={id} />

        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </form>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`message-delete-${id}`}
        >
          <button
            type="button"
            aria-label="Close confirmation"
            className="absolute inset-0 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-[1.5rem] border border-red-100 bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h2
                  id={`message-delete-${id}`}
                  className="text-lg font-bold text-[#15231c]"
                >
                  Delete message?
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#66746c]">
                  This will permanently remove the message from{" "}
                  <span className="font-semibold text-[#15231c]">
                    {name}
                  </span>
                  .
                </p>

                <p className="mt-2 truncate text-xs text-[#89948e]">
                  Subject: {subject}
                </p>

                <p className="mt-2 text-xs font-medium text-red-600">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e3e4dc] bg-white px-4 py-3 text-sm font-semibold text-[#66746c] transition hover:bg-[#f8f7f1]"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  confirmed.current = true;
                  setOpen(false);
                  formRef.current?.requestSubmit();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete message
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
