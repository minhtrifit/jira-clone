import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TASK_TYPE } from "@/types";

interface PropType {
  task: TASK_TYPE;
}

const KTask = (props: PropType) => {
  const { task } = props;

  const id = task?.id ?? "";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <Card
      className="w-[100%] cursor-grab p-3 rounded-none"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="flex flex-col">
        <h1 className="text-[0.9rem] font-semibold truncate">{task?.name}</h1>
        <div className="mt-3 pt-3 border-t border-zinc-300 dark:border-zinc-700 border-dashed">
          <p>{task?.description}</p>
        </div>
      </div>
    </Card>
  );
};

export default KTask;
