export default function SkeletonBlock({
  className = "",
  delay,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`skeleton-block rounded ${className}`}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    />
  );
}
