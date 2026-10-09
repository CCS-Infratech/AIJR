export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-[1500px] animate-pulse">
      <div className="h-3 w-32 rounded-full bg-[#dfe5df]" />
      <div className="mt-4 h-10 w-64 rounded-xl bg-[#dfe5df]" />
      <div className="mt-4 h-4 w-full max-w-2xl rounded-full bg-[#e7ebe7]" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[1.35rem] border border-[#e3e4dc] bg-white p-5 shadow-sm"
          >
            <div className="h-11 w-11 rounded-2xl bg-[#e7ebe7]" />
            <div className="mt-6 h-8 w-16 rounded-lg bg-[#dfe5df]" />
            <div className="mt-3 h-4 w-28 rounded-full bg-[#e7ebe7]" />
            <div className="mt-2 h-3 w-20 rounded-full bg-[#eef1ee]" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[1.5rem] border border-[#e3e4dc] bg-white"
          >
            <div className="border-b border-[#e3e4dc] px-6 py-5">
              <div className="h-5 w-40 rounded-full bg-[#e7ebe7]" />
              <div className="mt-2 h-3 w-52 rounded-full bg-[#eef1ee]" />
            </div>

            {Array.from({ length: 4 }).map((_, row) => (
              <div
                key={row}
                className="flex items-center gap-4 border-b border-[#eef0ec] px-6 py-5 last:border-0"
              >
                <div className="h-10 w-10 rounded-xl bg-[#e7ebe7]" />
                <div className="flex-1">
                  <div className="h-4 w-2/3 rounded-full bg-[#e7ebe7]" />
                  <div className="mt-2 h-3 w-1/2 rounded-full bg-[#eef1ee]" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
