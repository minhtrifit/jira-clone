"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SLIDEBAR_ITEM_TYPE } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getFirstLetterUppercase } from "@/lib/utils";
import Link from "next/link";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";

interface PropType {
  items: SLIDEBAR_ITEM_TYPE[];
}

export function NavProjects(props: PropType) {
  const { items } = props;

  const { workspace }: WorkspaceStoreState = useWorkspaceStore();

  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {items?.map((item: SLIDEBAR_ITEM_TYPE, index: number) => {
          if (index < 3) {
            return (
              <SidebarMenuItem key={item.title} className="my-1">
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <Avatar className="h-6 w-6 rounded-md">
                      <AvatarImage
                        src={item?.icon as string}
                        alt={item?.title}
                      />
                      <AvatarFallback className="rounded-md bg-primary text-white text-[0.7rem]">
                        {item?.title
                          ? getFirstLetterUppercase(item?.title)
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-48 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem>
                      <Folder className="text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Forward className="text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
          }
        })}

        <Link href={`/workspace/${workspace?.id}/project`}>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </Link>
      </SidebarMenu>
    </SidebarGroup>
  );
}
