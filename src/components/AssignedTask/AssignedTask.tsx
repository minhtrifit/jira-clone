"use client";

import { Calendar, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import useTaskStore, { TaskStoreState } from "@/store/task";
import { TASK_TYPE } from "@/types";
import { calculateDaysLeft } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Empty from "../Empty/Empty";
import CreateTaskForm from "../CreateTaskForm/CreateTaskForm";
import { useState } from "react";

const AssignedTask = () => {
  const { workspace }: WorkspaceStoreState = useWorkspaceStore();
  const { tasks }: TaskStoreState = useTaskStore();

  const [openCreateTaskForm, setOpenTaskForm] = useState<boolean>(false);

  return (
    <Card className="px-4 w-full basis:auto lg:basis-full rounded-sm bg-zinc-100 dark:bg-gray-900">
      <CardHeader className="px-0 pt-4 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[1.05rem] font-bold">
            Assigned Tasks ({tasks?.length})
          </h1>

          <CreateTaskForm
            isEdit={false}
            open={openCreateTaskForm}
            setOpen={setOpenTaskForm}
            initValue={null}
          >
            <div className="text-white bg-primary rounded-md p-2 hover:bg-primary/90 hover:cursor-pointer">
              <Plus size={20} />
            </div>
          </CreateTaskForm>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-4 pt-4 border-t border-dashed border-zinc-300 dark:border-gray-600">
        <div className="mb-5 flex flex-col gap-2">
          {tasks?.length === 0 && <Empty size={40} />}

          {tasks?.map((task: TASK_TYPE) => {
            return (
              <Card key={uuidv4()}>
                <CardHeader className="pt-3 pb-3 font-bold">
                  {task?.name}
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-end gap-5">
                    <span className="text-sm">{task?.project?.name}</span>
                    <span className="flex items-center gap-1 text-[0.8rem] text-gray-400">
                      <Calendar size={15} />{" "}
                      {task?.dueAt &&
                        calculateDaysLeft(task?.dueAt as Timestamp)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Link href={`/workspace/${workspace?.id}/tasks`}>
          <Button className="w-full text-white font-bold">Show All</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default AssignedTask;
