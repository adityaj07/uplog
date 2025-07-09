import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="border border-border/50 bg-background backdrop-blur-sm shadow-2xl">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
