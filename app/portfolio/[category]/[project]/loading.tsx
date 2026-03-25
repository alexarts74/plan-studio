import SkeletonBlock from "@/components/SkeletonBlock";

const heights = ["h-64", "h-80", "h-96", "h-72", "h-88", "h-64"];

export default function ProjectLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-24">
      <SkeletonBlock className="mb-8 h-4 w-56" />
      <SkeletonBlock className="mb-12 h-10 w-72 md:h-12" delay={0.1} />

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {heights.map((h, i) => (
          <SkeletonBlock
            key={i}
            className={`mb-4 ${h} w-full`}
            delay={i * 0.1}
          />
        ))}
      </div>
    </div>
  );
}
