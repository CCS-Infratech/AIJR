"use client";

import { useRef, useState } from "react";
import { deleteLeadership } from "@/lib/admin-content-actions";

type Props = {
  id: string;
  name: string;
};

export default function LeadershipDeleteButton({ id, name }: Props) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const confirmedRef = useRef(false);

  function confirmDelete() {
    confirmedRef.current = true;
    formRef.current?.requestSubmit();
  }

  function close() {
    if (!confirmedRef.current) {
      setOpen(false);
    }
  }

  return (
    <>
      <form ref={formRef} action={deleteLeadership}>
        <input type="hidden" name="id" value={id} />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg px-2.5 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
        >
          Delete
        </button>
      </form>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="leadership-delete-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              close();
            }
          }}
        >
          <div className="w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
              Confirm deletion
            </p>

            <h2
              id="leadership-delete-title"
              className="mt-3 text-xl font-bold text-[#15231c]"
            >
              Delete {name}?
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#66746c]">
              This removes the leadership member from AIJR. The linked Media
              Library photo will not be deleted by this action.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[#dfe1d8] px-4 py-2.5 text-sm font-semibold text-[#34423a] transition hover:bg-[#f8f7f1]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-full bg-red-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-800"
              >
                Delete member
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
