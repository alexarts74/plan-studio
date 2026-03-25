import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/portfolio-data";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Découvrez nos réalisations en production visuelle et branding.",
};

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <AnimatedSection>
        <h1 className="mb-16 text-4xl font-light tracking-tight md:text-5xl lg:text-6xl">
          Portfolio
        </h1>
      </AnimatedSection>

      <div className="grid gap-8 md:grid-cols-2">
        {categories.map((cat) => (
          <AnimatedSection key={cat.slug}>
            <Link
              href={`/portfolio/${cat.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                <Image
                  src={cat.coverImage}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:bg-black/30" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h2 className="font-serif text-3xl font-light tracking-wide md:text-4xl">
                    {cat.title}
                  </h2>
                  <p className="mt-2 text-sm tracking-widest uppercase opacity-80">
                    Voir les projets
                  </p>
                </div>
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
