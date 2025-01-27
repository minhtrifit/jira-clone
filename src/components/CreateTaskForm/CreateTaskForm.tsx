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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../providers/AuthProvider";
import ButtonCpn from "../ButtonCpn/ButtonCpn";
import { PROJECT_TYPE, TASK_TYPE, USER_TYPE } from "@/types";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import useTaskStore, { TaskStoreState } from "@/store/task";
import {
  convertTimestampToDate,
  formatDateForFirestore,
  getStatusObj,
  STATUS_LIST,
} from "@/lib/utils";
import { DateTimePicker } from "../DateTimePicker/DateTimePicker";
import { Timestamp } from "firebase/firestore";

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
    createTask,
  }: TaskStoreState = useTaskStore();

  // const [open, setOpen] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState<Date>();
  const [taskForm, setTaskForm] = useState<TASK_TYPE>({
    name: "",
    projectId: "",
    assigneeId: "",
    status: getStatusObj("backlog")?.id,
    description: "",
  });

  useEffect(() => {
    if (initValue) {
      console.log(initValue);
      setTaskForm(initValue);
      setDueDate(convertTimestampToDate(initValue?.dueAt as Timestamp) as Date);
    }
  }, [initValue]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (
        user?.uid &&
        workspace?.id &&
        taskForm?.assigneeId !== "" &&
        taskForm.projectId !== "" &&
        dueDate
      ) {
        if (!isEdit) {
          const newTask: TASK_TYPE = {
            name: taskForm.name,
            description: taskForm.description,
            workspaceId: workspace?.id,
            assigneeId: taskForm.assigneeId,
            projectId: taskForm.projectId,
            status: taskForm.status,
            dueAt: formatDateForFirestore(dueDate),
          };

          const createResult = await createTask(newTask);
          console.log("Create new task:", createResult);
        }

        await getTasksByWorkspaceId(workspace?.id);

        toast.success(`${!isEdit ? "Create" : "Edit"} task successfully`);
      }
    } catch (error) {
      toast.error(`${!isEdit ? "Create" : "Edit"} task failed`);
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
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isEdit && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="max-h-[100vh] overflow-y-auto">
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
                required
                placeholder="eg: being-a-chill-guy"
                value={taskForm.name}
                onChange={(e) => {
                  setTaskForm({ ...taskForm, name: e.target.value });
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="project">Project</Label>
              <Select
                required
                defaultValue={taskForm.projectId}
                onValueChange={(value: string) => {
                  setTaskForm({ ...taskForm, projectId: value });
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
                          {project?.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select
                required
                defaultValue={taskForm.assigneeId}
                onValueChange={(value: string) => {
                  setTaskForm({ ...taskForm, assigneeId: value });
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
                          {user?.displayName}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                required
                defaultValue={taskForm.status}
                onValueChange={(value: string) => {
                  setTaskForm({ ...taskForm, status: value });
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
                            {status.title}
                          </SelectItem>
                        );
                      }
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Due Date</Label>
              <DateTimePicker date={dueDate as Date} setDate={setDueDate} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Description</Label>
              <Textarea
                id="description"
                required
                placeholder="Type your task description here."
                value={taskForm.description}
                onChange={(e) => {
                  setTaskForm({ ...taskForm, description: e.target.value });
                }}
              />
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
