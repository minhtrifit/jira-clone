import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import { TASK_TYPE } from "@/types";
import { Button } from "@/components/ui/button";
import { Sheet } from "lucide-react";
import { formatTimeStampDate, getStatusObj } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";

interface PropType {
  tasks: TASK_TYPE[];
  loading: boolean;
}

interface CSV_TABLE_TYPE {
  name: string;
  project: string;
  assignee: string;
  status: string;
  due: string;
}

const TasksCsv = (props: PropType) => {
  const { tasks, loading } = props;

  const [data, setData] = useState<CSV_TABLE_TYPE[]>([]);

  const FILE_NAME = "tasks.csv";

  const handleFormatCsvData = (tasks: TASK_TYPE[]) => {
    const formattedData: CSV_TABLE_TYPE[] = tasks?.map((task: TASK_TYPE) => ({
      name: task?.name ?? "",
      project: task?.project?.name ?? "",
      assignee: task?.assignee?.displayName ?? "",
      status: getStatusObj(task?.status as any)?.title ?? "",
      due: formatTimeStampDate(task?.dueAt as Timestamp, "datetime") ?? "",
    }));

    setData(formattedData);
  };

  useEffect(() => {
    if (tasks?.length !== 0) handleFormatCsvData(tasks);
  }, [tasks]);

  const csvData = Papa.unparse(data);

  return (
    <CSVLink data={csvData} filename={FILE_NAME}>
      <Button variant="secondary" disabled={tasks?.length === 0 || loading}>
        <Sheet size={15} /> Export CSV
      </Button>
    </CSVLink>
  );
};

export default TasksCsv;
