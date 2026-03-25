import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllCategorySlugs,
  getCategoryBySlug,
} from "@/lib/supabase/queries";
import ProjectCard from "@/components/ProjectCard";
import AnimatedSection from "@/components/AnimatedSection";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllCategorySlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.title,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const hasSubcategories = !!category.subcategories?.length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-24">
      <AnimatedSection>
        <h1 className="mb-4 text-4xl font-light tracking-tight md:text-5xl lg:text-6xl">
          {category.title}
        </h1>
        <p className="mb-10 md:mb-16 max-w-2xl text-lg text-gray-500">
          {category.description}
        </p>
      </AnimatedSection>

      {hasSubcategories ? (
        category.subcategories!.map((sub) => (
          <section key={sub.slug} className="mb-10 md:mb-16">
            <AnimatedSection>
              <h2 className="mb-8 text-2xl font-light tracking-tight">
                {sub.title}
              </h2>
            </AnimatedSection>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {sub.projects.map((project) => (
                <AnimatedSection key={project.slug}>
                  <ProjectCard
                    project={project}
                    href={`/portfolio/${slug}/${project.slug}`}
                  />
                </AnimatedSection>
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {(category.projects ?? []).map((project) => (
            <AnimatedSection key={project.slug}>
              <ProjectCard
                project={project}
                href={`/portfolio/${slug}/${project.slug}`}
              />
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}
