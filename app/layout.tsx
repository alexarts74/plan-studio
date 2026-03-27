import type { Metadata } from "next";
import { cormorantGaramond, inter } from "@/lib/fonts";
import { siteConfig } from "@/lib/site-config";
import Navigation from "@/components/Navigation";
import ConditionalMain from "@/components/ConditionalMain";
import ConditionalFooter from "@/components/ConditionalFooter";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Plan Studio Paris — Production Visuelle & Branding",
    template: "%s | Plan Studio Paris",
  },
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.name,
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    email: siteConfig.email,
    sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin],
  };

  return (
    <html
      lang="fr"
      className={`${cormorantGaramond.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navigation />
        <ConditionalMain>{children}</ConditionalMain>
        <ConditionalFooter />
      </body>
    </html>
  );
}
