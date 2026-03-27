import Link from "next/link";
import { getAdminProjects, getAllCategories } from "@/lib/admin/queries";
import ProjectList from "./project-list";
import CategoryFilter from "./category-filter";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [projects, categories] = await Promise.all([
    getAdminProjects(category),
    getAllCategories(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Projets</h1>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
        >
          Nouveau projet
        </Link>
      </div>

      <CategoryFilter categories={categories} />

      {projects.length === 0 ? (
        <p className="text-gray-500">Aucun projet.</p>
      ) : (
        <ProjectList key={category ?? "all"} projects={projects} />
      )}
    </div>
  );
}
