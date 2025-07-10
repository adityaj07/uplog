import { AppSidebar } from "@/components/app-sidebar";
import AppFooter from "@/components/footer";
import { HeroHeader } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <HeroHeader />
      {children}
      <AppFooter />
    </div>
  );
}
