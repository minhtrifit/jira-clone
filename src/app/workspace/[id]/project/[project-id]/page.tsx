"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import useTaskStore, { TaskStoreState } from "@/store/task";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ButtonCpn from "@/components/ButtonCpn/ButtonCpn";
import { formatTimeStampDate, getFirstLetterUppercase } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import { SkeletonCard } from "@/components/SkeletonCard/SkeletonCard";

const DetailProjectPage = () => {
  const { user }: any = useAuth();

  const { workspace }: WorkspaceStoreState = useWorkspaceStore();
  const { loading, project, getProjectByProjectId }: TaskStoreState =
    useTaskStore();

  const router = useRouter();
  const params = useParams();

  const projectId = params?.["project-id"];

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (projectId) getProjectByProjectId(projectId as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <>
      {loading ? (
        <SkeletonCard />
      ) : (
        <div>
          <div className="w-full flex items-center justify-between mb-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}/workspace/${project?.workspaceId}`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6 rounded-md">
                        <AvatarImage
                          src={project?.workspace?.avatarUrl}
                          alt={project?.workspace?.name}
                        />
                        <AvatarFallback className="rounded-md bg-primary text-white text-[0.7rem]">
                          {project?.workspace?.name
                            ? getFirstLetterUppercase(project?.workspace?.name)
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{project?.workspace?.name}</span>
                    </div>
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{project?.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center gap-3">
              <ButtonCpn
                type="button"
                title="Back"
                icon={<RotateCcw size={15} />}
                onClick={() => {
                  handleBack();
                }}
              />
            </div>
          </div>

          <Card className="p-0 bg-zinc-50 dark:bg-slate-900 rounded-md">
            <CardHeader className="px-5 pt-5 pb-5">
              <div className="flex items-center justify-between">
                <h1 className="text-[1.05rem] font-semibold">Overview</h1>
              </div>
            </CardHeader>

            <CardContent className="px-5 pt-0 pb-5">
              <div className="pt-5 flex border-t border-dashed border-gray-300 dark:border-gray-700">
                <div className="basis-full flex flex-col gap-5">
                  <div className="text-[0.9rem] flex items-center gap-3">
                    <h1 className="w-[100px] max-w-[100px] truncate font-semibold text-gray-400">
                      Name
                    </h1>

                    <span>{project?.name}</span>
                  </div>

                  <div className="text-[0.9rem] flex items-center gap-3">
                    <h1 className="w-[100px] max-w-[100px] truncate font-semibold text-gray-400">
                      Owner
                    </h1>

                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6 rounded-md">
                        <AvatarImage
                          src={project?.workspace?.owner?.photoURL}
                          alt={project?.workspace?.owner?.displayName}
                        />
                        <AvatarFallback className="rounded-full bg-primary text-white text-[0.7rem]">
                          {project?.workspace?.owner?.displayName
                            ? getFirstLetterUppercase(
                                project?.workspace?.owner?.displayName
                              )
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{project?.workspace?.owner?.displayName}</span>
                    </div>
                  </div>

                  <div className="text-[0.9rem] flex items-center gap-3">
                    <h1 className="w-[100px] max-w-[100px] truncate font-semibold text-gray-400">
                      Workspace
                    </h1>

                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6 rounded-md">
                        <AvatarImage
                          src={project?.workspace?.avatarUrl}
                          alt={project?.workspace?.name}
                        />
                        <AvatarFallback className="rounded-full bg-primary text-white text-[0.7rem]">
                          {project?.workspace?.name
                            ? getFirstLetterUppercase(project?.workspace?.name)
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{project?.workspace?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="basis-full flex flex-col gap-5">
                  <div className="text-[0.9rem] flex items-center gap-3">
                    <h1 className="w-[100px] max-w-[100px] truncate font-semibold text-gray-400">
                      Created At
                    </h1>

                    <span>
                      {project?.createdAt &&
                        formatTimeStampDate(
                          project?.createdAt as Timestamp,
                          "datetime"
                        )}
                    </span>
                  </div>

                  <div className="text-[0.9rem] flex items-center gap-3">
                    <h1 className="w-[100px] max-w-[100px] truncate font-semibold text-gray-400">
                      Updated At
                    </h1>

                    <span>
                      {project?.updatedAt &&
                        formatTimeStampDate(
                          project?.updatedAt as Timestamp,
                          "datetime"
                        )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default DetailProjectPage;
