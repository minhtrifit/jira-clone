import type { Metadata } from "next";
import { ModeToggle } from "@/components/ModeToggle/ModeToggle";
import { AppSidebar } from "@/components/Slidebar/AppSlidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NotificationBtn from "@/components/NotificationBtn/NotificationBtn";

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
          <div className="mb-5 flex items-center justify-between gap-3">
            <SidebarTrigger />

            <div className="flex items-center gap-3">
              <NotificationBtn />
              <ModeToggle />
            </div>
          </div>
          {children}
        </div>
        <footer className="bg-zinc-100 dark:bg-slate-900 w-full py-3 absolute bottom-0 flex items-center justify-center">
          <span className="text-[0.8rem]">Developed by minhtrifit with ❤️</span>
        </footer>
      </main>
    </SidebarProvider>
  );
}
