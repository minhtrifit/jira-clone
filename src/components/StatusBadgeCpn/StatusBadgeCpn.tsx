import { Badge } from "@/components/ui/badge";

interface PropType {
  value: "backlog" | "todo" | "inprogress" | "inreview" | "done";
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
};

export default StatusBadgeCpn;
