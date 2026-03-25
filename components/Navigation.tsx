"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/le-studio", label: "Le Studio" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-sm shadow-sm py-2 md:py-3"
            : "py-4 md:py-6"
        }`}
      >
        <Logo scrolled={scrolled} />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5"
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <span
            className={`block h-[1.5px] bg-foreground transition-all duration-300 ${
              scrolled ? "w-5" : "w-6"
            } ${isOpen ? "translate-y-[4.5px] rotate-45" : ""}`}
          />
          <span
            className={`block h-[1.5px] bg-foreground transition-all duration-300 ${
              scrolled ? "w-5" : "w-6"
            } ${isOpen ? "-translate-y-[4.5px] -rotate-45" : ""}`}
          />
        </button>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-white">
          <nav className="flex flex-col items-center gap-6 sm:gap-8">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`font-serif text-2xl sm:text-3xl font-light tracking-wide transition-colors hover:text-gray-400 md:text-5xl animate-fade-in ${
                  pathname === link.href ? "text-gray-400" : "text-foreground"
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
