import { PROJECT_TYPE, TASK_TYPE } from "@/types";
import { create } from "zustand";

export interface TaskStoreState {
  projects: PROJECT_TYPE[];
  tasks: TASK_TYPE[];
  loading: boolean;
  error: unknown;
  getProjectsByWorkspaceId: (workspaceId: string) => Promise<PROJECT_TYPE[]>;
  createProject: (project: PROJECT_TYPE) => Promise<PROJECT_TYPE>;
  getTasksByWorkspaceId: (workspaceId: string) => Promise<TASK_TYPE[]>;
  createTask: (task: TASK_TYPE) => Promise<TASK_TYPE>;
}

const useTaskStore = create<TaskStoreState>((set) => ({
  projects: [],
  tasks: [],
  loading: false,
  error: null,

  getProjectsByWorkspaceId: async (workspaceId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/project/all/workspace-id/${workspaceId}`);
      if (!res.ok) throw new Error("Get workspace by workspace ID failed!");

      const data = await res.json();

      set({ projects: data, loading: false });

      return data;
    } catch (error) {
      set({ error: error, loading: false });
    }
  },

  createProject: async (project: PROJECT_TYPE) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      if (!res.ok) throw new Error("Create project failed!");

      const data = await res.json();

      set({ loading: false });

      return data;
    } catch (error) {
      set({ error: error, loading: false });
    }
  },

  getTasksByWorkspaceId: async (workspaceId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/task/all/workspace-id/${workspaceId}`);
      if (!res.ok) throw new Error("Get task by workspace ID failed!");

      const data = await res.json();

      set({ tasks: data, loading: false });

      return data;
    } catch (error) {
      set({ error: error, loading: false });
    }
  },

  createTask: async (task: TASK_TYPE) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!res.ok) throw new Error("Create task failed!");

      const data = await res.json();

      set({ loading: false });

      return data;
    } catch (error) {
      set({ error: error, loading: false });
    }
  },
}));

export default useTaskStore;
