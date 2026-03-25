"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/admin/actions";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface CategoryOption {
  id: string;
  title: string;
  slug: string;
}

interface SubcategoryOption {
  id: string;
  title: string;
}

export default function NewProjectForm({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [subcategories, setSubcategories] = useState<SubcategoryOption[]>([]);

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

  function slugify(text: string) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (!formData.get("slug")) {
      formData.set("slug", slugify(formData.get("title") as string));
    }
    const projectId = await createProject(formData);
    router.push(`/admin/projects/${projectId}/edit`);
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
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          Slug (auto-genere si vide)
        </label>
        <input
          id="slug"
          name="slug"
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
          <option value="">Selectionner...</option>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Creation..." : "Creer et ajouter des images"}
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
