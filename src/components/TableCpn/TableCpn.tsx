"use client";

import useTaskStore, { TaskStoreState } from "@/store/task";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import { useEffect } from "react";

const TableCpn = () => {
  const { workspace }: WorkspaceStoreState = useWorkspaceStore();
  const { tasks, loading, getTasksByWorkspaceId }: TaskStoreState =
    useTaskStore();

  useEffect(() => {
    if (workspace?.id) getTasksByWorkspaceId(workspace?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace?.id]);

  console.log(tasks);

  return <div>TableCpn</div>;
};

export default TableCpn;
