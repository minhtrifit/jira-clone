import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
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
  ["PROJECT_LIST"]: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_COLLECTION
    ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_COLLECTION
    : "project-list",
};

export const getFirstLetterUppercase = (name: string) => {
  return name.split("")[0].toUpperCase();
};

// Convert a Firebase serverTimestamp to a date string.
export const formatTimeStampDate = (
  d: Timestamp | { seconds: number; nanoseconds: number } | null | undefined,
  type: "date" | "datetime"
) => {
  if (!d) return "Invalid date";

  const date = d instanceof Timestamp ? d.toDate() : new Date(d.seconds * 1000);

  if (type === "date") return dayjs(date).format("DD/MM/YYYY");

  if (type === "datetime") return dayjs(date).format("DD/MM/YYYY HH:mm:ss");
};

// Convert a date string (dd/mm/yyyy hh:mm:ss) to Firebase serverTimestamp.
export const convertToFirebaseTimestamp = (dateString: string) => {
  const date = dayjs(dateString, "DD/MM/YYYY HH:mm:ss");

  if (!date.isValid()) {
    throw new Error(
      "Invalid date format. Expected format: dd/mm/yyyy hh:mm:ss"
    );
  }

  return Timestamp.fromMillis(date.valueOf());
};
