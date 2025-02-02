import { FormEvent, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../providers/AuthProvider";
import ButtonCpn from "../ButtonCpn/ButtonCpn";
import { PROJECT_TYPE } from "@/types";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import useTaskStore, { TaskStoreState } from "@/store/task";

interface PropType {
  children: React.ReactNode;
}

const CreateProjectForm = (props: PropType) => {
  const { children } = props;

  const { user }: any = useAuth();

  const { workspace }: WorkspaceStoreState = useWorkspaceStore();
  const { loading, getProjectsByWorkspaceId, createProject }: TaskStoreState =
    useTaskStore();

  const [open, setOpen] = useState<boolean>(false);
  const [projectForm, setProjectForm] = useState<PROJECT_TYPE>({
    name: "",
  });

  const handleCreateNewProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.uid || !workspace?.id) return;

    try {
      const newProject: PROJECT_TYPE = {
        name: projectForm.name,
        workspaceId: workspace?.id,
      };

      const createResult = await createProject(newProject);
      console.log("Create new project:", createResult);

      await getProjectsByWorkspaceId(workspace?.id);

      toast.success("Create project successfully");
    } catch (error: any) {
      toast.error(error?.message ?? "Create project failed");
    } finally {
      setProjectForm({ name: "" });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            handleCreateNewProject(e);
          }}
        >
          <DialogHeader>
            <DialogTitle>Create a project</DialogTitle>
            <DialogDescription>Store entire your work tasks.</DialogDescription>
          </DialogHeader>
          <div className="my-6 flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                required
                placeholder="eg: chill-application"
                value={projectForm.name}
                onChange={(e) => {
                  setProjectForm({ ...projectForm, name: e.target.value });
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

export default CreateProjectForm;
