"use client";

import Image from "next/image";

import { useEffect, useState } from "react";

type MediaItem = {
  id: string;
  storageKey: string;
  publicUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  mimeType: string | null;
  fileSize: number | null;
  altText: string | null;
  caption: string | null;
  createdAt: string;
  usage: {
    eventCovers: number;
    galleryItems: number;
    leadershipPhotos: number;
    thumbnails: number;
  };
};

type Props = {
  initialUrl?: string;
  initialMediaId?: string;
  initialMediaType?: "IMAGE" | "VIDEO";
};

function formatFileSize(bytes: number | null) {
  if (!bytes) return "";

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;

  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }

  return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function fileName(storageKey: string) {
  return storageKey.split("/").pop() || "Image";
}

function isInUse(item: MediaItem) {
  return (
    item.usage.eventCovers > 0 ||
    item.usage.galleryItems > 0 ||
    item.usage.leadershipPhotos > 0 ||
    item.usage.thumbnails > 0
  );
}

export default function MediaUploadField({
  initialUrl = "",
  initialMediaId = "",
  initialMediaType = "IMAGE",
}: Props) {
  const [url, setUrl] = useState(initialUrl);
  const [mediaId, setMediaId] = useState(initialMediaId);
  const [mediaType] = useState<"IMAGE" | "VIDEO">(
    initialMediaType
  );

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [libraryError, setLibraryError] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [deletingId, setDeletingId] = useState("");

  async function loadLibrary() {
    setLoadingLibrary(true);
    setLibraryError("");

    try {
      const response = await fetch("/api/admin/media/list", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success || !Array.isArray(result.data)) {
        throw new Error(result.error || "Failed to load media library.");
      }

      setMedia(result.data);
    } catch (error) {
      setLibraryError(
        error instanceof Error
          ? error.message
          : "Failed to load media library."
      );
    } finally {
      setLoadingLibrary(false);
    }
  }

  useEffect(() => {
    if (libraryOpen) {
      void loadLibrary();
    }
  }, [libraryOpen]);

  async function uploadFile(file: File) {
    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("folder", "gallery");

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.data?.publicUrl) {
        throw new Error(result.error || "Upload failed.");
      }

      setUrl(result.data.publicUrl);
      setMediaId(result.data.id || "");
      setMessage("Image uploaded successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );
    } finally {
      setUploading(false);
    }
  }

  function selectMedia(item: MediaItem) {
    setUrl(item.publicUrl);
    setMediaId(item.id);
    setMessage("Media selected.");
    setLibraryOpen(false);
  }

  async function deleteMedia(event: React.MouseEvent, item: MediaItem) {
    event.stopPropagation();

    if (isInUse(item)) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${fileName(item.storageKey)}" permanently?`
    );

    if (!confirmed) return;

    setDeletingId(item.id);
    setLibraryError("");

    try {
      const response = await fetch(`/api/admin/media/${item.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Delete failed.");
      }

      setMedia((current) =>
        current.filter((mediaItem) => mediaItem.id !== item.id)
      );

      if (mediaId === item.id) {
        setMediaId("");
        setUrl("");
      }

      setMessage("Media deleted successfully.");
    } catch (error) {
      setLibraryError(
        error instanceof Error
          ? error.message
          : "Failed to delete media."
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <>
      <div>
        <label>
          Media URL
          <input
            required
            name="url"
            type="url"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setMediaId("");
            }}
            placeholder="Paste an image URL or select from media library"
            className="mt-1 w-full rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-3 py-2.5 text-sm"
          />
        </label>

        <input type="hidden" name="mediaId" value={mediaId} />

        {url && (
          <div className="mt-3 overflow-hidden rounded-xl border border-[#e3e4dc] bg-[#f8f7f1]">
            <div className="flex items-center gap-4 p-3">
              {mediaType === "VIDEO" ? (
                <video
                  src={url}
                  muted
                  playsInline
                  preload="metadata"
                  controls
                  className="h-20 w-28 rounded-lg bg-black object-cover"
                />
              ) : (
                <Image
                  src={url}
                  alt="Selected media"
                  width={112}
                  height={80}
                  unoptimized
                  className="h-20 w-28 rounded-lg object-cover"
                />
              )}

              <div className="min-w-0">
                <p className="text-sm font-semibold">Selected media</p>
                <p className="mt-1 truncate text-xs text-[#66746c]">
                  {mediaId
                    ? "Media library asset"
                    : "External / manual URL"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            className="rounded-full border border-[#056839] px-4 py-2 text-sm font-semibold text-[#056839] transition hover:bg-[#056839] hover:text-white"
          >
            Select from Media Library
          </button>

          <label className="inline-flex cursor-pointer items-center rounded-full border border-[#056839] px-4 py-2 text-sm font-semibold text-[#056839] transition hover:bg-[#056839] hover:text-white">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              className="hidden"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  void uploadFile(file);
                }

                event.target.value = "";
              }}
            />

            {uploading ? "Uploading..." : "Upload image"}
          </label>

          <span className="text-xs text-[#66746c]">
            JPG, PNG, WEBP, GIF or AVIF · Max 10 MB
          </span>
        </div>

        {message && (
          <p className="mt-2 text-xs text-[#056839]">{message}</p>
        )}
      </div>

      {libraryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setLibraryOpen(false);
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
                onClick={() => setLibraryOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#66746c] hover:bg-[#f8f7f1]"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6">
              {loadingLibrary && (
                <div className="py-12 text-center text-sm text-[#66746c]">
                  Loading media library...
                </div>
              )}

              {!loadingLibrary && libraryError && (
                <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  {libraryError}
                </div>
              )}

              {!loadingLibrary &&
                !libraryError &&
                media.length === 0 && (
                  <div className="rounded-xl border border-dashed border-[#dfe1d8] p-10 text-center">
                    <p className="font-semibold">No images found.</p>
                  </div>
                )}

              {!loadingLibrary &&
                !libraryError &&
                media.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {media.map((item) => {
                      const used = isInUse(item);

                      return (
                        <div
                          key={item.id}
                          className="overflow-hidden rounded-xl border border-[#e3e4dc] bg-white"
                        >
                          <button
                            type="button"
                            onClick={() => selectMedia(item)}
                            className="group block w-full text-left"
                          >
                            <div className="aspect-[4/3] overflow-hidden bg-[#f8f7f1]">
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
                            </div>

                            <div className="p-3">
                              <p className="truncate text-sm font-semibold">
                                {fileName(item.storageKey)}
                              </p>

                              <p className="mt-1 text-xs text-[#66746c]">
                                {formatFileSize(item.fileSize)}
                              </p>

                              <p className="mt-2 text-xs font-semibold text-[#056839]">
                                Select image →
                              </p>
                            </div>
                          </button>

                          <div className="flex items-center justify-between border-t border-[#e3e4dc] px-3 py-2">
                            <span className="text-[11px] text-[#66746c]">
                              {used ? "In use" : "Unused"}
                            </span>

                            <button
                              type="button"
                              disabled={used || deletingId === item.id}
                              onClick={(event) =>
                                void deleteMedia(event, item)
                              }
                              title={
                                used
                                  ? "This image is currently in use."
                                  : "Delete image"
                              }
                              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                                used
                                  ? "cursor-not-allowed text-[#a5aaa5]"
                                  : "text-red-700 hover:bg-red-50"
                              }`}
                            >
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
          </div>
        </div>
      )}
    </>
  );
}
