import { KANBAN_COLUMN_TYPE } from "@/types";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";

dayjs.extend(relativeTime);
dayjs.extend(utc);

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
  ["NOTIFICATION_LIST"]: process.env
    .NEXT_PUBLIC_FIREBASE_NOTIFICATION_COLLECTION
    ? process.env.NEXT_PUBLIC_FIREBASE_NOTIFICATION_COLLECTION
    : "notification-list",
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

export const calculateDaysLeft = (
  d:
    | Timestamp
    | {
        seconds: number;
        nanoseconds: number;
      }
    | null
    | undefined
): string => {
  if (!d) return "Invalid date";

  const { seconds, nanoseconds } = d;

  const targetDate = dayjs(seconds * 1000 + Math.floor(nanoseconds / 1e6));
  const currentDate = dayjs();

  const diffInDays = targetDate.diff(currentDate, "day");

  return diffInDays < 0 ? "Overdue" : `${diffInDays} days left`;
};

export const convertTimestampToFullCalendar = (
  d:
    | Timestamp
    | {
        seconds: number;
        nanoseconds: number;
      }
    | null
    | undefined
): string => {
  if (!d) return "Invalid date";

  const date = new Date(d.seconds * 1000);
  return date.toISOString();
};

// Format: Thu Jan 16 2025 19:00:00 GMT+0700 to Firebase timestamp
export function convertDateStrToTimestamp(dateString: string): Timestamp {
  const date = new Date(dateString);
  return Timestamp.fromDate(date);
}

export const getTimeAgo = (datetime: string) => {
  const date = dayjs(datetime, "DD/MM/YYYY HH:mm:ss", true).utc();

  if (!date.isValid()) {
    return "Invalid date format";
  }

  return date.fromNow();
};

export type STATUS_TYPE_LIST =
  | "backlog"
  | "todo"
  | "inprogress"
  | "inreview"
  | "done";

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

export const COLUMNS_DATA: KANBAN_COLUMN_TYPE[] = [
  {
    id: "backlog",
    name: "Backlog",
    count: 0,
  },
  {
    id: "todo",
    name: "Todo",
    count: 0,
  },
  {
    id: "inprogress",
    name: "In Progress",
    count: 0,
  },
  {
    id: "inreview",
    name: "In Review",
    count: 0,
  },
  {
    id: "done",
    name: "Done",
    count: 0,
  },
];

export const handleFirebaseError = (message: string) => {
  if (message === "Firebase: Error (auth/email-already-in-use).")
    return "Email already in use";

  if (
    message ===
    "Firebase: Password should be at least 6 characters (auth/weak-password)."
  )
    return "Password should be at least 6 characters";

  return "Something wrong";
};
