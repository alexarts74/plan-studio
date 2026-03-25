"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { deleteProjectImage, reorderProjectImages, addProjectImages } from "@/lib/admin/actions";

interface ProjectImage {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  sort_order: number;
}

export default function ImageManager({
  projectId,
  initialImages,
}: {
  projectId: string;
  initialImages: ProjectImage[];
}) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const uploaded: { src: string; width: number; height: number; alt: string }[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/admin/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.url) {
        const dims = await getImageDimensions(data.url);
        uploaded.push({
          src: data.url,
          width: dims.width,
          height: dims.height,
          alt: file.name.replace(/\.[^.]+$/, ""),
        });
      }
    }

    if (uploaded.length > 0) {
      startTransition(async () => {
        await addProjectImages(projectId, uploaded);
        // Refresh by refetching - simplest approach
        window.location.reload();
      });
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ width: 800, height: 600 });
      img.src = url;
    });
  }

  function handleDelete(imageId: string) {
    startTransition(async () => {
      await deleteProjectImage(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    });
  }

  function handleDragStart(index: number) {
    setDragIdx(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === index) return;

    const newImages = [...images];
    const [moved] = newImages.splice(dragIdx, 1);
    newImages.splice(index, 0, moved);
    setImages(newImages);
    setDragIdx(index);
  }

  function handleDragEnd() {
    setDragIdx(null);
    const orderedIds = images.map((img) => img.id);
    startTransition(async () => {
      await reorderProjectImages(orderedIds);
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">
          Images ({images.length})
        </h3>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading || isPending}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {uploading ? "Upload..." : "Ajouter des images"}
          </button>
        </div>
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center border border-dashed border-gray-300 rounded-lg">
          Aucune image. Cliquez sur &quot;Ajouter des images&quot; pour commencer.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`relative group rounded-lg overflow-hidden border border-gray-200 cursor-grab active:cursor-grabbing ${
                dragIdx === idx ? "opacity-50" : ""
              }`}
            >
              <div className="aspect-square relative">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <button
                type="button"
                onClick={() => handleDelete(img.id)}
                disabled={isPending}
                className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm hover:bg-red-700"
              >
                x
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {idx + 1}. {img.alt}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
