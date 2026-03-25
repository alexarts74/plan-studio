"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProject } from "@/lib/admin/actions";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

import type { Database } from "@/lib/supabase/types";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export default function ProjectEditForm({
  project,
  categories,
}: {
  project: Project;
  categories: { id: string; title: string; slug: string }[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(project.category_id);
  const [subcategories, setSubcategories] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("subcategories")
      .select("id, title")
      .eq("category_id", categoryId)
      .order("sort_order")
      .then(({ data }) => setSubcategories(data ?? []));
  }, [categoryId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await updateProject(project.id, formData);
    router.push("/admin/projects");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Titre
        </label>
        <input
          id="title"
          name="title"
          defaultValue={project.title}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={project.slug}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
      <div>
        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
          Categorie
        </label>
        <select
          id="category_id"
          name="category_id"
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>
      {subcategories.length > 0 && (
        <div>
          <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700 mb-1">
            Sous-categorie (optionnel)
          </label>
          <select
            id="subcategory_id"
            name="subcategory_id"
            defaultValue={project.subcategory_id ?? ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="">Aucune</option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.title}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-1">
          URL video (optionnel)
        </label>
        <input
          id="video"
          name="video"
          type="url"
          defaultValue={project.video ?? ""}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-white border border-gray-300 text-sm rounded-lg hover:bg-gray-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
