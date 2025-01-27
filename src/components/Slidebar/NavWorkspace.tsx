"use client";

import { useEffect, useState } from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useParams, useRouter } from "next/navigation";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import { useAuth } from "../providers/AuthProvider";
import { WORKSPACE_TYPE } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getFirstLetterUppercase } from "@/lib/utils";
import useTaskStore, { TaskStoreState } from "@/store/task";

export function WorkspaceSwitcher() {
  const { user }: any = useAuth();
  const {
    workspaces,
    getWorkspaces,
    getWorkspaceByWorkspaceId,
  }: WorkspaceStoreState = useWorkspaceStore();
  const {
    setProjects,
    getProjectsByWorkspaceId,
    setTasks,
    getTasksByWorkspaceId,
  }: TaskStoreState = useTaskStore();

  const { state, isMobile } = useSidebar();
  const router = useRouter();
  const params = useParams();

  const [workspaceList, setWorkspaceList] =
    useState<WORKSPACE_TYPE[]>(workspaces);
  const [workspace, setWorkspace] = useState<WORKSPACE_TYPE | null>(null);

  useEffect(() => {
    if (user?.uid) getWorkspaces(user?.uid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  useEffect(() => {
    if (workspaces) setWorkspaceList(workspaces);
  }, [workspaces]);

  const handleGetWorkspace = async () => {
    const res = await getWorkspaceByWorkspaceId(params?.id as string);

    if (res && res?.id) {
      setWorkspace(res);

      const projectsRes = await getProjectsByWorkspaceId(res?.id);
      const tasksRes = await getTasksByWorkspaceId(res?.id);

      setProjects(projectsRes);
      setTasks(tasksRes);
    }
  };

  useEffect(() => {
    if (params?.id && user?.uid) handleGetWorkspace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, user?.id]);

  const handleChangeWorkspace = (id: string) => {
    router.push(`/workspace/${id}`);
  };

  const handleAddWorkSpace = () => {
    router.push("/workspace");
  };

  return (
    <SidebarMenu>
      {state === "expanded" && (
        <SidebarMenuItem className="px-2 pt-1 flex items-center">
          <Image src="/logo.png" width={100} height={100} alt="app-logo" />
          <h1 className="text-xl font-bold text-primary">Jira Clone</h1>
        </SidebarMenuItem>
      )}

      <SidebarMenuItem className="my-3 py-2 border-gray-400 dark:border-gray-600 border-y border-dashed">
        <SidebarGroupLabel>
          <div className="w-full flex items-center justify-between">
            <span>Workspace</span>
            <button
              className="bg-primary hover:bg-primary/90 p-1 rounded-full text-white"
              onClick={() => {
                handleAddWorkSpace();
              }}
            >
              <Plus size={12} />
            </button>
          </div>
        </SidebarGroupLabel>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                {workspace?.name
                  ? getFirstLetterUppercase(workspace?.name)
                  : "U"}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {workspace?.name ? workspace?.name : "unknow"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {workspaceList?.map((workspace: WORKSPACE_TYPE, index) => {
              return (
                <DropdownMenuItem
                  key={workspace?.id}
                  onClick={() =>
                    workspace?.id && handleChangeWorkspace(workspace?.id)
                  }
                  className="gap-2 p-2"
                >
                  <Avatar className="h-6 w-6 rounded-md">
                    <AvatarImage
                      src={workspace?.avatarUrl}
                      alt={workspace?.name}
                    />
                    <AvatarFallback className="rounded-lg bg-primary text-white text-[0.6rem]">
                      {workspace?.name
                        ? getFirstLetterUppercase(workspace?.name)
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  {workspace?.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="gap-2 p-2 hover:cursor-pointer"
              onClick={() => {
                handleAddWorkSpace();
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
