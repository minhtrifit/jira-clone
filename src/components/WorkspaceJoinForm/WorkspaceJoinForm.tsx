import { useEffect, useState } from "react";
import copy from "copy-to-clipboard";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import { Check, Clipboard } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const WorkspaceJoinForm = () => {
  const { workspace }: WorkspaceStoreState = useWorkspaceStore();

  const [copyUrlInput, setCopyUrlInput] = useState<string>("");
  const [isCopy, setIsCopy] = useState<boolean>(false);

  const handleCopyLink = () => {
    copy(copyUrlInput);
    setIsCopy(true);

    setTimeout(() => {
      setIsCopy(false);
    }, 8000);
  };

  useEffect(() => {
    if (workspace?.joinUrl) setCopyUrlInput(workspace?.joinUrl);
  }, [workspace?.joinUrl]);

  return (
    <Card className="basis-full rounded-sm">
      <CardHeader>
        <CardTitle>Share this workspace</CardTitle>
        <CardDescription>
          Anyone with the link can join this workspace.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2">
          <Input
            value={copyUrlInput}
            onChange={(e) => {
              setCopyUrlInput(e.target.value);
            }}
          />
          <Button
            variant="default"
            className="text-white"
            onClick={handleCopyLink}
          >
            {isCopy ? <Check /> : <Clipboard />}
            Copy Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkspaceJoinForm;
