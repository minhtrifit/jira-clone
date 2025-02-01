import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import useTaskStore, { TaskStoreState } from "@/store/task";
import { FileText } from "lucide-react";
import { PDFViewer } from "@react-pdf/renderer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TasksPdfCpn from "./TasksPdfCpn";

const TasksPdfViewer = () => {
  const { workspace }: WorkspaceStoreState = useWorkspaceStore();
  const { tasks, loading }: TaskStoreState = useTaskStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" disabled={tasks?.length === 0 || loading}>
          <FileText size={15} /> Export PDF
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-full h-screen flex flex-col">
        <DialogHeader>
          <DialogTitle>Export PDF</DialogTitle>
          <DialogDescription>
            Monitor all your tasks as pdf file
          </DialogDescription>
        </DialogHeader>

        <PDFViewer width="100%" height="100%">
          <TasksPdfCpn workspace={workspace} tasks={tasks} />
        </PDFViewer>
      </DialogContent>
    </Dialog>
  );
};

export default TasksPdfViewer;
