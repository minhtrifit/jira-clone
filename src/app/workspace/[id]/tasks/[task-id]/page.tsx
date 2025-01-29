"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import useTaskStore, { TaskStoreState } from "@/store/task";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import {
  formatTimeStampDate,
  getFirstLetterUppercase,
  STATUS_TYPE_LIST,
} from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import { Pencil, RotateCcw, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CreateTaskForm from "@/components/CreateTaskForm/CreateTaskForm";
import ButtonCpn from "@/components/ButtonCpn/ButtonCpn";
import StatusBadgeCpn from "@/components/StatusBadgeCpn/StatusBadgeCpn";
import { SkeletonCard } from "@/components/SkeletonCard/SkeletonCard";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import { TASK_TYPE } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const DetailTaskPage = () => {
  const { user }: any = useAuth();

  const { workspace }: WorkspaceStoreState = useWorkspaceStore();
  const {
    loading,
    task,
    getTasksByWorkspaceId,
    getTaskByTaskId,
    deleteTaskById,
  }: TaskStoreState = useTaskStore();

  const params = useParams();
  const taskId = params?.["task-id"];

  const router = useRouter();

  const [openEditTaskForm, setOpenEditTaskForm] = useState<boolean>(false);
  const [targetTask, setTargetTask] = useState<TASK_TYPE | null>(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);

  const handleBack = () => {
    router.back();
  };

  const handleDeleteTask = async (task: TASK_TYPE) => {
    if (user?.uid !== task?.createdBy) {
      toast.error("You don't have permission to do that");
      return;
    }

    try {
      if (workspace?.id && task?.id) {
        await deleteTaskById(task?.id);
        await getTasksByWorkspaceId(workspace?.id);

        toast.success("Delete task successfully");
        router.push(`/workspace/${workspace?.id}`);
      }
    } catch (error) {
      console.log("Delete task failed:", error);
      toast.error("Delete task failed");
    }
  };

  useEffect(() => {
    if (taskId) getTaskByTaskId(taskId as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  return (
    <>
      {loading ? (
        <SkeletonCard />
      ) : (
        <div>
          <CreateTaskForm
            isEdit={true}
            open={openEditTaskForm}
            setOpen={(e) => {
              setOpenEditTaskForm(e);
            }}
            initValue={task}
          >
            <></>
          </CreateTaskForm>

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

          <div className="w-full flex items-center justify-between mb-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_API_URL}/workspace/${task?.workspaceId}/project/${task?.projectId}`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6 rounded-md">
                        <AvatarImage
                          src={task?.project?.avatarUrl}
                          alt={task?.project?.name}
                        />
                        <AvatarFallback className="rounded-md bg-primary text-white text-[0.7rem]">
                          {task?.project?.name
                            ? getFirstLetterUppercase(task?.project?.name)
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{task?.project?.name}</span>
                    </div>
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{task?.name}</BreadcrumbPage>
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

              <Button
                variant="destructive"
                onClick={() => {
                  setTargetTask(task);
                  setOpenDeleteConfirm(true);
                }}
              >
                <Trash size={15} /> Delete
              </Button>
            </div>
          </div>

          <Card className="p-0 bg-zinc-50 dark:bg-slate-900 rounded-md">
            <CardHeader className="px-5 pt-5 pb-5">
              <div className="flex items-center justify-between">
                <h1 className="text-[1.05rem] font-semibold">Overview</h1>

                <div>
                  <ButtonCpn
                    type="button"
                    title="Edit"
                    icon={<Pencil size={15} />}
                    onClick={() => {
                      setOpenEditTaskForm(true);
                    }}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-5 pt-0 pb-5">
              <div className="pt-5 flex border-t border-dashed border-gray-300 dark:border-gray-700">
                <div className="basis-full flex flex-col gap-5">
                  <div className="text-[0.9rem] flex items-center gap-3">
                    <h1 className="w-[100px] max-w-[100px] truncate font-semibold text-gray-400">
                      Name
                    </h1>

                    <span>{task?.name}</span>
                  </div>

                  <div className="text-[0.9rem] flex items-center gap-3">
                    <h1 className="w-[100px] max-w-[100px] truncate font-semibold text-gray-400">
                      Assignee
                    </h1>

                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6 rounded-md">
                        <AvatarImage
                          src={task?.assignee?.photoURL}
                          alt={task?.assignee?.displayName}
                        />
                        <AvatarFallback className="rounded-full bg-primary text-white text-[0.7rem]">
                          {task?.assignee?.displayName
                            ? getFirstLetterUppercase(
                                task?.assignee?.displayName
                              )
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{task?.assignee?.displayName}</span>
                    </div>
                  </div>

                  <div className="text-[0.9rem] flex items-center gap-3">
                    <h1 className="w-[100px] max-w-[100px] truncate font-semibold text-gray-400">
                      Due Date
                    </h1>

                    <span className="font-semibold text-orange-500 dark:text-orange-400">
                      {task?.dueAt &&
                        formatTimeStampDate(
                          task?.dueAt as Timestamp,
                          "datetime"
                        )}
                    </span>
                  </div>

                  <div className="text-[0.9rem] flex items-center gap-3">
                    <h1 className="w-[100px] max-w-[100px] truncate font-semibold text-gray-400">
                      Status
                    </h1>

                    <StatusBadgeCpn value={task?.status as STATUS_TYPE_LIST} />
                  </div>

                  <div className="text-[0.9rem] flex items-center gap-3">
                    <h1 className="w-[100px] max-w-[100px] truncate font-semibold text-gray-400">
                      Description
                    </h1>

                    <span>{task?.description}</span>
                  </div>
                </div>

                <div className="basis-full flex flex-col gap-5">
                  <div className="text-[0.9rem] flex items-center gap-3">
                    <h1 className="w-[100px] max-w-[100px] truncate font-semibold text-gray-400">
                      Workspace
                    </h1>

                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6 rounded-md">
                        <AvatarImage
                          src={task?.workspace?.avatarUrl}
                          alt={task?.workspace?.name}
                        />
                        <AvatarFallback className="rounded-full bg-primary text-white text-[0.7rem]">
                          {task?.workspace?.name
                            ? getFirstLetterUppercase(task?.workspace?.name)
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{task?.workspace?.name}</span>
                    </div>
                  </div>

                  <div className="text-[0.9rem] flex items-center gap-3">
                    <h1 className="w-[100px] max-w-[100px] truncate font-semibold text-gray-400">
                      Project
                    </h1>

                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6 rounded-md">
                        <AvatarImage
                          src={task?.project?.avatarUrl}
                          alt={task?.project?.name}
                        />
                        <AvatarFallback className="rounded-full bg-primary text-white text-[0.7rem]">
                          {task?.project?.name
                            ? getFirstLetterUppercase(task?.project?.name)
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{task?.project?.name}</span>
                    </div>
                  </div>

                  <div className="text-[0.9rem] flex items-center gap-3">
                    <h1 className="w-[100px] max-w-[100px] truncate font-semibold text-gray-400">
                      Created At
                    </h1>

                    <span>
                      {task?.createdAt &&
                        formatTimeStampDate(
                          task?.createdAt as Timestamp,
                          "datetime"
                        )}
                    </span>
                  </div>

                  <div className="text-[0.9rem] flex items-center gap-3">
                    <h1 className="w-[100px] max-w-[100px] truncate font-semibold text-gray-400">
                      Created By
                    </h1>

                    <div className="flex items-center gap-3">
                      <Avatar className="h-6 w-6 rounded-md">
                        <AvatarImage
                          src={task?.createdUser?.photoURL}
                          alt={task?.createdUser?.displayName}
                        />
                        <AvatarFallback className="rounded-full bg-primary text-white text-[0.7rem]">
                          {task?.createdUser?.displayName
                            ? getFirstLetterUppercase(
                                task?.createdUser?.displayName
                              )
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{task?.createdUser?.displayName}</span>
                    </div>
                  </div>

                  <div className="text-[0.9rem] flex items-center gap-3">
                    <h1 className="w-[100px] max-w-[100px] truncate font-semibold text-gray-400">
                      Updated At
                    </h1>

                    <span>
                      {task?.updatedAt &&
                        formatTimeStampDate(
                          task?.updatedAt as Timestamp,
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

export default DetailTaskPage;
