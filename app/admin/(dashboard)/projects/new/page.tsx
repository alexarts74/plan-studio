import { getAllCategories } from "@/lib/admin/queries";
import NewProjectForm from "./form";

export default async function NewProjectPage() {
  const categories = await getAllCategories();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Nouveau projet
      </h1>
      <NewProjectForm categories={categories} />
    </div>
  );
}
