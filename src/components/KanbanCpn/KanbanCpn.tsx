import { useEffect, useState } from "react";
import useTaskStore, { TaskStoreState } from "@/store/task";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DropAnimation,
  defaultDropAnimation,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DndContext,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KANBAN_COLUMN_TYPE, TASK_TYPE } from "@/types";
import { COLUMNS_DATA } from "@/lib/utils";
import KColumn from "./KColumn";
import KTask from "./KTask";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";

const KanbanCpn = () => {
  const { workspace }: WorkspaceStoreState = useWorkspaceStore();
  const {
    tasks,
    loading,
    getTasksByWorkspaceId,
    updateTaskById,
    deleteTaskById,
  }: TaskStoreState = useTaskStore();

  const [taskList, setTaskList] = useState<TASK_TYPE[]>(tasks);
  const [activeTask, setActiveTask] = useState<TASK_TYPE | null>(null);

  const columns: KANBAN_COLUMN_TYPE[] = COLUMNS_DATA;

  useEffect(() => {
    if (tasks?.length !== 0) setTaskList(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(taskList.filter((task) => task.id === active.id)[0]);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeColumnId = active.data.current?.sortable.containerId;
    const activeColumn = columns.find((col) => col.id === activeColumnId);
    const overColumn = columns.find((col) => col.id === over.id);

    const overTask = taskList.find((task) => task.id === over.id);

    if (!activeTask || !activeColumn) return;

    // Drop task over task
    if (overTask && !overColumn && activeTask !== overTask) {
      setTaskList((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeTask.id);
        const overIndex = tasks.findIndex((t) => t.id === overTask.id);

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          tasks[activeIndex].status = tasks[overIndex].status;
          activeTask.status = tasks[overIndex].status;

          return arrayMove(tasks, activeIndex, overIndex - 1); // or another logic if needed
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Drop task over column
    if (!overTask && overColumn && activeColumn !== overColumn) {
      setTaskList((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeTask.id);

        tasks[activeIndex].status = overColumn.id;
        activeTask.status = overColumn.id;

        return arrayMove(tasks, activeIndex, activeIndex); // Check if moving within the same column is needed
      });
    }
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    // console.log(active, over);

    if (workspace?.id && activeTask) {
      const updateTask: TASK_TYPE = {
        id: activeTask?.id,
        name: activeTask?.name,
        description: activeTask?.description,
        workspaceId: workspace?.id,
        assigneeId: activeTask?.assigneeId,
        projectId: activeTask?.projectId,
        status: activeTask?.status,
        dueAt: activeTask?.dueAt,
      };

      const updateResult = await updateTaskById(updateTask);
      console.log("Update task:", updateResult);

      // await getTasksByWorkspaceId(workspace?.id);
    }

    setActiveTask(null);
  };

  const task = activeTask ? activeTask : null;

  return (
    <div className="w-[calc(100vw-338px)]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full flex gap-5 overflow-x-auto">
          {columns?.map((col) => {
            return (
              <KColumn
                key={col.id}
                column={col}
                tasks={taskList?.filter((task) => task.status === col.id)}
              />
            );
          })}
          <DragOverlay dropAnimation={dropAnimation}>
            {task ? <KTask task={task} /> : null}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanCpn;
