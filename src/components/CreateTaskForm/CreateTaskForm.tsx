import { FormEvent, useState } from "react";
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
import { PROJECT_TYPE, TASK_TYPE } from "@/types";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import useTaskStore, { TaskStoreState } from "@/store/task";
import {
  convertToFirebaseTimestamp,
  formatDateForFirestore,
  getStatusObj,
  STATUS_LIST,
} from "@/lib/utils";
import { DateTimePicker } from "../DateTimePicker/DateTimePicker";

interface PropType {
  children: React.ReactNode;
}

const CreateTaskForm = (props: PropType) => {
  const { children } = props;

  const { user }: any = useAuth();

  const { workspace }: WorkspaceStoreState = useWorkspaceStore();
  const {
    loading,
    projects,
    getTasksByWorkspaceId,
    createTask,
  }: TaskStoreState = useTaskStore();

  const [open, setOpen] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState<Date>();
  const [taskForm, setTaskForm] = useState<TASK_TYPE>({
    name: "",
    projectId: "",
    status: getStatusObj("backlog")?.id,
    description: "",
  });

  const handleCreateNewTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (user?.uid && workspace?.id && taskForm.projectId !== "" && dueDate) {
        const newTask: TASK_TYPE = {
          name: taskForm.name,
          description: taskForm.description,
          workspaceId: workspace?.id,
          projectId: taskForm.projectId,
          status: taskForm.status,
          dueAt: formatDateForFirestore(dueDate),
        };

        const createResult = await createTask(newTask);
        console.log("Create new task:", createResult);

        await getTasksByWorkspaceId(workspace?.id);

        toast.success("Create task successfully");
      }
    } catch (error) {
      toast.error("Create task failed");
    } finally {
      setTaskForm({
        name: "",
        projectId: "",
        status: getStatusObj("backlog")?.id,
        description: "",
      });
      setDueDate(undefined);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            handleCreateNewTask(e);
          }}
        >
          <DialogHeader>
            <DialogTitle>Create a task</DialogTitle>
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
            <ButtonCpn type="submit" title="Create" loading={loading} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskForm;
