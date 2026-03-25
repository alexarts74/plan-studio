"use client";

import { useState, useTransition } from "react";

export default function DeleteButton({
  onDelete,
  label = "Supprimer",
  confirmMessage = "Confirmer la suppression ?",
}: {
  onDelete: () => Promise<void>;
  label?: string;
  confirmMessage?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600">{confirmMessage}</span>
        <button
          onClick={() => {
            startTransition(async () => {
              await onDelete();
              setConfirming(false);
            });
          }}
          disabled={isPending}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? "..." : "Oui"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
        >
          Non
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    >
      {label}
    </button>
  );
}
