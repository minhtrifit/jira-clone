import { JOIN_WORKSPACE_TYPE, USER_TYPE, WORKSPACE_TYPE } from "@/types";
import { create } from "zustand";

export interface WorkspaceStoreState {
  workspace: WORKSPACE_TYPE | null;
  workspaces: WORKSPACE_TYPE[];
  joinUsers: USER_TYPE[];
  loading: boolean;
  error: unknown;
  setJoinUsers: (users: USER_TYPE[]) => Promise<USER_TYPE[]>;
  getWorkspaces: (userId: string) => Promise<WORKSPACE_TYPE[]>;
  createWorkspace: (workspace: WORKSPACE_TYPE) => Promise<WORKSPACE_TYPE>;
  createJoinWorkspace: (
    joinWorkspace: JOIN_WORKSPACE_TYPE
  ) => Promise<JOIN_WORKSPACE_TYPE>;
  getWorkspaceByJoinUrl: (joinUrl: string) => Promise<WORKSPACE_TYPE>;
  getWorkspaceByWorkspaceId: (workspaceId: string) => Promise<WORKSPACE_TYPE>;
}

const useWorkspaceStore = create<WorkspaceStoreState>((set, get) => ({
  workspace: null,
  workspaces: [],
  joinUsers: [],
  loading: false,
  error: null,

  setJoinUsers: async (users: USER_TYPE[]) => {
    set({ joinUsers: users });

    const currentJoinUsers = get().joinUsers;

    return currentJoinUsers;
  },

  getWorkspaces: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      // Get workspace by userId
      const res = await fetch(`/api/workspace/user/${userId}`);
      if (!res.ok) throw new Error("Get workspace by userId failed!");

      const data = await res.json();

      // Get joinUsers
      await Promise.all(
        data?.map(async (workspace: WORKSPACE_TYPE) => {
          const joinResponse = await fetch(
            `/api/workspace/join/${workspace.id}`
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

          workspace.joinUsers = userDetails;
          set({ joinUsers: userDetails });
        })
      );

      set({ workspaces: data, loading: false });

      return data;
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
    } catch (error: any) {
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

  getWorkspaceByWorkspaceId: async (workspaceId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/workspace/workspace-id/${workspaceId}`);
      if (!res.ok) throw new Error("Get workspace by workspace ID failed!");

      const data = await res.json();

      // Get joinUsers
      if (data?.joinUsers?.length) {
        data.joinUsers = await Promise.all(
          data.joinUsers.map(async (joinUser: JOIN_WORKSPACE_TYPE) => {
            const userResponse = await fetch(`/api/users/${joinUser?.userId}`);

            if (!userResponse.ok)
              throw new Error("Failed to fetch user by ID!");

            return userResponse.json() as Promise<USER_TYPE>;
          })
        );
      }

      // Get workspace owner
      const ownerResponse = await fetch(`/api/users/${data?.ownerId}`);

      if (!ownerResponse.ok) throw new Error("Failed to fetch user details!");

      const owner: USER_TYPE = await ownerResponse.json();
      data.owner = owner;

      set({ workspace: data, loading: false });

      return data;
    } catch (error) {
      set({ error: error, loading: false });
    }
  },
}));

export default useWorkspaceStore;
