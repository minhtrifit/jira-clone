import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../providers/AuthProvider";
import ButtonCpn from "../ButtonCpn/ButtonCpn";
import { NOTIFICATION_TYPE, PROJECT_TYPE, TASK_TYPE, USER_TYPE } from "@/types";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import useTaskStore, { TaskStoreState } from "@/store/task";
import useNotifcationStore, {
  NotificationStoreState,
} from "@/store/notifications";
import {
  convertTimestampToDate,
  formatDateForFirestore,
  getFirstLetterUppercase,
  getStatusObj,
  STATUS_LIST,
} from "@/lib/utils";
import { DateTimePicker } from "../DateTimePicker/DateTimePicker";
import { Timestamp } from "firebase/firestore";
import ColumnIcon from "../KanbanCpn/ColumnIcon";

interface PropType {
  children: React.ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isEdit: boolean;
  initValue: TASK_TYPE | null;
}

const CreateTaskForm = (props: PropType) => {
  const { children, open, setOpen, isEdit, initValue } = props;

  const { user }: any = useAuth();

  const { workspace, joinUsers }: WorkspaceStoreState = useWorkspaceStore();
  const {
    loading,
    projects,
    getTasksByWorkspaceId,
    getTaskByTaskId,
    createTask,
    updateTaskById,
  }: TaskStoreState = useTaskStore();
  const {
    getNotificationsByReceiverId,
    createNotification,
  }: NotificationStoreState = useNotifcationStore();

  const [dueDate, setDueDate] = useState<Date>();
  const [taskForm, setTaskForm] = useState<TASK_TYPE>({
    name: "",
    projectId: "",
    assigneeId: "",
    status: getStatusObj("backlog")?.id,
    description: "",
  });
  const [taskFormError, setTaskFormError] = useState<TASK_TYPE>({
    name: "",
    projectId: "",
    assigneeId: "",
    status: "",
    description: "",
    dueAt: "",
  });

  useEffect(() => {
    if (initValue) {
      setTaskForm(initValue);

      if (initValue?.dueAt)
        setDueDate(
          convertTimestampToDate(initValue?.dueAt as Timestamp) as Date
        );
    }
  }, [initValue]);

  const handleTaskFormError = (
    taskForm: TASK_TYPE,
    dueDate: Date | undefined,
    setTaskFormError: (value: SetStateAction<TASK_TYPE>) => void
  ) => {
    let isError: boolean = false;
    let taskFormErrObj: TASK_TYPE = {
      name: "",
      projectId: "",
      assigneeId: "",
      status: "",
      description: "",
      dueAt: "",
    };

    if (taskForm.name === "") {
      taskFormErrObj = { ...taskFormErrObj, name: "Name can not be empty" };
      isError = true;
    }

    if (taskForm.projectId === "") {
      taskFormErrObj = {
        ...taskFormErrObj,
        projectId: "Project can not be empty",
      };
      isError = true;
    }

    if (taskForm.assigneeId === "") {
      taskFormErrObj = {
        ...taskFormErrObj,
        assigneeId: "Assignee can not be empty",
      };
      isError = true;
    }

    if (taskForm.status === "") {
      taskFormErrObj = {
        ...taskFormErrObj,
        status: "Status can not be empty",
      };
      isError = true;
    }

    if (!dueDate) {
      taskFormErrObj = {
        ...taskFormErrObj,
        dueAt: "Due at can not be empty",
      };
      isError = true;
    }

    if (taskForm.description === "") {
      taskFormErrObj = {
        ...taskFormErrObj,
        description: "Description can not be empty",
      };
      isError = true;
    }

    setTaskFormError(taskFormErrObj);
    return isError;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isFormError: boolean = handleTaskFormError(
      taskForm,
      dueDate,
      setTaskFormError
    );

    if (isFormError) return;

    if (
      !user?.uid ||
      user?.uid === "" ||
      !workspace?.id ||
      workspace?.id === "" ||
      !dueDate
    )
      return;

    try {
      if (!isEdit) {
        // Create new task
        const newTask: TASK_TYPE = {
          name: taskForm.name,
          description: taskForm.description,
          workspaceId: workspace.id,
          assigneeId: taskForm.assigneeId,
          projectId: taskForm.projectId,
          status: taskForm.status,
          dueAt: formatDateForFirestore(dueDate),
          createdBy: user.uid,
        };

        const createResult = await createTask(newTask);
        console.log("Create new task:", createResult);

        // Create new notification
        if (createResult?.createdUser) {
          const newNotification: NOTIFICATION_TYPE = {
            name: `${
              createResult?.assigneeId === createResult?.createdBy
                ? "You have a new task!"
                : `${createResult?.createdUser?.displayName} assign a new task for you`
            }`,
            url: `/workspace/${createResult?.workspaceId}/tasks/${createResult?.id}`,
            senderId: `${createResult?.createdUser?.uid}`,
            receiverId: `${createResult?.assigneeId}`,
            isSeen: false,
          };

          const createNotiResult = await createNotification(newNotification);
          console.log("Create new notification:", createNotiResult);
        }
      }

      if (isEdit && initValue && user?.uid !== initValue?.createdBy) {
        toast.error("You don't have permission to do that");
        return;
      }

      if (isEdit && initValue && user?.uid === initValue?.createdBy) {
        const updateTask: TASK_TYPE = {
          id: initValue?.id,
          name: taskForm.name,
          description: taskForm.description,
          workspaceId: workspace?.id,
          assigneeId: taskForm.assigneeId,
          projectId: taskForm.projectId,
          status: taskForm.status,
          dueAt: formatDateForFirestore(dueDate),
        };

        const updateResult = await updateTaskById(updateTask);
        console.log("Update task:", updateResult);

        if (updateResult?.id) await getTaskByTaskId(updateResult?.id);
      }

      await getTasksByWorkspaceId(workspace?.id);

      toast.success(`${!isEdit ? "Create" : "Edit"} task successfully`);
    } catch (error: any) {
      if (error?.message) toast.error(error?.message);
      else toast.error(`${!isEdit ? "Create" : "Edit"} task failed`);
    } finally {
      setTaskForm({
        name: "",
        projectId: "",
        assigneeId: "",
        status: getStatusObj("backlog")?.id,
        description: "",
      });
      setDueDate(undefined);
      setOpen(false);
      setTaskFormError({
        name: "",
        projectId: "",
        assigneeId: "",
        status: "",
        description: "",
        dueAt: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEdit && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent
        className="max-h-[100vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <DialogHeader>
            <DialogTitle>{!isEdit ? "Create" : "Edit"} a task</DialogTitle>
            <DialogDescription>Manage you work perfectly.</DialogDescription>
          </DialogHeader>

          <div className="my-6 flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="eg: being-a-chill-guy"
                value={taskForm.name}
                onChange={(e) => {
                  setTaskForm({ ...taskForm, name: e.target.value });
                  setTaskFormError({ ...taskFormError, name: "" });
                }}
              />
              {taskFormError.name && (
                <span className="text-[0.85rem] text-red-500">
                  {taskFormError.name}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="project">Project</Label>
              <Select
                defaultValue={taskForm.projectId}
                onValueChange={(value: string) => {
                  setTaskForm({ ...taskForm, projectId: value });
                  setTaskFormError({ ...taskFormError, projectId: "" });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {projects?.map((project: PROJECT_TYPE) => {
                      return (
                        <SelectItem key={uuidv4()} value={project?.id ?? ""}>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-6 w-6 rounded-md">
                              <AvatarImage
                                src={project?.avatarUrl}
                                alt={project?.name}
                              />
                              <AvatarFallback className="rounded-md bg-primary text-white text-[0.7rem]">
                                {project?.name
                                  ? getFirstLetterUppercase(project?.name)
                                  : "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-[0.8rem]">
                              {project?.name}
                            </span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {taskFormError.projectId && (
                <span className="text-[0.85rem] text-red-500">
                  {taskFormError.projectId}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select
                defaultValue={taskForm.assigneeId}
                onValueChange={(value: string) => {
                  setTaskForm({ ...taskForm, assigneeId: value });
                  setTaskFormError({ ...taskFormError, assigneeId: "" });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {joinUsers?.map((user: USER_TYPE) => {
                      return (
                        <SelectItem key={uuidv4()} value={user?.uid ?? ""}>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-6 w-6 rounded-md">
                              <AvatarImage
                                src={user?.photoURL}
                                alt={user?.displayName}
                              />
                              <AvatarFallback className="rounded-md bg-primary text-white text-[0.7rem]">
                                {user?.displayName
                                  ? getFirstLetterUppercase(user?.displayName)
                                  : "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-[0.8rem]">
                              {user?.displayName} - {user?.email}
                            </span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {taskFormError.assigneeId && (
                <span className="text-[0.85rem] text-red-500">
                  {taskFormError.assigneeId}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                defaultValue={taskForm.status}
                onValueChange={(value: string) => {
                  setTaskForm({ ...taskForm, status: value });
                  setTaskFormError({ ...taskFormError, status: "" });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {STATUS_LIST?.map(
                      (status: { id: string; title: string }) => {
                        return (
                          <SelectItem key={uuidv4()} value={status.id}>
                            <div className="flex items-center gap-2">
                              <ColumnIcon value={status.id as any} />
                              <span>{status.title}</span>
                            </div>
                          </SelectItem>
                        );
                      }
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {taskFormError.status && (
                <span className="text-[0.85rem] text-red-500">
                  {taskFormError.status}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Due Date</Label>
              <DateTimePicker
                date={dueDate as Date}
                setDate={(e) => {
                  setDueDate(e);
                  setTaskFormError({ ...taskFormError, dueAt: "" });
                }}
              />
              {taskFormError.dueAt && (
                <span className="text-[0.85rem] text-red-500">
                  {taskFormError.dueAt as string}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Description</Label>
              <Textarea
                id="description"
                placeholder="Type your task description here."
                value={taskForm.description}
                onChange={(e) => {
                  setTaskForm({ ...taskForm, description: e.target.value });
                  setTaskFormError({ ...taskFormError, description: "" });
                }}
              />
              {taskFormError.description && (
                <span className="text-[0.85rem] text-red-500">
                  {taskFormError.description}
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <ButtonCpn
              type="submit"
              title={`${!isEdit ? "Create" : "Edit"}`}
              loading={loading}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskForm;
