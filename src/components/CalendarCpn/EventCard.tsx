import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  convertTimestampToFullCalendar,
  getFirstLetterUppercase,
} from "@/lib/utils";
import { TASK_TYPE } from "@/types";
import { FULL_CALENDAR_EVENT_TYPE } from "./CalendarCpn";
import { EventInput } from "@fullcalendar/core/index.js";
import { Timestamp } from "firebase/firestore";

interface PropType {
  tasks: TASK_TYPE[];
  eventInfo: EventInput;
}

const EventCard = (props: PropType) => {
  const { tasks, eventInfo } = props;

  const eventId = eventInfo?.event?.id;

  const targetTask = tasks?.find((task: TASK_TYPE) => {
    return task?.id === eventId;
  });

  const targetEvent: FULL_CALENDAR_EVENT_TYPE | null =
    tasks
      ?.map((task: TASK_TYPE) => ({
        id: task?.id ?? "",
        title: task?.name ?? "",
        start: task?.dueAt
          ? convertTimestampToFullCalendar(task?.dueAt as Timestamp)
          : "",
        end: task?.dueAt
          ? convertTimestampToFullCalendar(task?.dueAt as Timestamp)
          : "",
        description: task?.description ?? "",
      }))
      ?.find((event) => event?.id === eventId) ?? null;

  const getEventColor = (status: string) => {
    if (status === "backlog") return "border-red-500";
    if (status === "todo") return "border-pink-500";
    if (status === "inprogress") return "border-yellow-500";
    if (status === "inreview") return "border-sky-500";
    if (status === "done") return "border-green-500";

    return "border-blue-500";
  };

  return (
    <Card
      className={`w-full border-l-4 border-r-0 border-y-0
          ${getEventColor(
            targetTask?.status ?? ""
          )} p-0 dark:bg-slate-800 rounded-sm`}
    >
      <CardContent className="p-2 flex flex-col gap-3">
        <h1 className="text-[0.8rem] font-semibold max-w-[180px] truncate">
          {targetEvent?.title}
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 rounded-full">
              <AvatarImage
                src={targetTask?.project?.avatarUrl}
                alt={targetTask?.project?.name}
              />
              <AvatarFallback className="rounded-md bg-primary text-white text-[0.7rem]">
                {targetTask?.project?.name
                  ? getFirstLetterUppercase(targetTask?.project?.name)
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[80px] truncate">
              {targetTask?.project?.name}
            </span>
          </div>

          <Avatar className="h-6 w-6 rounded-full">
            <AvatarImage
              src={targetTask?.assignee?.photoURL}
              alt={targetTask?.assignee?.displayName}
            />
            <AvatarFallback className="rounded-md bg-gray-300 dark:bg-zinc-500 text-white text-[0.7rem]">
              {targetTask?.assignee?.displayName
                ? getFirstLetterUppercase(targetTask?.assignee?.displayName)
                : "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
