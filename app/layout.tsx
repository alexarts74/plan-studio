import type { Metadata } from "next";
import { cormorantGaramond, inter } from "@/lib/fonts";
import Navigation from "@/components/Navigation";
import ConditionalMain from "@/components/ConditionalMain";
import ConditionalFooter from "@/components/ConditionalFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Plan Studio Paris — Production Visuelle & Branding",
    template: "%s | Plan Studio Paris",
  },
  description:
    "Studio de production visuelle et branding haut de gamme basé à Paris. Photographie corporate, portraits, food, espaces, événementiel et direction artistique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${cormorantGaramond.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navigation />
        <ConditionalMain>{children}</ConditionalMain>
        <ConditionalFooter />
      </body>
    </html>
  );
}
