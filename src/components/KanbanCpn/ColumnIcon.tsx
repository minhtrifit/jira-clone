import {
  CircleCheck,
  CircleDashed,
  CircleEllipsis,
  ListCheck,
  ScanSearch,
} from "lucide-react";

interface PropType {
  value: "backlog" | "todo" | "inprogress" | "inreview" | "done";
}

const ColumnIcon = (props: PropType) => {
  const { value } = props;

  if (value === "backlog")
    return <CircleEllipsis size={18} className="text-red-500" />;

  if (value === "todo")
    return <ListCheck size={18} className="text-pink-500" />;

  if (value === "inprogress")
    return <CircleDashed size={18} className="text-yellow-500" />;

  if (value === "inreview")
    return <ScanSearch size={18} className="text-sky-500" />;

  if (value === "done")
    return <CircleCheck size={18} className="text-green-500" />;
};

export default ColumnIcon;
