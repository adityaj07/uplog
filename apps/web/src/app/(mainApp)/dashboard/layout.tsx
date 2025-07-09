"use client";

import { formatPathToTitle } from "@/utils/formatPath";
import { usePathname } from "next/navigation";
import Header from "./_components/header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const pageName = formatPathToTitle(pathname);
  return (
    <div>
      <Header pageName={pageName} />
      {children}
    </div>
  );
}
