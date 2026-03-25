"use client";

import { usePathname } from "next/navigation";

export default function ConditionalMain({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <main className={isAdmin ? "flex-1" : "flex-1 pt-20 md:pt-24"}>
      {children}
    </main>
  );
}
