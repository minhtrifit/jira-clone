import {
  JOIN_WORKSPACE_TYPE,
  PROJECT_TYPE,
  TASK_TYPE,
  USER_TYPE,
  WORKSPACE_TYPE,
} from "@/types";
import { create } from "zustand";

export interface TaskStoreState {
  projects: PROJECT_TYPE[];
  project: PROJECT_TYPE | null;
  tasks: TASK_TYPE[];
  task: TASK_TYPE | null;
  loading: boolean;
  error: unknown;
  setProjects: (projects: PROJECT_TYPE[]) => Promise<PROJECT_TYPE[]>;
  getProjectsByWorkspaceId: (workspaceId: string) => Promise<PROJECT_TYPE[]>;
  getProjectByProjectId: (projectId: string) => Promise<PROJECT_TYPE | null>;
  createProject: (project: PROJECT_TYPE) => Promise<PROJECT_TYPE>;
  setTasks: (tasks: TASK_TYPE[]) => Promise<TASK_TYPE[]>;
  getTasksByWorkspaceId: (workspaceId: string) => Promise<TASK_TYPE[]>;
  getTaskByTaskId: (taskId: string) => Promise<TASK_TYPE | null>;
  createTask: (task: TASK_TYPE) => Promise<TASK_TYPE>;
  deleteTaskById: (id: string) => Promise<{ message: string }>;
  updateTaskById: (task: TASK_TYPE) => Promise<TASK_TYPE>;
}

const useTaskStore = create<TaskStoreState>((set, get) => ({
  projects: [],
  project: null,
  tasks: [],
  task: null,
  loading: false,
  error: null,

  setProjects: async (projects: PROJECT_TYPE[]) => {
    set({ projects: projects });

    const currentProjects = get().projects;

    return currentProjects;
  },

  getProjectsByWorkspaceId: async (workspaceId: string) => {
    set({ loading: true, error: null });
    try {
      // Get projects by workspace ID
      const res = await fetch(`/api/project/all/workspace-id/${workspaceId}`);
      if (!res.ok) throw new Error("Get projects by workspace ID failed!");

      const data = await res.json();

      // Get joinUsers
      await Promise.all(
        data?.map(async (project: PROJECT_TYPE) => {
          const joinResponse = await fetch(
            `/api/workspace/join/${project?.workspaceId}`
          );

          if (!joinResponse.ok)
            throw new Error("Failed to fetch joined users for the workspace!");

          const joinData: JOIN_WORKSPACE_TYPE[] = await joinResponse.json();

          const userDetails = await Promise.all(
            joinData.map(async (join) => {
              const userResponse = await fetch(`/api/users/${join.userId}`);

              if (!userResponse.ok)
                throw new Error("Failed to fetch user details!");

              return userResponse.json() as Promise<USER_TYPE>;
            })
          );

          project.joinUsers = userDetails;
        })
      );

      set({ projects: data, loading: false });

      return data;
    } catch (error) {
      set({ error: error, loading: false });
    }
  },

  getProjectByProjectId: async (projectId: string) => {
    set({ loading: true, error: null });
    try {
      // Get project by project ID
      const res = await fetch(`/api/project/single/project-id/${projectId}`);

      if (!res.ok) throw new Error("Failed to fetch project for task!");

      const data = await res.json();

      if (!data) {
        set({ project: null, loading: false });
        return null;
      }

      // Get workspace
      const workspaceResponse = await fetch(
        `/api/workspace/workspace-id/${data?.workspaceId}`
      );

      if (!workspaceResponse.ok)
        throw new Error("Failed to fetch workspace for project!");

      const workspace: WORKSPACE_TYPE = await workspaceResponse.json();
      data.workspace = workspace;

      // Get workspace owner
      const ownerResponse = await fetch(`/api/users/${workspace?.ownerId}`);

      if (!ownerResponse.ok) throw new Error("Failed to fetch user details!");

      const owner: USER_TYPE = await ownerResponse.json();
      data.workspace.owner = owner;

      set({ project: data, loading: false });

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

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error ?? "Create project failed!");
      }

      const data = await res.json();

      set({ loading: false });

      return data;
    } catch (error) {
      set({ error: error, loading: false });
      throw error;
    }
  },

  setTasks: async (tasks: TASK_TYPE[]) => {
    set({ tasks: tasks });

    const currentTasks = get().tasks;

    return currentTasks;
  },

  getTaskByTaskId: async (taskId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/task/single/task-id/${taskId}`);
      if (!res.ok) throw new Error("Get task by task ID failed!");

      const data = await res.json();

      if (!data) {
        set({ task: null, loading: false });
        return null;
      }

      // Get assignee
      const userResponse = await fetch(`/api/users/${data?.assigneeId}`);

      if (!userResponse.ok) throw new Error("Failed to fetch user details!");

      const assignee: USER_TYPE = await userResponse.json();
      data.assignee = assignee;

      // Get created user
      const createdByResponse = await fetch(`/api/users/${data?.createdBy}`);

      if (!createdByResponse.ok)
        throw new Error("Failed to fetch user details!");

      const createdBy: USER_TYPE = await createdByResponse.json();
      data.createdUser = createdBy;

      // Get workspace
      const workspaceRes = await fetch(
        `/api/workspace/workspace-id/${data?.workspaceId}`
      );
      if (!workspaceRes.ok)
        throw new Error("Get workspace by workspace ID failed!");

      const workspace: WORKSPACE_TYPE = await workspaceRes.json();
      data.workspace = workspace;

      // Get project
      const projectResponse = await fetch(
        `/api/project/single/project-id/${data?.projectId}`
      );

      if (!projectResponse.ok)
        throw new Error("Failed to fetch project for task!");

      const project: PROJECT_TYPE = await projectResponse.json();
      data.project = project;

      set({ task: data, loading: false });

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

      // Get assignee
      await Promise.all(
        data?.map(async (task: TASK_TYPE) => {
          const userResponse = await fetch(`/api/users/${task?.assigneeId}`);

          if (!userResponse.ok)
            throw new Error("Failed to fetch user details!");

          const assignee: USER_TYPE = await userResponse.json();

          task.assignee = assignee;
        })
      );

      // Get project
      await Promise.all(
        data?.map(async (task: TASK_TYPE) => {
          const projectResponse = await fetch(
            `/api/project/single/project-id/${task?.projectId}`
          );

          if (!projectResponse.ok)
            throw new Error("Failed to fetch project for task!");

          const project: PROJECT_TYPE = await projectResponse.json();

          task.project = project;
        })
      );

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

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error ?? "Create task failed!");
      }

      const data = await res.json();

      // Get assignee
      const assigneeResponse = await fetch(`/api/users/${data?.assigneeId}`);

      if (!assigneeResponse.ok) {
        const errData = await assigneeResponse.json();
        throw new Error(errData?.error ?? "Failed to fetch user details!");
      }

      const assignee: USER_TYPE = await assigneeResponse.json();

      data.assignee = assignee;

      // Get createdUser
      const createdUserResponse = await fetch(`/api/users/${data?.createdBy}`);

      if (!createdUserResponse.ok) {
        const errData = await createdUserResponse.json();
        throw new Error(errData?.error ?? "Failed to fetch user details!");
      }

      const createdUser: USER_TYPE = await createdUserResponse.json();

      data.createdUser = createdUser;

      set({ loading: false });

      return data;
    } catch (error) {
      set({ error: error, loading: false });
      throw error;
    }
  },

  deleteTaskById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/task/delete/task-id/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error ?? "Delete task failed!");
      }

      const data = await res.json();

      set({ loading: false });

      return data;
    } catch (error) {
      set({ error: error, loading: false });
      throw error;
    }
  },

  updateTaskById: async (task: TASK_TYPE) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/task/update/task-id/${task?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error ?? "Update task failed!");
      }

      const data = await res.json();

      set({ loading: false });

      return data;
    } catch (error) {
      set({ error: error, loading: false });
      throw error;
    }
  },
}));

export default useTaskStore;
