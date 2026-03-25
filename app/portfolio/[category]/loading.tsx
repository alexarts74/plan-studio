import SkeletonBlock from "@/components/SkeletonBlock";

export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-24">
      <SkeletonBlock className="mb-4 h-12 w-64 md:h-14" />
      <SkeletonBlock className="mb-10 md:mb-16 h-6 w-96 max-w-full" delay={0.1} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i}>
            <SkeletonBlock className="aspect-[3/4]" delay={i * 0.08} />
            <SkeletonBlock className="mt-3 h-4 w-24" delay={i * 0.08 + 0.05} />
          </div>
        ))}
      </div>
    </div>
  );
}
