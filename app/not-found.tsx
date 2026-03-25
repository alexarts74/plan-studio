import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-6 text-center" style={{ minHeight: "calc(100vh - 10rem)" }}>
      <h1 className="mb-4 font-serif text-6xl font-light md:text-8xl">404</h1>
      <p className="mb-8 text-lg text-gray-500">
        Cette page n&apos;existe pas.
      </p>
      <Link
        href="/"
        className="border border-foreground px-8 py-3 text-sm tracking-widest uppercase transition-colors hover:bg-foreground hover:text-background"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
