import type { Metadata } from "next";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Le Studio",
  description:
    "Découvrez Plan Studio Paris, studio de production visuelle et branding haut de gamme basé à Paris.",
};

export default function LeStudioPage() {
  return (
    <div className="fixed inset-0 flex flex-col justify-center mx-auto max-w-3xl px-6 overflow-hidden">
      <AnimatedSection>
        <h1 className="mb-8 text-4xl font-light tracking-tight md:text-5xl">
          Le Studio
        </h1>
      </AnimatedSection>

      <div className="space-y-5 text-base leading-relaxed text-gray-500">
        <AnimatedSection>
          <p>
            Plan Studio Paris est un studio de production visuelle haut de gamme,
            fondé avec la conviction que chaque image raconte une histoire. Basés au
            c&oelig;ur de Paris, nous accompagnons marques et créateurs dans la
            construction de leur identité visuelle.
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <p>
            Notre approche allie direction artistique pointue et exécution technique
            irréprochable. De la photographie corporate aux shootings portraits, de
            la création de marque à la production événementielle, nous mettons notre
            expertise au service de projets d&apos;exception.
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <p>
            Chaque collaboration est unique. Nous travaillons en étroite relation
            avec nos clients pour comprendre leur vision, leur univers et leurs
            ambitions. Le résultat : des images qui transcendent le simple visuel
            pour devenir de véritables outils de communication.
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <p>
            Notre studio réunit photographes, directeurs artistiques et spécialistes
            du branding, unis par une même exigence de qualité et un goût prononcé
            pour l&apos;élégance. Nous croyons en la puissance de l&apos;image
            maîtrisée, sobre et impactante.
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}
