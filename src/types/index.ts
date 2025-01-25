export interface WORKSPACE_TYPE {
  id?: string;
  ownerId?: string;
  name?: string;
  joinUrl?: string;
  avatarUrl?: string;
  joinUsers?: JOIN_WORKSPACE_TYPE[] | USER_TYPE[];
  createdAt?: string;
  updatedAt?: string;
}

export interface JOIN_WORKSPACE_TYPE {
  id?: string;
  workspaceId?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface USER_TYPE {
  id?: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string | number;
  photoURL?: string;
}
