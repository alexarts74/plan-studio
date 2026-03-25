import SkeletonBlock from "@/components/SkeletonBlock";

export default function PortfolioLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-24">
      <SkeletonBlock className="mb-16 h-12 w-48 md:h-14" />

      <div className="grid gap-6 md:gap-8 md:grid-cols-2">
        {[0, 1].map((i) => (
          <SkeletonBlock key={i} className="aspect-[4/5]" delay={i * 0.15} />
        ))}
      </div>
    </div>
  );
}
