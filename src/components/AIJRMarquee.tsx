"use client";

export default function AIJRMarquee() {
  const items = [
    "UNITY",
    "COMMUNITY",
    "EDUCATION",
    "WELFARE",
    "OPPORTUNITY",
    "PROGRESS",
  ];

  return (
    <section
      aria-label="AIJR values"
      className="aijr-marquee relative overflow-hidden border-y border-[#e3e4dc] bg-white py-5"
    >
      <div className="aijr-marquee-track">
        {[...items, ...items].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center gap-6 px-5 text-xs font-extrabold tracking-[0.3em] text-[#056839] sm:px-8 sm:text-sm"
          >
            {item}
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-[#d7b765]"
            />
          </span>
        ))}
      </div>
    </section>
  );
}
