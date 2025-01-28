import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import useTaskStore, { TaskStoreState } from "@/store/task";
import { toast } from "react-toastify";
import {
  CalendarClock,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import CreateTaskForm from "../CreateTaskForm/CreateTaskForm";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TASK_TYPE } from "@/types";
import { formatTimeStampDate, getFirstLetterUppercase } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";

interface PropType {
  task: TASK_TYPE;
}

const KTask = (props: PropType) => {
  const { task } = props;

  const id = task?.id ?? "";

  const router = useRouter();
  const { user }: any = useAuth();
  const { workspace }: WorkspaceStoreState = useWorkspaceStore();
  const { loading, getTasksByWorkspaceId, deleteTaskById }: TaskStoreState =
    useTaskStore();

  const [targetTask, setTargetTask] = useState<TASK_TYPE | null>(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);
  const [openEditTaskForm, setOpenEditTaskForm] = useState<boolean>(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const handleViewDetailTask = (task: TASK_TYPE) => {
    if (workspace?.id && task?.id)
      router.push(`/workspace/${workspace?.id}/tasks/${task?.id}`);
  };

  const handleDeleteTask = async (task: TASK_TYPE) => {
    if (user?.uid !== task?.createdBy) {
      toast.error("You don't have permission to do that");
      return;
    }

    if (workspace?.id && task?.id) {
      await deleteTaskById(task?.id);
      await getTasksByWorkspaceId(workspace?.id);

      toast.success("Delete task successfully");
    }
  };

  return (
    <>
      <ConfirmDialog
        open={openDeleteConfirm}
        setOpen={(e) => {
          if (e === false) {
            setTargetTask(null);
          }

          setOpenDeleteConfirm(e);
        }}
        title="Are you absolutely sure?"
        description="This action cannot be undone."
        loading={loading}
        onConfirm={() => {
          if (targetTask) handleDeleteTask(targetTask);
        }}
      />

      <CreateTaskForm
        isEdit={true}
        open={openEditTaskForm}
        setOpen={(e) => {
          if (e === false) {
            setTargetTask(null);
          }

          setOpenEditTaskForm(e);
        }}
        initValue={targetTask}
      >
        <></>
      </CreateTaskForm>

      <Card
        className="w-[100%] p-0 cursor-grab p-3 rounded-none"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
          <h1 className="max-w-[260px] text-[0.9rem] font-semibold truncate">
            {task?.name}
          </h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  handleViewDetailTask(task);
                }}
              >
                <div className="flex items-center gap-3">
                  <Eye size={15} /> View detail
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  setOpenEditTaskForm(true);
                  setTargetTask(task);
                }}
              >
                <div className="flex items-center gap-3">
                  <Pencil size={15} /> Edit
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setOpenDeleteConfirm(true);
                  setTargetTask(task);
                }}
              >
                <div className="flex items-center gap-3">
                  <Trash size={15} /> Delete
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="px-0 py-3 border-t border-zinc-300 dark:border-zinc-700 border-dashed">
          <p className="text-[0.8rem] text-gray-600 dark:text-gray-300 flex items-center gap-2">
            <CalendarClock size={20} /> Due:{" "}
            {formatTimeStampDate(task?.dueAt as Timestamp, "datetime")}
          </p>
        </CardContent>

        <CardFooter className="p-0 mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-6 w-6 rounded-md">
              <AvatarImage
                src={task?.project?.avatarUrl as string}
                alt={task?.project?.name}
              />
              <AvatarFallback className="rounded-md bg-primary text-white text-[0.7rem]">
                {task?.project?.name
                  ? getFirstLetterUppercase(task?.project?.name)
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[180px] text-[0.8rem] font-semibold truncate">
              {task?.project?.name ? task?.project?.name : "unknow"}
            </span>
          </div>

          <Avatar className="h-6 w-6 rounded-full">
            <AvatarImage
              src={task?.assignee?.photoURL as string}
              alt={task?.assignee?.displayName}
            />
            <AvatarFallback className="rounded-md bg-primary text-white text-[0.7rem]">
              {task?.assignee?.displayName
                ? getFirstLetterUppercase(task?.assignee?.displayName)
                : "U"}
            </AvatarFallback>
          </Avatar>
        </CardFooter>
      </Card>
    </>
  );
};

export default KTask;
