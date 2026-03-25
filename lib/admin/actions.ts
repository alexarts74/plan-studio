"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";

async function getAuthenticatedClient() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autorise");
  return supabase;
}

// ---- Categories ----

export async function createCategory(formData: FormData) {
  const supabase = await getAuthenticatedClient();
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const cover_image = formData.get("cover_image") as string;

  const { data: maxOrder } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const { error } = await supabase.from("categories").insert({
    title,
    slug,
    description: description || "",
    cover_image: cover_image || "",
    sort_order: (maxOrder?.sort_order ?? -1) + 1,
  });

  if (error) throw error;
  revalidatePath("/admin/categories");
  revalidatePath("/portfolio");
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await getAuthenticatedClient();
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const cover_image = formData.get("cover_image") as string;

  const { error } = await supabase
    .from("categories")
    .update({ title, slug, description, cover_image })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/categories");
  revalidatePath("/portfolio");
}

export async function deleteCategory(id: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/categories");
  revalidatePath("/portfolio");
}

export async function reorderCategories(orderedIds: string[]) {
  const supabase = await getAuthenticatedClient();
  const updates = orderedIds.map((id, index) =>
    supabase.from("categories").update({ sort_order: index }).eq("id", id)
  );
  await Promise.all(updates);
  revalidatePath("/admin/categories");
  revalidatePath("/portfolio");
}

// ---- Subcategories ----

export async function createSubcategory(formData: FormData) {
  const supabase = await getAuthenticatedClient();
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const category_id = formData.get("category_id") as string;

  const { data: maxOrder } = await supabase
    .from("subcategories")
    .select("sort_order")
    .eq("category_id", category_id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const { error } = await supabase.from("subcategories").insert({
    title,
    slug,
    category_id,
    sort_order: (maxOrder?.sort_order ?? -1) + 1,
  });

  if (error) throw error;
  revalidatePath("/admin/categories");
  revalidatePath("/portfolio");
}

export async function updateSubcategory(id: string, formData: FormData) {
  const supabase = await getAuthenticatedClient();
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;

  const { error } = await supabase
    .from("subcategories")
    .update({ title, slug })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/categories");
  revalidatePath("/portfolio");
}

export async function deleteSubcategory(id: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from("subcategories").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/categories");
  revalidatePath("/portfolio");
}

export async function reorderSubcategories(orderedIds: string[]) {
  const supabase = await getAuthenticatedClient();
  const updates = orderedIds.map((id, index) =>
    supabase.from("subcategories").update({ sort_order: index }).eq("id", id)
  );
  await Promise.all(updates);
  revalidatePath("/admin/categories");
  revalidatePath("/portfolio");
}

// ---- Projects ----

export async function createProject(formData: FormData) {
  const supabase = await getAuthenticatedClient();
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const category_id = formData.get("category_id") as string;
  const subcategory_id = (formData.get("subcategory_id") as string) || null;
  const video = (formData.get("video") as string) || null;

  const { data: maxOrder } = await supabase
    .from("projects")
    .select("sort_order")
    .eq("category_id", category_id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      title,
      slug,
      category_id,
      subcategory_id,
      video,
      sort_order: (maxOrder?.sort_order ?? -1) + 1,
    })
    .select("id")
    .single();

  if (error) throw error;
  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
  return data.id;
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await getAuthenticatedClient();
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const category_id = formData.get("category_id") as string;
  const subcategory_id = (formData.get("subcategory_id") as string) || null;
  const video = (formData.get("video") as string) || null;

  const { error } = await supabase
    .from("projects")
    .update({ title, slug, category_id, subcategory_id, video })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
}

export async function deleteProject(id: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
}

export async function reorderProjects(orderedIds: string[]) {
  const supabase = await getAuthenticatedClient();
  const updates = orderedIds.map((id, index) =>
    supabase.from("projects").update({ sort_order: index }).eq("id", id)
  );
  await Promise.all(updates);
  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
}

// ---- Project Images ----

export async function addProjectImages(
  projectId: string,
  images: { src: string; width: number; height: number; alt: string }[]
) {
  const supabase = await getAuthenticatedClient();

  const { data: maxOrder } = await supabase
    .from("project_images")
    .select("sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  let nextOrder = (maxOrder?.sort_order ?? -1) + 1;

  const rows = images.map((img) => ({
    project_id: projectId,
    src: img.src,
    width: img.width,
    height: img.height,
    alt: img.alt,
    sort_order: nextOrder++,
  }));

  const { error } = await supabase.from("project_images").insert(rows);
  if (error) throw error;
  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
}

export async function deleteProjectImage(id: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from("project_images").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
}

export async function reorderProjectImages(orderedIds: string[]) {
  const supabase = await getAuthenticatedClient();
  const updates = orderedIds.map((id, index) =>
    supabase.from("project_images").update({ sort_order: index }).eq("id", id)
  );
  await Promise.all(updates);
  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
}
