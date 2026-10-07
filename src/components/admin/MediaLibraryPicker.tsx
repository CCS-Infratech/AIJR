"use client";

import { useEffect, useState } from "react";
import { Check, Image as ImageIcon, Trash2, Upload, X } from "lucide-react";

export type MediaLibraryItem = {
  id: string;
  storageKey: string;
  publicUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  mimeType: string | null;
  fileSize: number | null;
  altText: string | null;
  caption: string | null;
  createdAt: string;
  usage?: {
    eventCovers: number;
    galleryItems: number;
    leadershipPhotos: number;
    thumbnails: number;
  };
};

type Props = {
  name: string;
  mode?: "single" | "multiple";
  folder?: "gallery" | "events" | "leadership" | "general";
  label: string;
  helperText?: string;
  initialItems?: MediaLibraryItem[];
  maxItems?: number;
  urlName?: string;
};

function fileName(storageKey: string) {
  return storageKey.split("/").pop() || "Image";
}

function formatFileSize(bytes: number | null) {
  if (!bytes) return "";

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;

  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit++;
  }

  return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function isInUse(item: MediaLibraryItem) {
  const usage = item.usage;

  if (!usage) return false;

  return (
    usage.eventCovers > 0 ||
    usage.galleryItems > 0 ||
    usage.leadershipPhotos > 0 ||
    usage.thumbnails > 0
  );
}

export default function MediaLibraryPicker({
  name,
  mode = "single",
  folder = "general",
  label,
  helperText,
  initialItems = [],
  maxItems,
  urlName,
}: Props) {
  const [selected, setSelected] =
    useState<MediaLibraryItem[]>(initialItems);

  const [library, setLibrary] = useState<MediaLibraryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadLibrary() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/media/list", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to load media.");
      }

      setLibrary(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load media library."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      void loadLibrary();
    }
  }, [open]);

  function selectItem(item: MediaLibraryItem) {
    if (mode === "single") {
      setSelected([item]);
      setOpen(false);
      setMessage("Media selected.");
      return;
    }

    setSelected((current) => {
      const exists = current.some((entry) => entry.id === item.id);

      if (exists) {
        return current.filter((entry) => entry.id !== item.id);
      }

      if (maxItems && current.length >= maxItems) {
        setMessage(`You can select up to ${maxItems} images.`);
        return current;
      }

      return [...current, item];
    });
  }

  function removeSelected(id: string) {
    setSelected((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  async function uploadFiles(files: File[]) {
    if (!files.length) return;

    const uploadList =
      mode === "single" ? files.slice(0, 1) : files;

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const uploaded: MediaLibraryItem[] = [];

      for (const file of uploadList) {
        if (maxItems && selected.length + uploaded.length >= maxItems) {
          break;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const response = await fetch("/api/admin/media/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success || !result.data?.id) {
          throw new Error(
            result.error || `Failed to upload ${file.name}.`
          );
        }

        uploaded.push({
          ...result.data,
          usage: {
            eventCovers: 0,
            galleryItems: 0,
            leadershipPhotos: 0,
            thumbnails: 0,
          },
        });
      }

      if (uploaded.length) {
        setLibrary((current) => [
          ...uploaded,
          ...current.filter(
            (item) =>
              !uploaded.some((newItem) => newItem.id === item.id)
          ),
        ]);

        setSelected((current) =>
          mode === "single"
            ? [uploaded[0]]
            : [...current, ...uploaded]
        );

        setMessage(
          uploaded.length === 1
            ? "Image uploaded successfully."
            : `${uploaded.length} images uploaded successfully.`
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  async function deleteMedia(item: MediaLibraryItem) {
    if (isInUse(item)) {
      setError(
        "This image is currently in use. Remove its references first."
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete "${fileName(item.storageKey)}" permanently?`
    );

    if (!confirmed) return;

    setDeletingId(item.id);
    setError("");

    try {
      const response = await fetch(`/api/admin/media/${item.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Delete failed.");
      }

      setLibrary((current) =>
        current.filter((entry) => entry.id !== item.id)
      );

      setSelected((current) =>
        current.filter((entry) => entry.id !== item.id)
      );

      setMessage("Media deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete media."
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
        {label}
      </label>

      {selected.length > 0 && (
        <div
          className={`mt-3 grid gap-3 ${
            mode === "multiple"
              ? "sm:grid-cols-2 lg:grid-cols-3"
              : "max-w-md"
          }`}
        >
          {selected.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-[#e3e4dc] bg-[#f8f7f1]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.publicUrl}
                  alt={item.altText || fileName(item.storageKey)}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">
                    {fileName(item.storageKey)}
                  </p>

                  <p className="mt-1 text-[11px] text-[#66746c]">
                    {formatFileSize(item.fileSize)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeSelected(item.id)}
                  className="shrink-0 rounded-lg px-2 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected.length === 0 && (
        <div className="mt-3 rounded-xl border border-dashed border-[#dfe1d8] bg-[#f8f7f1] px-4 py-6 text-center">
          <ImageIcon
            size={24}
            className="mx-auto text-[#056839]"
          />
          <p className="mt-2 text-sm font-semibold">
            No media selected
          </p>
        </div>
      )}

      {selected.map((item) => (
        <input
          key={item.id}
          type="hidden"
          name={name}
          value={item.id}
        />
      ))}

      {urlName && (
        <input
          type="hidden"
          name={urlName}
          value={selected[0]?.publicUrl || ""}
        />
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-[#056839] px-4 py-2 text-sm font-semibold text-[#056839] transition hover:bg-[#056839] hover:text-white"
        >
          <ImageIcon size={15} />
          {mode === "multiple"
            ? "Select Images"
            : "Select from Media Library"}
        </button>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#056839] px-4 py-2 text-sm font-semibold text-[#056839] transition hover:bg-[#056839] hover:text-white">
          <Upload size={15} />

          {uploading
            ? "Uploading..."
            : mode === "multiple"
              ? "Upload Images"
              : "Upload Image"}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            multiple={mode === "multiple"}
            disabled={uploading}
            className="hidden"
            onChange={(event) => {
              const files = Array.from(event.target.files || []);

              if (files.length) {
                void uploadFiles(files);
              }

              event.target.value = "";
            }}
          />
        </label>

        {helperText && (
          <span className="text-xs text-[#66746c]">
            {helperText}
          </span>
        )}
      </div>

      {message && (
        <p className="mt-2 text-xs text-[#056839]">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-700">
          {error}
        </p>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e3e4dc] px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.28em] text-[#056839]">
                  S3 Media
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Media Library
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-[#66746c] hover:bg-[#f8f7f1]"
              >
                <X size={19} />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6">
              {loading && (
                <div className="py-12 text-center text-sm text-[#66746c]">
                  Loading media library...
                </div>
              )}

              {!loading && error && (
                <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {!loading && library.length === 0 && (
                <div className="py-12 text-center">
                  <ImageIcon
                    size={30}
                    className="mx-auto text-[#056839]"
                  />
                  <p className="mt-3 font-semibold">
                    No images in the library.
                  </p>
                </div>
              )}

              {!loading && library.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {library.map((item) => {
                    const selectedAlready = selected.some(
                      (entry) => entry.id === item.id
                    );

                    const used = isInUse(item);

                    return (
                      <div
                        key={item.id}
                        className={`overflow-hidden rounded-xl border bg-white ${
                          selectedAlready
                            ? "border-[#056839] ring-2 ring-[#056839]/15"
                            : "border-[#e3e4dc]"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => selectItem(item)}
                          className="group block w-full text-left"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden bg-[#f8f7f1]">
                            <img
                              src={item.publicUrl}
                              alt={
                                item.altText ||
                                fileName(item.storageKey)
                              }
                              className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                            />

                            {selectedAlready && (
                              <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#056839] text-white">
                                <Check size={16} />
                              </div>
                            )}
                          </div>

                          <div className="p-3">
                            <p className="truncate text-sm font-semibold">
                              {fileName(item.storageKey)}
                            </p>

                            <p className="mt-1 text-xs text-[#66746c]">
                              {formatFileSize(item.fileSize)}
                            </p>

                            <p className="mt-2 text-xs font-semibold text-[#056839]">
                              {selectedAlready
                                ? "Selected"
                                : mode === "multiple"
                                  ? "Select / deselect"
                                  : "Select image →"}
                            </p>
                          </div>
                        </button>

                        <div className="flex items-center justify-between border-t border-[#e3e4dc] px-3 py-2">
                          <span className="text-[11px] text-[#66746c]">
                            {used ? "In use" : "Unused"}
                          </span>

                          <button
                            type="button"
                            disabled={
                              used || deletingId === item.id
                            }
                            onClick={() => void deleteMedia(item)}
                            className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold ${
                              used
                                ? "cursor-not-allowed text-[#a5aaa5]"
                                : "text-red-700 hover:bg-red-50"
                            }`}
                          >
                            <Trash2 size={13} />

                            {deletingId === item.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[#e3e4dc] px-5 py-4 sm:px-6">
              <p className="text-xs text-[#66746c]">
                {selected.length} selected
              </p>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[#056839] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#034d2a]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
