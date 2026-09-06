import { EventNews, MediaAsset } from "@prisma/client";

import { saveEventNews } from "@/lib/event-news-actions";

type EventNewsFormProps = {
  item?: EventNews;
  media: Pick<MediaAsset, "id" | "mediaType" | "altText" | "caption" | "publicUrl">[];
  error?: string;
};

function dateTimeValue(value?: Date | null) {
  if (!value) return "";
  const offset = value.getTimezoneOffset() * 60_000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}

export default function EventNewsForm({ item, media, error }: EventNewsFormProps) {
  const inputClass = "mt-2 w-full rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-4 py-3 text-sm text-[#15231c] outline-none transition focus:border-[#056839] focus:ring-4 focus:ring-[#056839]/10";
  const labelClass = "block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]";

  return (
    <form action={saveEventNews} className="space-y-7">
      {item && <input type="hidden" name="id" value={item.id} />}

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <section className="rounded-[1.5rem] border border-[#e3e4dc] bg-white p-5 sm:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelClass}>
            Content type
            <select name="type" required defaultValue={item?.type ?? "EVENT"} className={inputClass}>
              <option value="EVENT">Event</option>
              <option value="NEWS">News</option>
            </select>
          </label>

          <label className={labelClass}>
            Display order
            <input name="sortOrder" type="number" step="1" defaultValue={item?.sortOrder ?? 0} className={inputClass} />
          </label>
        </div>

        <label className={`${labelClass} mt-5`}>
          Title
          <input name="title" required defaultValue={item?.title ?? ""} placeholder="Enter a title" className={inputClass} />
        </label>

        <label className={`${labelClass} mt-5`}>
          Slug <span className="normal-case font-normal tracking-normal">(leave blank to generate from the title)</span>
          <input name="slug" defaultValue={item?.slug ?? ""} placeholder="community-gathering" className={inputClass} />
        </label>

        <label className={`${labelClass} mt-5`}>
          Summary
          <textarea name="excerpt" rows={3} defaultValue={item?.excerpt ?? ""} className={`${inputClass} resize-y`} />
        </label>

        <label className={`${labelClass} mt-5`}>
          Description / content
          <textarea name="body" required rows={9} defaultValue={item?.body ?? ""} className={`${inputClass} resize-y`} />
        </label>
      </section>

      <section className="rounded-[1.5rem] border border-[#e3e4dc] bg-white p-5 sm:p-7">
        <h2 className="text-lg font-semibold">Event details and display</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className={labelClass}>
            Category
            <input name="category" defaultValue={item?.category ?? ""} className={inputClass} />
          </label>

          <label className={labelClass}>
            Location
            <input name="location" defaultValue={item?.location ?? ""} className={inputClass} />
          </label>

          <label className={labelClass}>
            Event start
            <input name="eventStart" type="datetime-local" defaultValue={dateTimeValue(item?.eventStart)} className={inputClass} />
          </label>

          <label className={labelClass}>
            Event end
            <input name="eventEnd" type="datetime-local" defaultValue={dateTimeValue(item?.eventEnd)} className={inputClass} />
          </label>

          <label className={labelClass}>
            External URL
            <input name="externalUrl" type="url" defaultValue={item?.externalUrl ?? ""} placeholder="https://" className={inputClass} />
          </label>

          <label className={labelClass}>
            Cover media
            <select name="coverMediaId" defaultValue={item?.coverMediaId ?? ""} className={inputClass}>
              <option value="">No cover media selected</option>
              {media.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.mediaType} — {asset.altText || asset.caption || asset.publicUrl || asset.id}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Published date
            <input name="publishedAt" type="datetime-local" defaultValue={dateTimeValue(item?.publishedAt)} className={inputClass} />
          </label>
        </div>

        <label className="mt-6 flex items-center gap-3 text-sm font-semibold text-[#15231c]">
          <input name="featured" type="checkbox" defaultChecked={item?.featured ?? false} className="h-4 w-4 rounded border-[#dfe1d8] text-[#056839] focus:ring-[#056839]" />
          Feature this item when public integration is added
        </label>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button name="intent" value="draft" type="submit" className="rounded-full border border-[#056839]/20 bg-white px-6 py-3.5 text-sm font-bold text-[#056839] transition hover:bg-[#f8f7f1]">
          Save as Draft
        </button>
        <button name="intent" value="publish" type="submit" className="rounded-full bg-[#056839] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#034d2a]">
          Publish
        </button>
      </div>
    </form>
  );
}
