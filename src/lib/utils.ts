import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const COLLECTION_NAME = {
  ["WORKSPACE_LIST"]: process.env.NEXT_PUBLIC_FIREBASE_WORKSPACE_COLLECTION
    ? process.env.NEXT_PUBLIC_FIREBASE_WORKSPACE_COLLECTION
    : "workspace-list",
  ["WORKSPACE_JOIN_LIST"]: process.env
    .NEXT_PUBLIC_FIREBASE_WORKSPACE_JOIN_COLLECTION
    ? process.env.NEXT_PUBLIC_FIREBASE_WORKSPACE_JOIN_COLLECTION
    : "workspace-join-list",
};

export const getFirstLetterUppercase = (name: string) => {
  return name.split("")[0].toUpperCase();
};
