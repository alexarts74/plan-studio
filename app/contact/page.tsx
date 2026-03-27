import type { Metadata } from "next";
import AnimatedSection from "@/components/AnimatedSection";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Plan Studio Paris pour vos projets de production visuelle et branding.",
  openGraph: {
    title: "Contact",
    description:
      "Contactez Plan Studio Paris pour vos projets de production visuelle et branding.",
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-24">
      <AnimatedSection>
        <h1 className="mb-4 text-4xl font-light tracking-tight md:text-5xl lg:text-6xl">
          Contact
        </h1>
        <p className="mb-12 text-lg text-gray-500">
          Une idée de projet ? Discutons-en.
        </p>
      </AnimatedSection>

      <div className="grid gap-10 md:gap-16 md:grid-cols-2">
        <AnimatedSection>
          <ContactForm />
        </AnimatedSection>

        <AnimatedSection>
          <div className="space-y-10 md:pl-8">
            <div>
              <h2 className="mb-4 text-lg font-medium tracking-tight">Par email</h2>
              <a
                href="mailto:contact.studioplan@gmail.com"
                className="text-gray-500 underline underline-offset-4 transition-colors hover:text-foreground"
              >
                contact.studioplan@gmail.com
              </a>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-medium tracking-tight">Réseaux sociaux</h2>
              <ul className="space-y-3 text-gray-500">
                <li>
                  <a
                    href="https://instagram.com/planstudio.paris"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/plan-studio-paris/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
