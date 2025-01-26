"use client";

import {
  Frame,
  Map,
  PieChart,
  Settings,
  House,
  CircleCheckBig,
} from "lucide-react";
import { NavMain } from "@/components/Slidebar/NavMain";
import { NavProjects } from "@/components/Slidebar/NavProjects";
import { NavUser } from "@/components/Slidebar/NavUser";
import { WorkspaceSwitcher } from "@/components/Slidebar/NavWorkspace";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "../providers/AuthProvider";
import { SLIDEBAR_ITEM_TYPE } from "@/types";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user }: any = useAuth();

  const { workspace }: WorkspaceStoreState = useWorkspaceStore();

  const MAIN_ITEMS: SLIDEBAR_ITEM_TYPE[] = [
    {
      title: "Home",
      url: `/workspace/${workspace?.id ?? "#"}`,
      icon: House,
      items: [],
    },
    {
      title: "My Tasks",
      url: `/workspace/${workspace?.id ?? "#"}/tasks`,
      icon: CircleCheckBig,
      items: [],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Workspace",
          url: "#",
        },
        {
          title: "Project",
          url: "#",
        },
      ],
    },
  ];

  const PROJECT_ITEMS: SLIDEBAR_ITEM_TYPE[] = [
    {
      title: "Design Engineering",
      url: `/workspace/${workspace?.id ?? "#"}/project/abc-123`,
      icon: "",
    },
    {
      title: "Fullstack Developing",
      url: `/workspace/${workspace?.id ?? "#"}/project/abc-123`,
      icon: "",
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={MAIN_ITEMS} />
        <NavProjects items={PROJECT_ITEMS} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
