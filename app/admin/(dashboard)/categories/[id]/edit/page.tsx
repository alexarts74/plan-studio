import { getAdminCategory } from "@/lib/admin/queries";
import CategoryEditForm from "./form";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getAdminCategory(id);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Modifier la categorie
      </h1>
      <CategoryEditForm category={category} />
    </div>
  );
}
