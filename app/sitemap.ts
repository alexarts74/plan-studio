import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getCategories } from "@/lib/supabase/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getCategories();

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.url}/le-studio`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/portfolio`, changeFrequency: "weekly", priority: 0.9 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteConfig.url}/portfolio/${cat.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const projectPages: MetadataRoute.Sitemap = categories.flatMap((cat) => {
    const directProjects = (cat.projects ?? []).map((p) => ({
      url: `${siteConfig.url}/portfolio/${cat.slug}/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const subProjects = (cat.subcategories ?? []).flatMap((sub) =>
      sub.projects.map((p) => ({
        url: `${siteConfig.url}/portfolio/${cat.slug}/${p.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
    );

    return [...directProjects, ...subProjects];
  });

  return [...staticPages, ...categoryPages, ...projectPages];
}
