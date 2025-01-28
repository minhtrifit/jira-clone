import { v4 as uuidv4 } from "uuid";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { FILTER_BAR_LIST } from "./FilterBar";

interface PropType {
  id: FILTER_BAR_LIST;
  title: string;
  icon?: React.ReactNode;
  items: { id: string; title: string }[];
  filter: string;
  handleFilterChange: (id: FILTER_BAR_LIST, value: string) => void;
}

const FilterComboBox = (props: PropType) => {
  const { id, title, icon, items, filter, handleFilterChange } = props;

  const getFilterBoxTitle = (filter: string) => {
    return items?.find((item) => {
      return item.id === filter;
    })?.title;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Card className="rounded-sm">
          <CardContent className="px-4 py-1 text-[0.8125rem] flex items-center gap-2">
            {icon && icon} {filter ? getFilterBoxTitle(filter) : title}{" "}
            <ChevronsUpDown size={15} />
          </CardContent>
        </Card>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items?.map((item) => {
          return (
            <DropdownMenuItem
              className="flex items-center justify-between"
              key={uuidv4()}
              onClick={() => {
                handleFilterChange(id, item?.id);
              }}
            >
              {item?.title}
              {filter === item?.id && <Check size={15} />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterComboBox;
