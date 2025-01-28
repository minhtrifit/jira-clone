import { useEffect, useMemo, useState } from "react";
import { FolderGit2, ListChecks, User, X } from "lucide-react";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import useTaskStore, { TaskStoreState } from "@/store/task";
import { STATUS_LIST } from "@/lib/utils";
import { PROJECT_TYPE, TASK_TYPE, USER_TYPE } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import FilterComboBox from "./FilterComboBox";

export type FILTER_BAR_LIST = "status" | "assignee" | "projects";
interface FILTER_BAR_TYPE {
  status: string;
  assignee: string;
  projects: string;
}

const FilterBar = () => {
  const { workspace, joinUsers }: WorkspaceStoreState = useWorkspaceStore();
  const { tasks, projects, getTasksByWorkspaceId, setTasks }: TaskStoreState =
    useTaskStore();

  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [filters, setFilters] = useState<FILTER_BAR_TYPE>({
    status: "",
    assignee: "",
    projects: "",
  });

  const assignees = useMemo(() => {
    return (joinUsers ?? [])?.map((user: USER_TYPE) => {
      return {
        id: user?.uid ?? "",
        title: user?.displayName ?? "",
      };
    });
  }, [joinUsers]);

  const fProjects = useMemo(() => {
    return (projects ?? [])?.map((project: PROJECT_TYPE) => {
      return {
        id: project?.id ?? "",
        title: project?.name ?? "",
      };
    });
  }, [projects]);

  const handleGetTasks = async (workspaceId: string) => {
    const res = await getTasksByWorkspaceId(workspaceId);
    return res;
  };

  const handleFilterChange = (id: FILTER_BAR_LIST, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [id]: prevFilters[id] === value ? "" : value,
    }));
  };

  const checkEnableClearAll = () => {
    return Object.values(filters).some((value) => value !== "");
  };

  const handleClear = () => {
    setFilters({
      status: "",
      assignee: "",
      projects: "",
    });
    setIsFilter(false);
  };

  const handleFilterItems = async (filters: FILTER_BAR_TYPE) => {
    let filteredItems: TASK_TYPE[] = [];

    // Filter statuses
    if (filters.status && !filters.assignee && !filters.projects) {
      filteredItems = tasks?.filter((task) => task?.status === filters.status);
      setIsFilter(true);
    }

    // Filter assignees
    if (!filters.status && filters.assignee && !filters.projects) {
      filteredItems = tasks?.filter(
        (task) => task?.assigneeId === filters.assignee
      );
      setIsFilter(true);
    }

    // Filter projects
    if (!filters.status && !filters.assignee && filters.projects) {
      filteredItems = tasks?.filter(
        (task) => task?.projectId === filters.projects
      );
      setIsFilter(true);
    }

    // Filter status, assignee, and projects
    if (filters.status && filters.assignee && filters.projects) {
      filteredItems = tasks?.filter(
        (task) =>
          task?.status === filters.status &&
          task?.assigneeId === filters.assignee &&
          task?.projectId === filters.projects
      );
      setIsFilter(true);
    }

    // No filter
    if (!filters.status && !filters.assignee && !filters.projects) {
      filteredItems = tasks;
      setIsFilter(false);
    }

    // Filter: status projects !assignee
    if (filters.status && !filters.assignee && filters.projects) {
      filteredItems = tasks?.filter(
        (task) =>
          task?.status === filters.status &&
          task?.projectId === filters.projects
      );
      setIsFilter(true);
    }

    // Filter: !status projects assignee
    if (!filters.status && filters.assignee && filters.projects) {
      filteredItems = tasks?.filter(
        (task) =>
          task?.assigneeId === filters.assignee &&
          task?.projectId === filters.projects
      );
      setIsFilter(true);
    }

    // null or undefined
    if (
      filters.status === undefined ||
      filters.assignee === undefined ||
      filters.projects === undefined
    ) {
      filteredItems = tasks;
      setIsFilter(false);
    }

    // isFilter on
    if (
      isFilter &&
      workspace?.id &&
      filters.status &&
      !filters.assignee &&
      !filters.projects
    ) {
      const res = await handleGetTasks(workspace?.id);

      filteredItems = res?.filter((task) => task?.status === filters.status);

      setIsFilter(false);
    }

    if (
      isFilter &&
      workspace?.id &&
      !filters.status &&
      filters.assignee &&
      !filters.projects
    ) {
      const res = await handleGetTasks(workspace?.id);

      filteredItems = res?.filter(
        (task) => task?.assigneeId === filters.assignee
      );

      setIsFilter(false);
    }

    if (
      isFilter &&
      workspace?.id &&
      !filters.status &&
      !filters.assignee &&
      filters.projects
    ) {
      const res = await handleGetTasks(workspace?.id);

      filteredItems = res?.filter(
        (task) => task?.projectId === filters.projects
      );

      setIsFilter(false);
    }

    setTasks(filteredItems);
  };

  useEffect(() => {
    if (
      workspace?.id &&
      Object.values(filters).every((value) => value === "")
    ) {
      handleGetTasks(workspace?.id);
      setIsFilter(false);
    } else {
      handleFilterItems(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="py-4 mb-6 flex items-center gap-3 border-y border-dashed border-gray-300 dark:border-gray-700">
      <FilterComboBox
        id="status"
        title="All Statuses"
        icon={<ListChecks size={15} />}
        items={STATUS_LIST}
        filter={filters?.status}
        handleFilterChange={handleFilterChange}
      />

      <FilterComboBox
        id="assignee"
        title="All Assignees"
        icon={<User size={15} />}
        items={assignees}
        filter={filters?.assignee}
        handleFilterChange={handleFilterChange}
      />

      <FilterComboBox
        id="projects"
        title="All Projects"
        icon={<FolderGit2 size={15} />}
        items={fProjects}
        filter={filters?.projects}
        handleFilterChange={handleFilterChange}
      />

      {checkEnableClearAll() && (
        <Card
          className="rounded-sm hover:cursor-pointer"
          onClick={() => {
            handleClear();
          }}
        >
          <CardContent className="px-4 py-1 text-[0.8125rem] flex items-center gap-2">
            Clear <X size={15} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FilterBar;
