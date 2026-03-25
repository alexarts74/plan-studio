"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import SortableList from "@/components/admin/SortableList";
import DeleteButton from "@/components/admin/DeleteButton";
import { reorderCategories, deleteCategory } from "@/lib/admin/actions";

interface CategoryRow {
  id: string;
  title: string;
  slug: string;
  sort_order: number;
  subcategories: { count: number }[];
  projects: { count: number }[];
}

export default function CategoryList({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();

  return (
    <SortableList
      items={categories}
      onReorder={reorderCategories}
      renderItem={(cat) => (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-gray-400 cursor-grab">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
              </svg>
            </span>
            <div>
              <p className="font-medium text-gray-900">{cat.title}</p>
              <p className="text-sm text-gray-500">
                /{cat.slug} &middot; {cat.subcategories[0]?.count ?? 0} sous-cat. &middot; {cat.projects[0]?.count ?? 0} projets
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/categories/${cat.id}/subcategories`}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Sous-categories
            </Link>
            <Link
              href={`/admin/categories/${cat.id}/edit`}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Modifier
            </Link>
            <DeleteButton
              onDelete={async () => {
                await deleteCategory(cat.id);
                router.refresh();
              }}
            />
          </div>
        </div>
      )}
    />
  );
}
