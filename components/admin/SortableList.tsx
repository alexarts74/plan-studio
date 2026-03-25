"use client";

import { useState, useTransition } from "react";

export default function SortableList<T extends { id: string }>({
  items: initialItems,
  onReorder,
  renderItem,
}: {
  items: T[];
  onReorder: (orderedIds: string[]) => Promise<void>;
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  const [items, setItems] = useState(initialItems);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDragStart(index: number) {
    setDragIdx(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === index) return;

    const newItems = [...items];
    const [moved] = newItems.splice(dragIdx, 1);
    newItems.splice(index, 0, moved);
    setItems(newItems);
    setDragIdx(index);
  }

  function handleDragEnd() {
    setDragIdx(null);
    const orderedIds = items.map((item) => item.id);
    startTransition(async () => {
      await onReorder(orderedIds);
    });
  }

  return (
    <div className={`space-y-2 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      {items.map((item, idx) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDragEnd={handleDragEnd}
          className={`cursor-grab active:cursor-grabbing ${
            dragIdx === idx ? "opacity-50" : ""
          }`}
        >
          {renderItem(item, idx)}
        </div>
      ))}
    </div>
  );
}
