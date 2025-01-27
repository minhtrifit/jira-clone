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
  ["TASK_LIST"]: process.env.NEXT_PUBLIC_FIREBASE_TASK_COLLECTION
    ? process.env.NEXT_PUBLIC_FIREBASE_TASK_COLLECTION
    : "task-list",
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

// Convert a Date to Firebase serverTimestamp.
export const convertToFirebaseTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Convert a Date to string format dd/mm/yyyy hh:mm:ss
export const formatToDateStr = (date: Date) => {
  return dayjs(date).format("DD/MM/YYYY HH:mm:ss");
};

export const formatDateForFirestore = (date: Date) => {
  const timestamp = Timestamp.fromDate(date);

  return timestamp;
};

export const convertTimestampToDate = (
  d: Timestamp | { seconds: number; nanoseconds: number } | null | undefined
) => {
  if (!d) return "Invalid date";

  return new Date(d?.seconds * 1000 + d?.nanoseconds / 1e6);
};

export const STATUS_LIST = [
  {
    id: "backlog",
    title: "Backlog",
  },
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "inprogress",
    title: "In Progress",
  },
  {
    id: "inreview",
    title: "In Review",
  },
  {
    id: "done",
    title: "Done",
  },
];

export const getStatusObj = (
  id: "backlog" | "todo" | "inprogress" | "inreview" | "done"
) => {
  return STATUS_LIST.find((status) => {
    return status.id === id;
  });
};
