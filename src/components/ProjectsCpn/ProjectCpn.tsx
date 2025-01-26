"use client";

import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstLetterUppercase } from "@/lib/utils";
import Link from "next/link";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";

const ProjectCpn = () => {
  const { workspace }: WorkspaceStoreState = useWorkspaceStore();

  return (
    <Card className="px-5 w-full basis:auto lg:basis-full rounded-sm">
      <CardHeader className="px-0 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[1.05rem] font-bold">Projects (2)</h1>
          <div className="text-black dark:text-white rounded-md p-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-gray-900 dark:hover:bg-gray-800 hover:cursor-pointer">
            <Plus size={20} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-5 pt-4 border-t border-dashed border-zinc-300 dark:border-gray-600">
        <div className="grid grid-cols-2 gap-4">
          <Link href={`/workspace/${workspace?.id}/project/abc-123`}>
            <Card className="rounded-md">
              <CardContent className="py-3 px-5">
                <div className="flex items-center gap-5">
                  <Avatar className="rounded-md">
                    <AvatarImage
                      src={"project avatar url"}
                      alt={"project name"}
                    />
                    <AvatarFallback className="rounded-md bg-primary text-white text-[0.9rem] font-bold">
                      {/* {"Mobile App Development"
                      ? getFirstLetterUppercase("Mobile App Development")
                      : "U"} */}
                      {getFirstLetterUppercase("Mobile App Development")}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-[0.8rem] font-bold max-w-[250px] truncate">
                    Mobile App Development
                  </h1>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/workspace/${workspace?.id}/project/abc-123`}>
            <Card className="rounded-md">
              <CardContent className="py-3 px-5">
                <div className="flex items-center gap-5">
                  <Avatar className="rounded-md">
                    <AvatarImage
                      src={"project avatar url"}
                      alt={"project name"}
                    />
                    <AvatarFallback className="rounded-md bg-primary text-white text-[0.9rem] font-bold">
                      {/* {"Mobile App Development"
                      ? getFirstLetterUppercase("Mobile App Development")
                      : "U"} */}
                      {getFirstLetterUppercase("Mobile App Development")}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-[0.8rem] font-bold max-w-[250px] truncate">
                    Mobile App Development
                  </h1>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/workspace/${workspace?.id}/project/abc-123`}>
            <Card className="rounded-md">
              <CardContent className="py-3 px-5">
                <div className="flex items-center gap-5">
                  <Avatar className="rounded-md">
                    <AvatarImage
                      src={"project avatar url"}
                      alt={"project name"}
                    />
                    <AvatarFallback className="rounded-md bg-primary text-white text-[0.9rem] font-bold">
                      {/* {"Mobile App Development"
                      ? getFirstLetterUppercase("Mobile App Development")
                      : "U"} */}
                      {getFirstLetterUppercase("Mobile App Development")}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-[0.8rem] font-bold max-w-[250px] truncate">
                    Mobile App Development
                  </h1>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCpn;
