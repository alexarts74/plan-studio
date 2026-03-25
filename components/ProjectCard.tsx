import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/portfolio-data";

export default function ProjectCard({
  project,
  href,
}: {
  project: Project;
  href: string;
}) {
  const cover = project.images[0];
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-3 text-sm tracking-wide text-gray-600 transition-colors group-hover:text-foreground">
        {project.title}
      </h3>
    </Link>
  );
}
