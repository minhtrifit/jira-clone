"use client";

import { useEffect, useState, useMemo } from "react";
import useTaskStore, { TaskStoreState } from "@/store/task";
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
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import { TASK_TYPE } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { formatTimeStampDate } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import { ArrowDown, ArrowUp } from "lucide-react";

const TableCpn = () => {
  const { workspace }: WorkspaceStoreState = useWorkspaceStore();
  const { tasks, loading, getTasksByWorkspaceId }: TaskStoreState =
    useTaskStore();

  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    if (workspace?.id) getTasksByWorkspaceId(workspace?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace?.id]);

  const filteredData = useMemo(() => {
    return tasks.filter((task) =>
      task.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

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
    {
      accessorKey: "id",
      header: ({ column }) => {
        return <span>ID</span>;
      },
      cell: (info) => info.getValue(),
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return <span>Name</span>;
      },
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return <span>Status</span>;
      },
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return <span>Created At</span>;
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
        return <span>Due Date</span>;
      },
      enableSorting: true,
      cell: (info) => {
        const value = info.getValue() as Timestamp | undefined;

        if (!value) return "---";

        return formatTimeStampDate(value, "datetime");
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
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="pageSize" className="mr-2">
          Items per page:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="p-2 border rounded"
        >
          {[3, 5, 10].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

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
                        asc: <ArrowUp size={18} />,
                        desc: <ArrowDown size={18} />,
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

      <div className="flex justify-between items-center mt-4">
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
      </div>
    </div>
  );
};

export default TableCpn;
