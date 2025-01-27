"use client";

import { Settings } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstLetterUppercase } from "@/lib/utils";
import Link from "next/link";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import { USER_TYPE } from "@/types";

const PeopleCpn = () => {
  const { workspace }: WorkspaceStoreState = useWorkspaceStore();

  return (
    <Card className="px-4 w-full basis:auto lg:basis-full rounded-sm">
      <CardHeader className="px-0 pt-4 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[1.05rem] font-bold">
            People ({workspace?.joinUsers?.length ?? 0})
          </h1>
          <div className="text-black dark:text-white rounded-md p-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-gray-900 dark:hover:bg-gray-800 hover:cursor-pointer">
            <Settings size={20} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-4 pt-4 border-t border-dashed border-zinc-300 dark:border-gray-600">
        <div className="grid grid-cols-3 gap-4">
          {workspace?.joinUsers?.map((user: USER_TYPE, index: number) => {
            if (index < 3) {
              return (
                <Card key={uuidv4()} className="rounded-md">
                  <CardContent className="p-5">
                    <div className="flex flex-col items-center gap-1">
                      <Avatar className="rounded-md">
                        <AvatarImage
                          src={"project avatar url"}
                          alt={"project name"}
                        />
                        <AvatarFallback className="rounded-full bg-primary text-white text-[0.9rem] font-bold">
                          {user?.displayName
                            ? getFirstLetterUppercase(user?.displayName)
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <h1 className="mt-2 text-[0.8rem] font-bold max-w-[250px] truncate">
                        {user?.displayName}
                      </h1>
                      <span className="text-[0.7rem] text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            }
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PeopleCpn;
