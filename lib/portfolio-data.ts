export interface PortfolioImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface Project {
  slug: string;
  title: string;
  images: PortfolioImage[];
  video?: string;
}

export interface Subcategory {
  slug: string;
  title: string;
  projects: Project[];
}

export interface Category {
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  subcategories?: Subcategory[];
  projects?: Project[];
}

import { getStorageUrl } from "./storage-url";

function generateImages(
  category: string,
  project: string,
  count: number,
  width: number,
  height: number,
  subcategory?: string,
  title?: string
): PortfolioImage[] {
  const base = subcategory
    ? `/images/${category}/${subcategory}/${project}`
    : `/images/${category}/${project}`;
  return Array.from({ length: count }, (_, i) => ({
    src: getStorageUrl(`${base}/${project}-${String(i + 1).padStart(2, "0")}.jpg`),
    width,
    height,
    alt: `${title || project} — photo ${i + 1}`,
  }));
}

export const categories: Category[] = [
  {
    slug: "production-visuelle",
    title: "Production Visuelle",
    description:
      "Photographie professionnelle pour tous vos besoins visuels : corporate, portraits, food, espaces et événementiel.",
    coverImage: getStorageUrl("/images/production-visuelle/portraits/camille-delonnay/camille-delonnay-01.jpg"),
    subcategories: [
      {
        slug: "corporate",
        title: "Corporate",
        projects: [
          {
            slug: "linker",
            title: "Linker",
            images: generateImages("production-visuelle", "linker", 5, 2400, 3600, "corporate", "Linker"),
          },
          {
            slug: "orixa-media",
            title: "Orixa Media",
            images: generateImages("production-visuelle", "orixa-media", 5, 2400, 1600, "corporate", "Orixa Media"),
          },
          {
            slug: "other",
            title: "Other",
            images: generateImages("production-visuelle", "other", 5, 2400, 3283, "corporate", "Other"),
          },
        ],
      },
      {
        slug: "portraits",
        title: "Portraits",
        projects: [
          {
            slug: "ally",
            title: "Ally",
            images: generateImages("production-visuelle", "ally", 7, 2400, 3494, "portraits", "Ally"),
          },
          {
            slug: "camille-delonnay",
            title: "Camille Delonnay",
            images: generateImages("production-visuelle", "camille-delonnay", 12, 2400, 3600, "portraits", "Camille Delonnay"),
          },
          {
            slug: "charles",
            title: "Charles",
            images: generateImages("production-visuelle", "charles", 8, 2400, 3600, "portraits", "Charles"),
          },
          {
            slug: "jade-soussan",
            title: "Jade Soussan",
            images: generateImages("production-visuelle", "jade-soussan", 8, 2400, 3600, "portraits", "Jade Soussan"),
          },
          {
            slug: "lea-elkrog",
            title: "Léa Elkrog",
            images: generateImages("production-visuelle", "lea-elkrog", 10, 1536, 2304, "portraits", "Léa Elkrog"),
          },
          {
            slug: "max",
            title: "Max",
            images: generateImages("production-visuelle", "max", 8, 1536, 2304, "portraits", "Max"),
          },
          {
            slug: "ola",
            title: "Ola",
            images: generateImages("production-visuelle", "ola", 5, 2400, 3199, "portraits", "Ola"),
          },
          {
            slug: "onerva-odelma",
            title: "Onerva Odelma",
            images: generateImages("production-visuelle", "onerva-odelma", 7, 2400, 3600, "portraits", "Onerva Odelma"),
          },
          {
            slug: "sami-daara",
            title: "Sami Daara",
            images: generateImages("production-visuelle", "sami-daara", 6, 2160, 2700, "portraits", "Sami Daara"),
          },
        ],
      },
      {
        slug: "food",
        title: "Food",
        projects: [
          {
            slug: "neulo",
            title: "Neulo",
            images: generateImages("production-visuelle", "neulo", 6, 2400, 2400, "food", "Neulo"),
          },
          {
            slug: "yazid-at-home",
            title: "Yazid at Home",
            images: generateImages("production-visuelle", "yazid-at-home", 6, 1644, 2048, "food", "Yazid at Home"),
          },
        ],
      },
      {
        slug: "espace",
        title: "Espace",
        projects: [
          {
            slug: "bain-foch",
            title: "Bain Foch",
            images: generateImages("production-visuelle", "bain-foch", 8, 2400, 3600, "espace", "Bain Foch"),
          },
          {
            slug: "chalet-des-iles",
            title: "Châlet des Îles",
            images: generateImages("production-visuelle", "chalet-des-iles", 7, 2400, 3600, "espace", "Châlet des Îles"),
          },
        ],
      },
      {
        slug: "event",
        title: "Event",
        projects: [
          {
            slug: "castle-club",
            title: "Castle Club",
            images: generateImages("production-visuelle", "castle-club", 6, 1536, 2304, "event", "Castle Club"),
          },
          {
            slug: "chantilly",
            title: "Chantilly",
            images: generateImages("production-visuelle", "chantilly", 7, 1536, 2304, "event", "Chantilly"),
          },
        ],
      },
    ],
  },
  {
    slug: "branding",
    title: "Branding",
    description:
      "Identité visuelle complète, direction artistique et création de marque pour des projets d'exception.",
    coverImage: getStorageUrl("/images/branding/domolovi/domolovi-01.jpg"),
    projects: [
      {
        slug: "maison-heritage",
        title: "Maison Héritage",
        images: generateImages("branding", "maison-heritage", 6, 1024, 1070, undefined, "Maison Héritage"),
      },
      {
        slug: "renew",
        title: "Renew",
        images: generateImages("branding", "renew", 4, 1024, 1536, undefined, "Renew"),
      },
      {
        slug: "enza",
        title: "Enza",
        images: generateImages("branding", "enza", 3, 1272, 1605, undefined, "Enza"),
      },
      {
        slug: "domolovi",
        title: "Domolovi",
        images: generateImages("branding", "domolovi", 6, 1282, 1603, undefined, "Domolovi"),
        video: getStorageUrl("/videos/domolovi.mp4"),
      },
      {
        slug: "maison-martine",
        title: "Maison Martine",
        images: generateImages("branding", "maison-martine", 7, 2400, 3200, undefined, "Maison Martine"),
      },
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getAllProjects(category: Category): Project[] {
  if (category.projects) return category.projects;
  return category.subcategories?.flatMap((s) => s.projects) ?? [];
}

export function findProject(
  categorySlug: string,
  projectSlug: string
): { category: Category; project: Project; subcategory?: Subcategory } | undefined {
  const category = getCategory(categorySlug);
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
