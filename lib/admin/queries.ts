import { createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type SubcategoryRow = Database["public"]["Tables"]["subcategories"]["Row"];
type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ProjectImageRow = Database["public"]["Tables"]["project_images"]["Row"];

export async function getDashboardCounts() {
  const supabase = await createServerClient();

  const [categories, subcategories, projects, images] = await Promise.all([
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("subcategories").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("project_images").select("id", { count: "exact", head: true }),
  ]);

  return {
    categories: categories.count ?? 0,
    subcategories: subcategories.count ?? 0,
    projects: projects.count ?? 0,
    images: images.count ?? 0,
  };
}

export async function getAdminCategories() {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*, subcategories(count), projects(count)")
    .order("sort_order");
  if (error) throw error;
  return data as (CategoryRow & {
    subcategories: { count: number }[];
    projects: { count: number }[];
  })[];
}

export async function getAdminCategory(id: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as CategoryRow;
}

export async function getAdminSubcategories(categoryId: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("subcategories")
    .select("*, projects(count)")
    .eq("category_id", categoryId)
    .order("sort_order");
  if (error) throw error;
  return data as (SubcategoryRow & {
    projects: { count: number }[];
  })[];
}

export async function getAdminSubcategory(id: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("subcategories")
    .select("*, categories(title)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as SubcategoryRow & { categories: { title: string } };
}

export async function getAdminProjects(categoryId?: string) {
  const supabase = await createServerClient();
  let query = supabase
    .from("projects")
    .select("*, categories(title, slug), subcategories(title), project_images(count)")
    .order("sort_order");

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as (ProjectRow & {
    categories: { title: string; slug: string } | null;
    subcategories: { title: string } | null;
    project_images: { count: number }[];
  })[];
}

export async function getAdminProject(id: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as ProjectRow & { project_images: ProjectImageRow[] };
}

export async function getAllCategories() {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, title, slug")
    .order("sort_order");
  if (error) throw error;
  return data as { id: string; title: string; slug: string }[];
}

export async function getSubcategoriesForCategory(categoryId: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("subcategories")
    .select("id, title, slug")
    .eq("category_id", categoryId)
    .order("sort_order");
  if (error) throw error;
  return data as { id: string; title: string; slug: string }[];
}
