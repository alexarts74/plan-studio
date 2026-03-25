"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import SortableList from "@/components/admin/SortableList";
import DeleteButton from "@/components/admin/DeleteButton";
import { reorderProjects, deleteProject } from "@/lib/admin/actions";

interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  sort_order: number;
  categories: { title: string; slug: string } | null;
  subcategories: { title: string } | null;
  project_images: { count: number }[];
}

export default function ProjectList({ projects }: { projects: ProjectRow[] }) {
  const router = useRouter();

  return (
    <SortableList
      items={projects}
      onReorder={reorderProjects}
      renderItem={(proj) => (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-gray-400 cursor-grab">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
              </svg>
            </span>
            <div>
              <p className="font-medium text-gray-900">{proj.title}</p>
              <p className="text-sm text-gray-500">
                {proj.categories?.title}
                {proj.subcategories?.title ? ` / ${proj.subcategories.title}` : ""}
                {" "}&middot; {proj.project_images[0]?.count ?? 0} images
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/projects/${proj.id}/edit`}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Modifier
            </Link>
            <DeleteButton
              onDelete={async () => {
                await deleteProject(proj.id);
                router.refresh();
              }}
            />
          </div>
        </div>
      )}
    />
  );
}
