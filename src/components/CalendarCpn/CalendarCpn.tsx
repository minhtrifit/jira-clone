"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight, Clock2 } from "lucide-react";
import dayjs from "dayjs";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import useTaskStore, { TaskStoreState } from "@/store/task";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DatesSetArg, EventInput } from "@fullcalendar/core/index.js";
import { TASK_TYPE } from "@/types";
import {
  convertDateStrToTimestamp,
  convertTimestampToFullCalendar,
} from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";

import "./styles.css";

export interface FULL_CALENDAR_EVENT_TYPE {
  id: string;
  title: string;
  start: string;
  end: string;
}

const CalendarCpn = () => {
  const { workspace }: WorkspaceStoreState = useWorkspaceStore();
  const { tasks, getTasksByWorkspaceId, updateTaskById }: TaskStoreState =
    useTaskStore();

  const calendarRef = useRef<FullCalendar>(null);
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("MMMM YYYY"));
  const [isToday, setIsToday] = useState<boolean>(true);

  const TASKS_EVENT_LIST: FULL_CALENDAR_EVENT_TYPE[] = useMemo(() => {
    return (
      tasks?.map((task: TASK_TYPE) => {
        return {
          id: task?.id,
          title: task?.name,
          start: convertTimestampToFullCalendar(task?.dueAt as Timestamp),
          end: convertTimestampToFullCalendar(task?.dueAt as Timestamp),
          description: task?.description,
        } as FULL_CALENDAR_EVENT_TYPE;
      }) ?? []
    );
  }, [tasks]);

  const handleDatesSet = (dateInfo: DatesSetArg) => {
    setCurrentMonth(dayjs(dateInfo.start).format("MMMM YYYY"));
  };

  const handleTodayClick = () => {
    if (!isToday) {
      calendarRef.current?.getApi().today();
      setIsToday(true);
    }
  };

  const handleEventClick = (eventInfo: EventInput) => {
    console.log(`Event click:`, eventInfo.event);
  };

  const handleEventDrop = async (eventInfo: EventInput) => {
    const eventId = eventInfo?.event?.id;
    const newDueDate = eventInfo.event._instance.range.start.toString();
    const targetTask = tasks?.find((task) => {
      return task?.id === eventId;
    });

    try {
      if (workspace?.id && targetTask && newDueDate) {
        const updateTask: TASK_TYPE = {
          id: targetTask?.id,
          name: targetTask?.name,
          description: targetTask?.description,
          workspaceId: workspace?.id,
          assigneeId: targetTask?.assigneeId,
          projectId: targetTask?.projectId,
          status: targetTask?.status,
          dueAt: convertDateStrToTimestamp(newDueDate),
        };

        const updateResult = await updateTaskById(updateTask);
        console.log("Update task:", updateResult);

        await getTasksByWorkspaceId(workspace?.id);
      }
    } catch (error: any) {
      toast.error(error?.message ?? "Update task failed");
    }
  };

  // const handleEventResize = (info: EventInput) => {
  //   console.log(`Event resized:`, info.event);
  // };

  return (
    <div className="flex flex-col gap-5">
      <div className="w-full flex items-center justify-between">
        <span className="text-gray-500 dark:text-gray-400 text-lg font-semibold">
          {currentMonth}
        </span>

        <div className="flex items-center gap-3">
          <Button
            disabled={isToday}
            className="text-[0.8rem] text-white flex items-center gap-2"
            onClick={handleTodayClick}
          >
            <Clock2 /> Today
          </Button>

          <div className="flex items-center gap-3">
            <Button
              className="text-[0.8rem] rounded-sm flex items-center gap-2 text-gray-500 bg-zinc-100 hover:bg-zinc-200 dark:text-white dark:bg-slate-600 hover:dark:bg-slate-700"
              onClick={() => {
                calendarRef.current?.getApi().prev();
                setIsToday(false);
              }}
            >
              <ChevronLeft size={15} /> Previous Day
            </Button>
            <Button
              className="text-[0.8rem] rounded-sm flex items-center gap-2 text-gray-500 bg-zinc-100 hover:bg-zinc-200 dark:text-white dark:bg-slate-600 hover:dark:bg-slate-700"
              onClick={() => {
                calendarRef.current?.getApi().next();
                setIsToday(false);
              }}
            >
              Next Day <ChevronRight size={15} />
            </Button>
          </div>
        </div>
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={TASKS_EVENT_LIST}
        eventContent={(e) => {
          return <EventCard tasks={tasks} eventInfo={e} />;
        }} // Custom event rendering
        eventClick={handleEventClick} // Event click handler
        eventDrop={handleEventDrop} // Fired when an event is dragged
        // eventResize={handleEventResize} // Fired when an event is resized
        editable={true}
        droppable={true}
        headerToolbar={false}
        datesSet={handleDatesSet}
      />
    </div>
  );
};

export default CalendarCpn;
