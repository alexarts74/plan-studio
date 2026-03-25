import Link from "next/link";
import { getAdminCategories } from "@/lib/admin/queries";
import CategoryList from "./category-list";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
        >
          Nouvelle categorie
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500">Aucune categorie.</p>
      ) : (
        <CategoryList categories={categories} />
      )}
    </div>
  );
}
