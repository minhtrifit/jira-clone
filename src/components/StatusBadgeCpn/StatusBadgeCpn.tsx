import { Badge } from "@/components/ui/badge";
import { STATUS_TYPE_LIST } from "@/lib/utils";

interface PropType {
  // value: "backlog" | "todo" | "inprogress" | "inreview" | "done";
  value: STATUS_TYPE_LIST;
}

const StatusBadgeCpn = (props: PropType) => {
  const { value } = props;

  if (value === "backlog")
    return (
      <Badge className="text-white bg-red-500 hover:bg-red-400 hover:cursor-pointer">
        Backlog
      </Badge>
    );

  if (value === "todo")
    return (
      <Badge className="text-white bg-pink-500 hover:bg-pink-400 hover:cursor-pointer">
        Todo
      </Badge>
    );

  if (value === "inprogress")
    return (
      <Badge className="text-white bg-yellow-500 hover:bg-yellow-400 hover:cursor-pointer">
        In Progress
      </Badge>
    );

  if (value === "inreview")
    return (
      <Badge className="text-white bg-sky-500 hover:bg-sky-400 hover:cursor-pointer">
        In Review
      </Badge>
    );

  if (value === "done")
    return (
      <Badge className="text-white bg-green-500 hover:bg-green-400 hover:cursor-pointer">
        Done
      </Badge>
    );

  return (
    <Badge className="text-white bg-red-500 hover:bg-red-400 hover:cursor-pointer">
      Invalid status
    </Badge>
  );
};

export default StatusBadgeCpn;
