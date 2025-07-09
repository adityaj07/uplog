"use client";

import { Separator } from "@/components/ui/separator";
import { formatPathToTitle } from "@/utils/formatPath";
import { usePathname } from "next/navigation";
import Header from "./_components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageName = formatPathToTitle(pathname);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Shared padding container */}
      <div className="px-4 md:px-8 max-w-6xl w-full mx-auto">
        <Header pageName={pageName} />
        <Separator />
      </div>

      {/* <Separator /> */}

      <main className="flex flex-1 overflow-y-auto px-4 md:px-8 max-w-6xl w-full mx-auto py-3 md:py-6">
        {children}
      </main>
    </div>
  );
}
