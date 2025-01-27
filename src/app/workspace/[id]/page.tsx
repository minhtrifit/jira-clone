"use client";

import { v4 as uuidv4 } from "uuid";
import AnalysisCard, {
  ANALYSIS_TYPE,
} from "@/components/AnalysisCard/AnalysisCard";
import PageTitle from "@/components/PageTitle/PageTitle";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import { SkeletonCard } from "@/components/SkeletonCard/SkeletonCard";
import AssignedTask from "@/components/AssignedTask/AssignedTask";
import ProjectCpn from "@/components/ProjectsCpn/ProjectCpn";
import PeopleCpn from "@/components/PeopleCpn/PeopleCpn";
import useTaskStore, { TaskStoreState } from "@/store/task";
import { useEffect } from "react";

const WorkspacePage = () => {
  const { workspace, loading }: WorkspaceStoreState = useWorkspaceStore();
  const { getProjectsByWorkspaceId }: TaskStoreState = useTaskStore();

  useEffect(() => {
    if (workspace?.id) getProjectsByWorkspaceId(workspace?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace?.id]);

  const ANALYSIS_ITEMS: ANALYSIS_TYPE[] = [
    {
      title: "Total Projects",
      count: 2,
      analysis: 3,
      direction: "up",
    },
    {
      title: "Total Tasks",
      count: 14,
      analysis: 5,
      direction: "up",
    },
    {
      title: "Assigned Tasks",
      count: 7,
      analysis: 1,
      direction: "up",
    },
    {
      title: "Completed Tasks",
      count: 2,
      analysis: 2,
      direction: "up",
    },
    {
      title: "Overdue Tasks",
      count: 0,
      analysis: 0,
      direction: "down",
    },
  ];

  return (
    <>
      {loading ? (
        <SkeletonCard />
      ) : (
        <div>
          <PageTitle
            title="Home"
            description="Monitor all of your projects and tasks here"
          />

          <div className="my-10 w-full flex gap-3 flex-wrap lg:flex-nowrap">
            {ANALYSIS_ITEMS?.map((item: ANALYSIS_TYPE) => {
              return <AnalysisCard key={uuidv4()} item={item} />;
            })}
          </div>

          <div className="w-full flex items-start gap-3 flex-wrap lg:flex-nowrap">
            <AssignedTask />
            <ProjectCpn />
          </div>

          <div className="mt-10 w-full flex items-start gap-3 flex-wrap lg:flex-nowrap">
            <PeopleCpn />
            <div className="px-5 basis:auto lg:basis-full"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkspacePage;
