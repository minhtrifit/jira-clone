import { FormEvent, useState } from "react";
import { SquareArrowOutUpRight } from "lucide-react";
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
import { JOIN_WORKSPACE_TYPE, WORKSPACE_TYPE } from "@/types";
import useWorkspaceStore from "@/store/workspace";

const JoinWorkspaceForm = () => {
  const { user }: any = useAuth();
  const {
    createJoinWorkspace,
    getWorkspaces,
    getWorkspaceByJoinUrl,
    loading,
  }: any = useWorkspaceStore();

  const [open, setOpen] = useState<boolean>(false);
  const [joinWorkspaceForm, setJoinWorkspaceForm] = useState<WORKSPACE_TYPE>({
    joinUrl: "",
  });

  const handleJoinWorkspace = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (user?.uid) {
        const workspace: WORKSPACE_TYPE = await getWorkspaceByJoinUrl(
          joinWorkspaceForm?.joinUrl
        );

        if (!workspace) {
          toast.error("Workspace not found");
          return;
        }

        const newJoinWorkspace: JOIN_WORKSPACE_TYPE = {
          workspaceId: workspace?.id,
          userId: user?.uid,
        };

        const joinResult = await createJoinWorkspace(newJoinWorkspace);
        console.log("Create join workspace:", joinResult);

        await getWorkspaces(user?.uid);

        toast.success("Join workspace successfully");
      }
    } catch (error) {
      toast.error("Join workspace failed");
    } finally {
      setJoinWorkspaceForm({ joinUrl: "" });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ButtonCpn
          type="button"
          title="Join workspace"
          icon={<SquareArrowOutUpRight size={20} />}
        />
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            handleJoinWorkspace(e);
          }}
        >
          <DialogHeader>
            <DialogTitle>Join a workspace</DialogTitle>
            <DialogDescription>
              Work with other to upgrade work quality.
            </DialogDescription>
          </DialogHeader>
          <div className="my-6 flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="joinUrl">Join URL</Label>
              <Input
                id="joinUrl"
                type="text"
                required
                placeholder="fill join url from owner workspace"
                value={joinWorkspaceForm.joinUrl}
                onChange={(e) => {
                  setJoinWorkspaceForm({
                    ...joinWorkspaceForm,
                    joinUrl: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <ButtonCpn type="submit" title="Join" loading={loading} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinWorkspaceForm;
