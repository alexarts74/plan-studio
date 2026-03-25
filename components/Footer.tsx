import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <p className="font-serif text-sm tracking-widest uppercase">
          Plan Studio Paris
        </p>
        <nav className="flex gap-6 text-sm text-gray-500">
          <Link href="/le-studio" className="transition-colors hover:text-foreground">
            Le Studio
          </Link>
          <Link href="/services" className="transition-colors hover:text-foreground">
            Services
          </Link>
          <Link href="/portfolio" className="transition-colors hover:text-foreground">
            Portfolio
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">
            Contact
          </Link>
        </nav>
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Plan Studio Paris
        </p>
      </div>
    </footer>
  );
}
