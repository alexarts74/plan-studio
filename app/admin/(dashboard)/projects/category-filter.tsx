"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  id: string;
  title: string;
}

export default function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category");

  function handleFilter(categoryId?: string) {
    if (categoryId) {
      router.push(`/admin/projects?category=${categoryId}`);
    } else {
      router.push("/admin/projects");
    }
    router.refresh();
  }

  return (
    <div className="mb-6">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => handleFilter()}
          className={`px-3 py-1.5 text-sm rounded-lg ${
            !current ? "bg-gray-900 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          Tous
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleFilter(cat.id)}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              current === cat.id ? "bg-gray-900 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>
    </div>
  );
}
