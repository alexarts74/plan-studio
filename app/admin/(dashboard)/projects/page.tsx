import Link from "next/link";
import { getAdminProjects, getAllCategories } from "@/lib/admin/queries";
import ProjectList from "./project-list";

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

      <div className="mb-6">
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/admin/projects"
            className={`px-3 py-1.5 text-sm rounded-lg ${
              !category ? "bg-gray-900 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Tous
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/admin/projects?category=${cat.id}`}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                category === cat.id ? "bg-gray-900 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat.title}
            </Link>
          ))}
        </div>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500">Aucun projet.</p>
      ) : (
        <ProjectList projects={projects} />
      )}
    </div>
  );
}
