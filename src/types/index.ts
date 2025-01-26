import { Timestamp } from "firebase/firestore";

export interface WORKSPACE_TYPE {
  id?: string;
  ownerId?: string;
  name?: string;
  joinUrl?: string;
  avatarUrl?: string;
  joinUsers?: JOIN_WORKSPACE_TYPE[] | USER_TYPE[];
  createdAt?: string | Timestamp;
  updatedAt?: string | Timestamp;
}

export interface JOIN_WORKSPACE_TYPE {
  id?: string;
  workspaceId?: string;
  userId?: string;
  createdAt?: string | Timestamp;
  updatedAt?: string | Timestamp;
}

export interface USER_TYPE {
  id?: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string | number;
  photoURL?: string;
}
