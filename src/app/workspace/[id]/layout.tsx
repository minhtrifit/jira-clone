import type { Metadata } from "next";
import { AppSidebar } from "@/components/Slidebar/AppSlidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppNavbar from "@/components/AppNavbar/AppNavbar";

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME ?? "Jira clone"} | My Workspace`,
  description: "Developed by minhtrifit",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full relative">
        <div className="w-full p-5 mt-0 mb-[43.19px]">
          <AppNavbar />
          <div className="mt-[60px]">{children}</div>
        </div>
        <footer className="bg-zinc-100 dark:bg-slate-900 w-full py-3 absolute bottom-0 flex items-center justify-center">
          <span className="text-[0.8rem]">Developed by minhtrifit with ❤️</span>
        </footer>
      </main>
    </SidebarProvider>
  );
}
