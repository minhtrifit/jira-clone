"use client";

import { Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";

const AssignedTask = () => {
  const { workspace }: WorkspaceStoreState = useWorkspaceStore();

  return (
    <Card className="px-4 w-full basis:auto lg:basis-full rounded-sm bg-zinc-100 dark:bg-gray-900">
      <CardHeader className="px-0 pt-4 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[1.05rem] font-bold">Assigned Tasks (14)</h1>
          <div className="text-white bg-primary rounded-md p-2 hover:bg-primary/90 hover:cursor-pointer">
            <Plus size={20} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-4 pt-4 border-t border-dashed border-zinc-300 dark:border-gray-600">
        <div className="mb-5 flex flex-col gap-2">
          <Card>
            <CardHeader className="pt-5 pb-3 font-bold">
              Implement offline mode
            </CardHeader>
            <CardContent className="pb-5">
              <div className="flex items-end gap-5">
                <span className="text-sm">Mobile App Development</span>
                <span className="flex items-center gap-1 text-[0.8rem] text-gray-400">
                  <Calendar size={15} /> 13 days
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pt-5 pb-3 font-bold">
              Implement offline mode
            </CardHeader>
            <CardContent className="pb-5">
              <div className="flex items-end gap-5">
                <span className="text-sm">Mobile App Development</span>
                <span className="flex items-center gap-1 text-[0.8rem] text-gray-400">
                  <Calendar size={15} /> 13 days
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pt-5 pb-3 font-bold">
              Implement offline mode
            </CardHeader>
            <CardContent className="pb-5">
              <div className="flex items-end gap-5">
                <span className="text-sm">Mobile App Development</span>
                <span className="flex items-center gap-1 text-[0.8rem] text-gray-400">
                  <Calendar size={15} /> 13 days
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Link href={`/workspace/${workspace?.id}/tasks`}>
          <Button className="w-full text-white font-bold">Show All</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default AssignedTask;
