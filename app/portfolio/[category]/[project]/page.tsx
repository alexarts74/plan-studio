import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, findProject } from "@/lib/portfolio-data";
import ImageGallery from "@/components/ImageGallery";
import AnimatedSection from "@/components/AnimatedSection";

export function generateStaticParams() {
  const params: { category: string; project: string }[] = [];
  for (const cat of categories) {
    if (cat.projects) {
      for (const proj of cat.projects) {
        params.push({ category: cat.slug, project: proj.slug });
      }
    }
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        for (const proj of sub.projects) {
          params.push({ category: cat.slug, project: proj.slug });
        }
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; project: string }>;
}): Promise<Metadata> {
  const { category, project } = await params;
  const result = findProject(category, project);
  if (!result) return {};
  return {
    title: `${result.project.title} — ${result.category.title}`,
    description: `${result.project.title} — projet ${result.category.title} par Plan Studio Paris.`,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ category: string; project: string }>;
}) {
  const { category: catSlug, project: projSlug } = await params;
  const result = findProject(catSlug, projSlug);
  if (!result) notFound();

  const { category, project, subcategory } = result;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-24">
      <AnimatedSection>
        <nav className="mb-8 text-sm text-gray-400">
          <Link href="/portfolio" className="hover:text-foreground transition-colors">
            Portfolio
          </Link>
          {" / "}
          <Link
            href={`/portfolio/${category.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {category.title}
          </Link>
          {subcategory && (
            <>
              {" / "}
              <span>{subcategory.title}</span>
            </>
          )}
        </nav>
        <h1 className="mb-12 text-3xl font-light tracking-tight md:text-4xl lg:text-5xl">
          {project.title}
        </h1>
      </AnimatedSection>

      <ImageGallery images={project.images} video={project.video} />
    </div>
  );
}
