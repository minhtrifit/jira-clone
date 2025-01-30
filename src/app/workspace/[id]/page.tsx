"use client";

import { useEffect, useMemo } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { v4 as uuidv4 } from "uuid";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import useTaskStore, { TaskStoreState } from "@/store/task";
import AnalysisCard, {
  ANALYSIS_TYPE,
} from "@/components/AnalysisCard/AnalysisCard";
import PageTitle from "@/components/PageTitle/PageTitle";
import { SkeletonCard } from "@/components/SkeletonCard/SkeletonCard";
import AssignedTask from "@/components/AssignedTask/AssignedTask";
import ProjectCpn from "@/components/ProjectsCpn/ProjectCpn";
import PeopleCpn from "@/components/PeopleCpn/PeopleCpn";
import { TASK_TYPE } from "@/types";
import { calculateDaysLeft } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import { useParams } from "next/navigation";
import WorkspaceJoinForm from "@/components/WorkspaceJoinForm/WorkspaceJoinForm";
import TasksLineChart from "@/components/TasksLineChart/TaskLineChart";
import TasksBarChart from "@/components/TasksBarChart/TasksBarChart";
import TasksAreaChart from "@/components/TasksAreaChart/TasksAreaChart";

const ANALYSIS_ITEMS: ANALYSIS_TYPE[] = [
  {
    id: "totalprojects",
    title: "Total Projects",
    count: 0,
    analysis: 10,
    direction: "up",
  },
  {
    id: "totaltasks",
    title: "Total Tasks",
    count: 0,
    analysis: 42,
    direction: "up",
  },
  {
    id: "assignedtasks",
    title: "Assigned Tasks",
    count: 0,
    analysis: 5,
    direction: "up",
  },
  {
    id: "completedtasks",
    title: "Completed Tasks",
    count: 0,
    analysis: 5,
    direction: "up",
  },
  {
    id: "overduetasks",
    title: "Overdue Tasks",
    count: 0,
    analysis: 0,
    direction: "down",
  },
];

const DetailWorkspacePage = () => {
  const { user }: any = useAuth();

  const params = useParams();
  const workspaceIdParams = params?.id;

  const { workspace, loading }: WorkspaceStoreState = useWorkspaceStore();
  const { projects, tasks, getProjectsByWorkspaceId }: TaskStoreState =
    useTaskStore();

  const analysisItems = useMemo(() => {
    return ANALYSIS_ITEMS?.map((item) => {
      if (item.id === "totalprojects") {
        return { ...item, count: projects?.length };
      }

      if (item.id === "totaltasks") {
        return { ...item, count: tasks?.length };
      }

      if (item.id === "assignedtasks") {
        const filterAssignedTasks = tasks?.filter((task: TASK_TYPE) => {
          return task?.assigneeId === user?.uid;
        });

        return {
          ...item,
          count: filterAssignedTasks?.length,
        };
      }

      if (item.id === "completedtasks") {
        const filterCompletedTasks = tasks?.filter((task: TASK_TYPE) => {
          return task?.assigneeId === user?.uid && task?.status === "done";
        });

        return {
          ...item,
          count: filterCompletedTasks?.length,
        };
      }

      if (item.id === "overduetasks") {
        const filterOverdueTasks = tasks?.filter((task: TASK_TYPE) => {
          return (
            task?.assigneeId === user?.uid &&
            task?.status !== "done" &&
            calculateDaysLeft(task?.dueAt as Timestamp) === "Overdue"
          );
        });

        return {
          ...item,
          count: filterOverdueTasks?.length,
        };
      }

      return item;
    });
  }, [projects, tasks, user?.uid]);

  // useEffect(() => {
  //   if (workspace?.id) getProjectsByWorkspaceId(workspace?.id);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [workspace?.id]);

  useEffect(() => {
    if (workspaceIdParams)
      getProjectsByWorkspaceId(workspaceIdParams as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceIdParams]);

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
            {analysisItems?.map((item: ANALYSIS_TYPE) => {
              return <AnalysisCard key={uuidv4()} item={item} />;
            })}
          </div>

          <div className="w-full flex items-start gap-3 flex-wrap lg:flex-nowrap">
            <TasksBarChart />
            <TasksAreaChart />
            <TasksLineChart />
          </div>

          <div className="mt-3 w-full h-[420px] flex items-start gap-3 flex-wrap lg:flex-nowrap">
            <AssignedTask />

            <div className="basis-full hidden h-full lg:flex flex-col gap-3">
              <WorkspaceJoinForm />
              <ProjectCpn />
            </div>
          </div>

          <div className="mt-3 flex lg:hidden flex-col gap-3">
            <WorkspaceJoinForm />
            <ProjectCpn />
          </div>

          <div className="mt-3 w-full flex items-center gap-3 flex-wrap lg:flex-nowrap">
            <PeopleCpn />
            <div className="basis:auto lg:basis-full"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailWorkspacePage;
