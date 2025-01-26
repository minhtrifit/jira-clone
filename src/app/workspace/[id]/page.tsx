"use client";

import { v4 as uuidv4 } from "uuid";
import AnalysisCard, {
  ANALYSIS_TYPE,
} from "@/components/AnalysisCard/AnalysisCard";
import PageTitle from "@/components/PageTitle/PageTitle";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import { SkeletonCard } from "@/components/SkeletonCard/SkeletonCard";

const WorkspacePage = () => {
  const { workspace, loading }: WorkspaceStoreState = useWorkspaceStore();

  console.log(workspace);

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

          <div className="my-10 flex gap-3 flex-wrap lg:flex-nowrap">
            {ANALYSIS_ITEMS?.map((item: ANALYSIS_TYPE) => {
              return <AnalysisCard key={uuidv4()} item={item} />;
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default WorkspacePage;
