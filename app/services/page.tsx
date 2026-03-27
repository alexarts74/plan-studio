import type { Metadata } from "next";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Production visuelle, branding et direction artistique — les services de Plan Studio Paris.",
  openGraph: {
    title: "Services",
    description:
      "Production visuelle, branding et direction artistique — les services de Plan Studio Paris.",
  },
};

const services = [
  {
    title: "Production Visuelle",
    description:
      "Photographie professionnelle pour tous vos besoins : corporate, portraits, food, architecture d'intérieur et couverture événementielle. Chaque shooting est pensé comme une création sur-mesure.",
    details: [
      "Photographie corporate",
      "Portraits & book",
      "Photographie culinaire",
      "Architecture & espaces",
      "Événementiel",
    ],
  },
  {
    title: "Branding",
    description:
      "Création et refonte d'identité visuelle complète. Du logo à la charte graphique, nous construisons des marques cohérentes et mémorables qui reflètent l'essence de votre projet.",
    details: [
      "Identité visuelle",
      "Logo & charte graphique",
      "Packaging",
      "Supports de communication",
      "Brand guidelines",
    ],
  },
  {
    title: "Direction Artistique",
    description:
      "Conception et supervision créative de vos projets visuels. Nous définissons l'univers esthétique, coordonnons les équipes et garantissons une cohérence artistique à chaque étape.",
    details: [
      "Conception créative",
      "Moodboards & univers visuels",
      "Coordination de production",
      "Stylisme & mise en scène",
      "Post-production",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 md:min-h-[calc(100vh-6rem)] md:flex md:flex-col md:justify-center">
      <AnimatedSection>
        <h1 className="mb-10 md:mb-16 text-4xl font-light tracking-tight md:text-5xl lg:text-6xl">
          Nos Services
        </h1>
      </AnimatedSection>

      <div className="grid gap-8 md:grid-cols-3 md:gap-8 lg:gap-16">
        {services.map((service, i) => (
          <AnimatedSection key={service.title}>
            <div
              className="space-y-6"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <h2 className="text-2xl font-light tracking-tight md:text-3xl">
                {service.title}
              </h2>
              <p className="text-base leading-relaxed text-gray-500">
                {service.description}
              </p>
              <ul className="space-y-2 border-t border-gray-200 pt-6 text-sm text-gray-600">
                {service.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
