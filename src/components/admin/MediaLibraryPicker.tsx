"use client";

import Image from "next/image";

import {
  Check,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Image as ImageIcon,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";

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
  const [draggingId, setDraggingId] = useState("");
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

      setLibrary(
        (Array.isArray(result.data) ? result.data : []).filter(
          (item: MediaLibraryItem) => item.mediaType === "IMAGE"
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load media library."
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

    setMessage("");
  }

  function removeSelected(id: string) {
    setSelected((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  function moveSelected(id: string, direction: "up" | "down") {
    setSelected((current) => {
      const index = current.findIndex((item) => item.id === id);

      if (index === -1) return current;

      const targetIndex =
        direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[targetIndex]] = [
        next[targetIndex],
        next[index],
      ];

      return next;
    });
  }

  function reorderSelected(sourceId: string, targetId: string) {
    setSelected((current) => {
      const sourceIndex = current.findIndex(
        (item) => item.id === sourceId
      );
      const targetIndex = current.findIndex(
        (item) => item.id === targetId
      );

      if (
        sourceIndex === -1 ||
        targetIndex === -1 ||
        sourceIndex === targetIndex
      ) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(sourceIndex, 1);

      next.splice(targetIndex, 0, moved);

      return next;
    });
  }

  function handleDragStart(
    event: DragEvent<HTMLDivElement>,
    id: string
  ) {
    event.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>,
    targetId: string
  ) {
    event.preventDefault();

    if (draggingId && draggingId !== targetId) {
      reorderSelected(draggingId, targetId);
    }

    setDraggingId("");
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
        if (
          maxItems &&
          selected.length + uploaded.length >= maxItems
        ) {
          break;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const response = await fetch(
          "/api/admin/media/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();

        if (
          !response.ok ||
          !result.success ||
          !result.data?.id
        ) {
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
              !uploaded.some(
                (newItem) => newItem.id === item.id
              )
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
        "This media is currently in use. Remove its references first."
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
      const response = await fetch(
        `/api/admin/media/${item.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Delete failed."
        );
      }

      setLibrary((current) =>
        current.filter((entry) => entry.id !== item.id)
      );

      setSelected((current) =>
        current.filter((entry) => entry.id !== item.id)
      );

      setMessage("Media deleted permanently.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete media."
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

      {mode === "multiple" && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f8f7f1] px-4 py-3">
          <div>
            <p className="text-sm font-bold text-[#15231c]">
              {selected.length}{" "}
              {selected.length === 1 ? "image" : "images"} selected
            </p>
            <p className="mt-1 text-xs text-[#66746c]">
              {selected.length
                ? "Order shown here is the public gallery order."
                : "Build the event gallery by selecting media."}
            </p>
          </div>

          <ImageIcon
            size={18}
            className="text-[#056839]"
          />
        </div>
      )}

      {selected.length > 0 && (
        <div
          className={`mt-3 grid gap-4 ${
            mode === "multiple"
              ? "sm:grid-cols-2 lg:grid-cols-3"
              : "max-w-md"
          }`}
        >
          {selected.map((item, index) => (
            <div
              key={item.id}
              draggable={mode === "multiple"}
              onDragStart={(event) =>
                handleDragStart(event, item.id)
              }
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) =>
                handleDrop(event, item.id)
              }
              onDragEnd={() => setDraggingId("")}
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                draggingId === item.id
                  ? "border-[#056839] opacity-50"
                  : "border-[#e3e4dc]"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#f8f7f1]">
                <Image
                  src={item.publicUrl}
                  alt={
                    item.altText ||
                    fileName(item.storageKey)
                  }
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  unoptimized
                  className="object-cover"
                />

                {mode === "multiple" && (
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#056839] px-2 text-xs font-bold text-white shadow">
                      {index + 1}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#15231c] shadow">
                      <GripVertical size={12} />
                      Drag
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="truncate text-sm font-bold text-[#15231c]">
                  {fileName(item.storageKey)}
                </p>

                <p className="mt-1 text-xs text-[#66746c]">
                  {formatFileSize(item.fileSize)}
                </p>

                <div className="mt-4 flex items-center justify-between gap-2">
                  {mode === "multiple" ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() =>
                          moveSelected(item.id, "up")
                        }
                        className="rounded-lg border border-[#dfe1d8] p-2 text-[#056839] transition hover:bg-[#f8f7f1] disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label={`Move image ${index + 1} up`}
                      >
                        <ChevronUp size={15} />
                      </button>

                      <button
                        type="button"
                        disabled={
                          index === selected.length - 1
                        }
                        onClick={() =>
                          moveSelected(item.id, "down")
                        }
                        className="rounded-lg border border-[#dfe1d8] p-2 text-[#056839] transition hover:bg-[#f8f7f1] disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label={`Move image ${index + 1} down`}
                      >
                        <ChevronDown size={15} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-[#66746c]">
                      Event cover
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      removeSelected(item.id)
                    }
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                  >
                    {mode === "multiple"
                      ? "Remove from event"
                      : "Remove cover"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected.length === 0 && (
        <div className="mt-3 rounded-2xl border border-dashed border-[#cfd4cb] bg-[#f8f7f1] px-5 py-7">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#056839]/10">
              <ImageIcon
                size={19}
                className="text-[#056839]"
              />
            </div>

            <div>
              <p className="text-sm font-bold text-[#15231c]">
                {mode === "multiple"
                  ? "No gallery images added yet"
                  : "No cover image selected"}
              </p>

              <p className="mt-1 text-xs leading-5 text-[#66746c]">
                {mode === "multiple"
                  ? "Add photos from the media library or upload new images."
                  : "Choose one image from the media library or upload a new one."}
              </p>
            </div>
          </div>
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

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setError("");
            setMessage("");
            setOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-[#056839] px-4 py-2.5 text-sm font-bold text-[#056839] transition hover:bg-[#056839] hover:text-white"
        >
          <ImageIcon size={15} />
          {mode === "multiple"
            ? "Add from Media Library"
            : "Change Cover"}
        </button>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#056839] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#034d2a]">
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
              const files = Array.from(
                event.target.files || []
              );

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
        <p className="mt-2 text-xs font-semibold text-[#056839]">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-2 text-xs font-semibold text-red-700">
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
                  Media Library
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#15231c]">
                  Choose images
                </h2>

                <p className="mt-1 text-xs text-[#66746c]">
                  {library.length} image
                  {library.length === 1 ? "" : "s"} available
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-[#66746c] transition hover:bg-[#f8f7f1]"
                aria-label="Close media library"
              >
                <X size={20} />
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

              {!loading &&
                !error &&
                library.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-[#dfe1d8] p-12 text-center">
                    <ImageIcon
                      size={30}
                      className="mx-auto text-[#056839]"
                    />

                    <p className="mt-3 font-bold text-[#15231c]">
                      No images in the library
                    </p>

                    <p className="mt-2 text-sm text-[#66746c]">
                      Upload an image first, then select it here.
                    </p>
                  </div>
                )}

              {!loading &&
                !error &&
                library.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {library.map((item) => {
                      const selectedAlready = selected.some(
                        (entry) => entry.id === item.id
                      );

                      const used = isInUse(item);

                      return (
                        <div
                          key={item.id}
                          className={`overflow-hidden rounded-2xl border bg-white transition ${
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
                              <Image
                                src={item.publicUrl}
                                alt={
                                  item.altText ||
                                  fileName(item.storageKey)
                                }
                                fill
                                sizes="(max-width: 1024px) 50vw, 25vw"
                                unoptimized
                                className="object-cover transition duration-200 group-hover:scale-[1.02]"
                              />

                              {selectedAlready && (
                                <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#056839] text-white shadow">
                                  <Check size={16} />
                                </div>
                              )}
                            </div>

                            <div className="p-3">
                              <p className="truncate text-sm font-bold text-[#15231c]">
                                {fileName(item.storageKey)}
                              </p>

                              <p className="mt-1 text-xs text-[#66746c]">
                                {formatFileSize(item.fileSize)}
                              </p>

                              <p className="mt-2 text-xs font-bold text-[#056839]">
                                {selectedAlready
                                  ? "Selected"
                                  : mode === "multiple"
                                    ? "Select image"
                                    : "Use this image"}
                              </p>
                            </div>
                          </button>

                          <div className="flex items-center justify-between border-t border-[#e3e4dc] px-3 py-2">
                            <span className="text-[11px] font-semibold text-[#66746c]">
                              {used ? "In use" : "Unused"}
                            </span>

                            <button
                              type="button"
                              disabled={
                                used ||
                                deletingId === item.id
                              }
                              onClick={() =>
                                void deleteMedia(item)
                              }
                              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold ${
                                used
                                  ? "cursor-not-allowed text-[#a5aaa5]"
                                  : "text-red-700 hover:bg-red-50"
                              }`}
                            >
                              <Trash2 size={13} />

                              {deletingId === item.id
                                ? "Deleting..."
                                : "Delete permanently"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-[#e3e4dc] px-5 py-4 sm:px-6">
              <p className="text-xs font-semibold text-[#66746c]">
                {selected.length} selected
              </p>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[#056839] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#034d2a]"
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
