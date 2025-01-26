import { JOIN_WORKSPACE_TYPE, USER_TYPE, WORKSPACE_TYPE } from "@/types";
import { create } from "zustand";

interface WorkspaceStoreState {
  workspaces: WORKSPACE_TYPE[];
  loading: boolean;
  error: unknown;
  getWorkspaces: (userId: string) => Promise<void>;
  createWorkspace: (workspace: WORKSPACE_TYPE) => Promise<void>;
  createJoinWorkspace: (joinWorkspace: JOIN_WORKSPACE_TYPE) => Promise<void>;
  getWorkspaceByJoinUrl: (joinUrl: string) => Promise<void>;
}

const useWorkspaceStore = create<WorkspaceStoreState>((set) => ({
  workspaces: [],
  loading: false,
  error: null,

  getWorkspaces: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/workspace/user/${userId}`);
      if (!res.ok) throw new Error("Get workspace by userId failed!");

      const data = await res.json();

      await Promise.all(
        data?.map(async (workspace: WORKSPACE_TYPE) => {
          const joinRes = await fetch(`/api/workspace/join/${workspace?.id}`);
          if (!joinRes.ok) throw new Error("Get workspace by owner failed!");

          const joinData: JOIN_WORKSPACE_TYPE[] = await joinRes.json();

          for (let i = 0; i < joinData?.length; ++i) {
            const userRes = await fetch(`/api/users/${joinData[i]?.userId}`);
            if (!userRes.ok) throw new Error("Get user by ID failed!");

            const userData: USER_TYPE = await userRes.json();
            joinData[i] = userData;
          }

          workspace.joinUsers = joinData;
        })
      );

      set({ workspaces: data, loading: false });
    } catch (error) {
      set({ error: error, loading: false });
    }
  },

  createWorkspace: async (workspace: WORKSPACE_TYPE) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/workspace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workspace),
      });

      if (!response.ok) throw new Error("Create workspace failed!");

      const data = await response.json();

      set({ loading: false });

      return data;
    } catch (error) {
      set({ error: error, loading: false });
    }
  },

  createJoinWorkspace: async (joinWorkspace: JOIN_WORKSPACE_TYPE) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/workspace/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(joinWorkspace),
      });

      if (!response.ok) throw new Error("Create join workspace failed!");

      const data = await response.json();

      set({ loading: false });

      return data;
    } catch (error) {
      set({ error: error, loading: false });
    }
  },

  getWorkspaceByJoinUrl: async (joinUrl: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/workspace/join-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ joinUrl: joinUrl }),
      });

      if (!response.ok) throw new Error("Get workspace by join URL failed!");

      const data = await response.json();

      set({ loading: false });

      return data;
    } catch (error) {
      set({ error: error, loading: false });
    }
  },
}));

export default useWorkspaceStore;
