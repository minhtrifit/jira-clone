"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import useTaskStore, { TaskStoreState } from "@/store/task";
import { useAuth } from "../providers/AuthProvider";
import {
  ColumnDef,
  useReactTable,
  getPaginationRowModel,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TASK_TYPE } from "@/types";
import { formatTimeStampDate } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  Pencil,
  Search,
  Trash,
} from "lucide-react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import CreateTaskForm from "../CreateTaskForm/CreateTaskForm";

const TableCpn = () => {
  const { user }: any = useAuth();

  const { workspace }: WorkspaceStoreState = useWorkspaceStore();
  const {
    tasks,
    loading,
    getTasksByWorkspaceId,
    deleteTaskById,
  }: TaskStoreState = useTaskStore();

  const router = useRouter();

  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [targetTask, setTargetTask] = useState<TASK_TYPE | null>(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);
  const [openEditTaskForm, setOpenEditTaskForm] = useState<boolean>(false);

  useEffect(() => {
    if (workspace?.id) getTasksByWorkspaceId(workspace?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace?.id]);

  const filteredData = useMemo(() => {
    return tasks.filter((task) =>
      task.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  const handleViewDetailTask = (task: TASK_TYPE) => {
    if (workspace?.id && task?.id)
      router.push(`/workspace/${workspace?.id}/tasks/${task?.id}`);
  };

  const handleDeleteTask = async (task: TASK_TYPE) => {
    if (user?.uid !== task?.createdBy) {
      toast.error("You don't have permission to do that");
      return;
    }

    if (workspace?.id && task?.id) {
      await deleteTaskById(task?.id);
      await getTasksByWorkspaceId(workspace?.id);

      toast.success("Delete task successfully");
    }
  };

  const columns: ColumnDef<TASK_TYPE>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    // {
    //   accessorKey: "id",
    //   header: ({ column }) => {
    //     return <span>ID</span>;
    //   },
    //   cell: (info) => info.getValue(),
    //   enableSorting: false,
    // },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <span className="flex items-center gap-2">
            Name {sorting?.length === 0 && <ArrowUpDown size={15} />}
          </span>
        );
      },
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <span className="flex items-center gap-2">
            Status {sorting?.length === 0 && <ArrowUpDown size={15} />}
          </span>
        );
      },
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <span className="flex items-center gap-2">
            Created At {sorting?.length === 0 && <ArrowUpDown size={15} />}
          </span>
        );
      },
      enableSorting: true,
      cell: (info) => {
        const value = info.getValue() as Timestamp | undefined;

        if (!value) return "---";

        return formatTimeStampDate(value, "date");
      },
    },
    {
      accessorKey: "dueAt",
      header: ({ column }) => {
        return (
          <span className="flex items-center gap-2">
            Due Date {sorting?.length === 0 && <ArrowUpDown size={15} />}
          </span>
        );
      },
      enableSorting: true,
      cell: (info) => {
        const value = info.getValue() as Timestamp | undefined;

        if (!value) return "---";

        return formatTimeStampDate(value, "datetime");
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const task = info.row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  handleViewDetailTask(task);
                }}
              >
                <div className="flex items-center gap-3">
                  <Eye size={15} /> View detail
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  setOpenEditTaskForm(true);
                  setTargetTask(task);
                }}
              >
                <div className="flex items-center gap-3">
                  <Pencil size={15} /> Edit
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setOpenDeleteConfirm(true);
                  setTargetTask(task);
                }}
              >
                <div className="flex items-center gap-3">
                  <Trash size={15} /> Delete
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting: sorting,
      pagination: {
        pageIndex: pageIndex,
        pageSize: pageSize,
      },
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  return (
    <div>
      <ConfirmDialog
        open={openDeleteConfirm}
        setOpen={(e) => {
          if (e === false) {
            setTargetTask(null);
          }

          setOpenDeleteConfirm(e);
        }}
        title="Are you absolutely sure?"
        description="This action cannot be undone."
        loading={loading}
        onConfirm={() => {
          if (targetTask) handleDeleteTask(targetTask);
        }}
      />

      <CreateTaskForm
        isEdit={true}
        open={openEditTaskForm}
        setOpen={(e) => {
          if (e === false) {
            setTargetTask(null);
          }

          setOpenEditTaskForm(e);
        }}
        initValue={targetTask}
      >
        <></>
      </CreateTaskForm>

      <div className="flex justify-between items-center">
        <div className="relative w-1/3">
          <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <Input
            className="pl-8"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="mt-8 rounded-none">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer"
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ArrowUp size={15} />,
                          desc: <ArrowDown size={15} />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="flex items-center justify-between mt-5">
        <div>
          <span className="text-sm">{`${
            Object.keys(rowSelection).length
          } of ${pageSize} row(s) selected`}</span>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <span className="text-[0.8rem] text-gray-500 dark:text-gray-400">
              Items per page
            </span>
            <Select
              defaultValue={pageSize.toString()}
              onValueChange={(value: string) => {
                setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[3, 5, 10, 100].map((size) => {
                  return (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <PaginationContent>
            {Array.from({ length: table.getPageCount() }, (_, index) => (
              <PaginationItem key={index} className="hover:cursor-pointer">
                <PaginationLink
                  isActive={index === pageIndex}
                  onClick={() => {
                    setPageIndex(index);
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </div>
      </div>

      {/* <div className="flex justify-between items-center mt-4">
        <Button
          disabled={!table.getCanPreviousPage()}
          onClick={() => {
            setPageIndex((prev: number) => {
              return (prev = prev - 1);
            });
          }}
        >
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          disabled={!table.getCanNextPage()}
          onClick={() => {
            setPageIndex((prev: number) => {
              return (prev = prev + 1);
            });
          }}
        >
          Next
        </Button>
      </div> */}
    </div>
  );
};

export default TableCpn;
