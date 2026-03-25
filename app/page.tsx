import Image from "next/image";
import { getStorageUrl } from "@/lib/storage-url";

export default function Home() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      <div className="animate-fade-in-slow flex flex-col items-center gap-8 px-6 text-center">
        <Image
          src={getStorageUrl("/images/logo.png")}
          alt="Plan Studio Paris"
          width={600}
          height={190}
          priority
          className="h-auto w-[280px] md:w-[400px] lg:w-[500px]"
        />
        <p className="animate-fade-in animate-delay-500 text-sm tracking-[0.3em] text-gray-500 uppercase">
          Production Visuelle &amp; Branding
        </p>
      </div>
    </div>
  );
}
