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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WorkspaceBtn from "../WorkspaceBtn/WorkspaceBtn";
import { useAuth } from "../providers/AuthProvider";
import ButtonCpn from "../ButtonCpn/ButtonCpn";
import { JOIN_WORKSPACE_TYPE, WORKSPACE_TYPE } from "@/types";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";

const CreateWorkspaceForm = () => {
  const { user }: any = useAuth();
  const {
    createWorkspace,
    createJoinWorkspace,
    getWorkspaces,
    loading,
  }: WorkspaceStoreState = useWorkspaceStore();

  const [open, setOpen] = useState<boolean>(false);
  const [workspaceForm, setWorkspaceForm] = useState<WORKSPACE_TYPE>({
    name: "",
  });

  const handleCreateNewWorkSpace = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (user?.uid) {
        const joinUrl = `${
          process.env.NEXT_PUBLIC_API_URL
        }/workspace/join/${uuidv4()}`;

        const newWorkspace: WORKSPACE_TYPE = {
          ownerId: user?.uid,
          name: workspaceForm.name,
          joinUrl: joinUrl,
        };

        const createResult = await createWorkspace(newWorkspace);
        console.log("Create new workspace:", createResult);

        const newJoinWorkspace: JOIN_WORKSPACE_TYPE = {
          workspaceId: createResult?.id,
          userId: user?.uid,
        };

        const joinResult = await createJoinWorkspace(newJoinWorkspace);
        console.log("Create join workspace:", joinResult);

        await getWorkspaces(user?.uid);

        toast.success("Create workspace successfully");
      }
    } catch (error) {
      toast.error("Create workspace failed");
    } finally {
      setWorkspaceForm({ name: "" });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <WorkspaceBtn isCreated={true} onClick={() => {}} />
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            handleCreateNewWorkSpace(e);
          }}
        >
          <DialogHeader>
            <DialogTitle>Create a workspace</DialogTitle>
            <DialogDescription>
              Store entire your work process.
            </DialogDescription>
          </DialogHeader>
          <div className="my-6 flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                required
                placeholder="eg: chill-workspace"
                value={workspaceForm.name}
                onChange={(e) => {
                  setWorkspaceForm({ ...workspaceForm, name: e.target.value });
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

export default CreateWorkspaceForm;
