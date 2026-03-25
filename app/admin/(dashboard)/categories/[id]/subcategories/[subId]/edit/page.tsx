import { getAdminSubcategory } from "@/lib/admin/queries";
import SubcategoryEditForm from "./form";

export default async function EditSubcategoryPage({
  params,
}: {
  params: Promise<{ id: string; subId: string }>;
}) {
  const { id, subId } = await params;
  const subcategory = await getAdminSubcategory(subId);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Modifier la sous-categorie
      </h1>
      <SubcategoryEditForm categoryId={id} subcategory={subcategory} />
    </div>
  );
}
