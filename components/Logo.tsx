import Image from "next/image";
import Link from "next/link";

export default function Logo({
  className = "",
  scrolled = false,
}: {
  className?: string;
  scrolled?: boolean;
}) {
  return (
    <Link href="/" className={`block ${className}`}>
      <Image
        src="/images/logo.png"
        alt="Plan Studio Paris"
        width={240}
        height={76}
        priority
        className={`h-auto transition-all duration-300 ${
          scrolled ? "w-[120px] md:w-[160px]" : "w-[180px] md:w-[240px]"
        }`}
      />
    </Link>
  );
}
