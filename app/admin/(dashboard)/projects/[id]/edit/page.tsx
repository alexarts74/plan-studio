import { getAdminProject, getAllCategories } from "@/lib/admin/queries";
import ProjectEditForm from "./form";
import ImageManager from "@/components/admin/ImageManager";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, categories] = await Promise.all([
    getAdminProject(id),
    getAllCategories(),
  ]);

  const sortedImages = [...(project.project_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Modifier le projet
      </h1>
      <div className="space-y-10">
        <ProjectEditForm project={project} categories={categories} />
        <hr className="border-gray-200" />
        <ImageManager projectId={id} initialImages={sortedImages} />
      </div>
    </div>
  );
}
