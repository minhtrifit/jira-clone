"use client";

import ButtonCpn from "@/components/ButtonCpn/ButtonCpn";
import WorkspaceBtn from "@/components/WorkspaceBtn/WorkspaceBtn";
import CreateWorkspaceForm from "@/components/CreateWorkspaceForm/CreateWorkspaceForm";
import Divider from "@/components/Divider/Divider";
import { useAuth } from "@/components/providers/AuthProvider";
import { SkeletonCard } from "@/components/SkeletonCard/SkeletonCard";
import { Input } from "@/components/ui/input";
import useWorkspaceStore from "@/store/workspace";
import { WORKSPACE_TYPE } from "@/types";
import { Search, SquareArrowOutUpRight } from "lucide-react";
import { useEffect } from "react";

const WorkspacePage = () => {
  const { user }: any = useAuth();
  const { workspaces, loading, getWorkspace }: any = useWorkspaceStore();

  const handleAccessWorkSpace = () => {
    console.log("Access workspace");
  };

  useEffect(() => {
    if (user?.uid) getWorkspace(user?.uid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

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
            />
          </div>

          <ButtonCpn
            type="button"
            title="Join workspace"
            icon={<SquareArrowOutUpRight size={20} />}
          />
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

          {workspaces?.map((workspace: WORKSPACE_TYPE) => {
            console.log(workspace);

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
