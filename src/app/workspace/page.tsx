"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import { logOut } from "@/lib/firebase.auth";
import { WORKSPACE_TYPE } from "@/types";
import { LogOut, Search } from "lucide-react";
import WorkspaceBtn from "@/components/WorkspaceBtn/WorkspaceBtn";
import CreateWorkspaceForm from "@/components/CreateWorkspaceForm/CreateWorkspaceForm";
import Divider from "@/components/Divider/Divider";
import { SkeletonCard } from "@/components/SkeletonCard/SkeletonCard";
import { Input } from "@/components/ui/input";
import JoinWorkspaceForm from "@/components/JoinWorkspaceForm/JoinWorkspaceForm";
import { Button } from "@/components/ui/button";

const WorkspacePage = () => {
  const router = useRouter();

  const { user }: any = useAuth();
  const { workspaces, loading, getWorkspaces }: WorkspaceStoreState =
    useWorkspaceStore();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const [workspaceList, setWorkspaceList] =
    useState<WORKSPACE_TYPE[]>(workspaces);

  const handleAccessWorkSpace = () => {
    console.log("Access workspace");
  };

  const handleSearchWorkspace = (searchStr: string) => {
    const filterWorkspace = workspaces?.filter((workspace: WORKSPACE_TYPE) => {
      return workspace?.name?.includes(searchStr);
    });

    console.log("Search:", filterWorkspace);

    setWorkspaceList(filterWorkspace);
  };

  const handleLogout = () => {
    logOut();
    router.push("/");
  };

  useEffect(() => {
    if (user?.uid) getWorkspaces(user?.uid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  useEffect(() => {
    if (workspaces) setWorkspaceList(workspaces);
  }, [workspaces]);

  useEffect(() => {
    if (debouncedQuery === "") setWorkspaceList(workspaces);
    if (debouncedQuery) handleSearchWorkspace(debouncedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <div className="w-full h-screen p-10">
      <h1 className="text-[1.8rem] font-bold text-center">All Workspaces</h1>
      <p className="my-5 text-[0.9rem] text-gray-500 text-center">
        A workspace is a place where you keep all of your project, tasks & teams
        in one single place. So, create a different workspace for each project
        or client you have
      </p>

      <nav className="mt-10 mb-8">
        <div className="w-full flex items-center justify-between gap-5">
          <div className="relative">
            <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
            <Input
              id="search"
              type="search"
              placeholder="Search a workspace..."
              className="w-full rounded-lg bg-background pl-8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <JoinWorkspaceForm />
            <Button
              className="text-gray-600 bg-zinc-200 hover:bg-zinc-300 dark:text-white hover:dark:bg-slate-800 dark:bg-slate-900"
              onClick={() => {
                handleLogout();
              }}
            >
              <LogOut /> Log out
            </Button>
          </div>
        </div>
      </nav>

      <Divider />

      {loading ? (
        <div className="my-8 w-full">
          <SkeletonCard />
        </div>
      ) : (
        <div className="my-8 w-full flex items-center gap-5 flex-wrap">
          <CreateWorkspaceForm />

          {workspaceList?.map((workspace: WORKSPACE_TYPE) => {
            return (
              <WorkspaceBtn
                key={workspace?.id}
                workspace={workspace}
                isCreated={false}
                onClick={() => {
                  handleAccessWorkSpace();
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkspacePage;
