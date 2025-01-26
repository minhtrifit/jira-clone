import type { Metadata } from "next";
import { ModeToggle } from "@/components/ModeToggle/ModeToggle";
import { AppSidebar } from "@/components/Slidebar/AppSlidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <SidebarTrigger />
          <ModeToggle />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
