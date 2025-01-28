import { useState } from "react";
import { toast } from "react-toastify";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import KTask from "./KTask";
import { KANBAN_COLUMN_TYPE, TASK_TYPE } from "@/types";
import { Plus } from "lucide-react";
import ColumnIcon from "./ColumnIcon";
import CreateTaskForm from "../CreateTaskForm/CreateTaskForm";

interface PropType {
  column: KANBAN_COLUMN_TYPE;
  tasks: TASK_TYPE[];
}

const KColumn = (props: PropType) => {
  const { column, tasks } = props;

  const id = column.id;

  const [openCreateTaskForm, setOpenTaskForm] = useState<boolean>(false);

  const getTasksLengthByColumnId = (tasks: TASK_TYPE[], columnId: string) => {
    return tasks?.filter((task) => {
      return task?.status === columnId;
    }).length;
  };

  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <Card
      className={`basis-full bg-zinc-100 dark:bg-slate-900 min-w-[250px] min-h-[600px] max-h-[600px] overflow-y-auto
                    flex flex-col items-center rounded-md border border-solid`}
    >
      <CardHeader className="w-full px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ColumnIcon value={column.id as any} />
            <span className="text-[0.9rem] font-semibold">
              {column.name} ({getTasksLengthByColumnId(tasks, column.id)})
            </span>
          </div>

          <CreateTaskForm
            isEdit={false}
            open={openCreateTaskForm}
            setOpen={setOpenTaskForm}
            initValue={{ status: column.id }}
          >
            <div className="text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:dark:text-gray-400 hover:cursor-pointer">
              <Plus size={18} />
            </div>
          </CreateTaskForm>
        </div>
      </CardHeader>

      <CardContent className="w-full px-1 py-2">
        <SortableContext
          id={id}
          items={tasks as any}
          strategy={verticalListSortingStrategy}
        >
          <div ref={setNodeRef} className="w-[100%] flex flex-col gap-1">
            {/* {getTasksLengthByColumnId(tasks, column.id) === 0 && <div>Empty</div>} */}

            {tasks.map((task) => (
              <div key={task.id}>
                <KTask task={task} />
              </div>
            ))}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  );
};

export default KColumn;
