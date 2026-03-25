import Link from "next/link";
import { getAdminCategory, getAdminSubcategories } from "@/lib/admin/queries";
import SubcategoryList from "./subcategory-list";

export default async function AdminSubcategoriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [category, subcategories] = await Promise.all([
    getAdminCategory(id),
    getAdminSubcategories(id),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/categories" className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Categories
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 mt-1">
            Sous-categories de &laquo;{category.title}&raquo;
          </h1>
        </div>
        <Link
          href={`/admin/categories/${id}/subcategories/new`}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
        >
          Nouvelle sous-categorie
        </Link>
      </div>

      {subcategories.length === 0 ? (
        <p className="text-gray-500">Aucune sous-categorie.</p>
      ) : (
        <SubcategoryList categoryId={id} subcategories={subcategories} />
      )}
    </div>
  );
}
