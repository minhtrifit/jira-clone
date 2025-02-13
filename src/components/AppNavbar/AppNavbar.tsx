"use client";

import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/ModeToggle/ModeToggle";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import NotificationBtn from "@/components/NotificationBtn/NotificationBtn";

const AppNavbar = () => {
  const { state } = useSidebar();

  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`
        ${state === "expanded" && !isScrolled && "w-[calc(100%-280px)] z-20"}
        ${state === "collapsed" && !isScrolled && "w-[calc(100%-70px)] z-20"}
        ${
          state === "expanded" &&
          isScrolled &&
          "w-[calc(100%-295px)] z-20 right-5"
        }
        ${
          state === "collapsed" &&
          isScrolled &&
          "w-[calc(100%-90px)] z-20 right-5"
        }
        ${isScrolled && "border"}
        fixed transition-all duration-300 ease right-3 bg-background p-2 rounded-sm mb-5 flex items-center justify-between gap-3`}
    >
      <SidebarTrigger />

      <div className="flex items-center gap-3">
        <NotificationBtn />
        <ModeToggle />
      </div>
    </div>
  );
};

export default AppNavbar;
