import { createServerClient, createAnonClient } from "./server";
import type {
  Category,
  Subcategory,
  Project,
  PortfolioImage,
} from "@/lib/portfolio-data";

// ---- raw DB row types returned by Supabase nested selects ----

interface DbImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  sort_order: number;
}

interface DbProject {
  id: string;
  slug: string;
  title: string;
  video: string | null;
  sort_order: number;
  project_images: DbImage[];
}

interface DbSubcategory {
  id: string;
  slug: string;
  title: string;
  sort_order: number;
  projects: DbProject[];
}

interface DbCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image: string;
  sort_order: number;
  subcategories: DbSubcategory[];
  projects: DbProject[];
}

// ---- mappers ----

function mapImages(images: DbImage[]): PortfolioImage[] {
  return images
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(({ src, width, height, alt }) => ({ src, width, height, alt }));
}

function mapProject(p: DbProject): Project {
  return {
    slug: p.slug,
    title: p.title,
    images: mapImages(p.project_images),
    ...(p.video ? { video: p.video } : {}),
  };
}

function mapSubcategory(s: DbSubcategory): Subcategory {
  return {
    slug: s.slug,
    title: s.title,
    projects: s.projects
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapProject),
  };
}

function mapCategory(c: DbCategory): Category {
  const hasSubcategories = c.subcategories.length > 0;

  // Projects directly on the category (no subcategory)
  const directProjects = c.projects
    .filter(
      (p) =>
        !c.subcategories.some((s) =>
          s.projects.some((sp) => sp.id === p.id)
        )
    )
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(mapProject);

  return {
    slug: c.slug,
    title: c.title,
    description: c.description,
    coverImage: c.cover_image,
    ...(hasSubcategories
      ? {
          subcategories: c.subcategories
            .sort((a, b) => a.sort_order - b.sort_order)
            .map(mapSubcategory),
        }
      : { projects: directProjects }),
  };
}

// ---- public query helpers ----

const CATEGORY_SELECT = `
  id, slug, title, description, cover_image, sort_order,
  subcategories(
    id, slug, title, sort_order,
    projects(id, slug, title, video, sort_order, project_images(src, width, height, alt, sort_order))
  ),
  projects(id, slug, title, video, sort_order, project_images(src, width, height, alt, sort_order))
` as const;

export async function getCategories(): Promise<Category[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_SELECT)
    .order("sort_order");

  if (error) throw error;
  return (data as unknown as DbCategory[])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(mapCategory);
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return undefined;
  return mapCategory(data as unknown as DbCategory);
}

export async function findProjectBySlug(
  categorySlug: string,
  projectSlug: string
): Promise<
  { category: Category; project: Project; subcategory?: Subcategory } | undefined
> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return undefined;

  if (category.projects) {
    const project = category.projects.find((p) => p.slug === projectSlug);
    if (project) return { category, project };
  }

  if (category.subcategories) {
    for (const sub of category.subcategories) {
      const project = sub.projects.find((p) => p.slug === projectSlug);
      if (project) return { category, project, subcategory: sub };
    }
  }

  return undefined;
}

export async function getAllCategorySlugs(): Promise<{ category: string }[]> {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("categories")
    .select("slug");

  if (error) throw error;
  return (data ?? []).map((c) => ({ category: c.slug }));
}

export async function getAllProjectParams(): Promise<
  { category: string; project: string }[]
> {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("projects")
    .select("slug, categories!inner(slug)");

  if (error) throw error;

  return (data ?? []).map((row) => ({
    category: (row.categories as unknown as { slug: string }).slug,
    project: row.slug,
  }));
}
