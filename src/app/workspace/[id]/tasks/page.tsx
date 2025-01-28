"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import useTaskStore, { TaskStoreState } from "@/store/task";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PageTitle from "@/components/PageTitle/PageTitle";
import ButtonCpn from "@/components/ButtonCpn/ButtonCpn";
import FilterBar from "@/components/FilterBar/FilterBar";
import TableCpn from "@/components/TableCpn/TableCpn";
import KanbanCpn from "@/components/KanbanCpn/KanbanCpn";
import CalendarCpn from "@/components/CalendarCpn/CalendarCpn";
import CreateTaskForm from "@/components/CreateTaskForm/CreateTaskForm";

const TAB_CONTENT_LIST = ["Table", "Kanban", "Calendar"];

const MyTasksPage = () => {
  const { workspace, loading }: WorkspaceStoreState = useWorkspaceStore();
  const { getProjectsByWorkspaceId }: TaskStoreState = useTaskStore();

  const [openCreateTaskForm, setOpenCreateTaskForm] = useState<boolean>(false);

  useEffect(() => {
    if (workspace?.id) getProjectsByWorkspaceId(workspace?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace?.id]);

  const [activeTab, setActiveTab] = useState<"table" | "kanban" | "calendar">(
    "table"
  );

  return (
    <div>
      <PageTitle title="My Tasks" description="View all of your tasks here" />

      <Card className="my-5">
        <Tabs defaultValue="table" className="w-full">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <TabsList className="flex items-center gap-2 bg-transparent">
                {TAB_CONTENT_LIST?.map((tab) => {
                  return (
                    <TabsTrigger
                      key={tab}
                      className={`${
                        activeTab === tab.toLowerCase() &&
                        "data-[state=active]:bg-zinc-200 data-[state=active]:dark:bg-gray-700"
                      } bg-zinc-100 dark:text-white dark:bg-gray-900`}
                      value={tab.toLowerCase()}
                      onClick={() => {
                        setActiveTab(tab.toLowerCase() as any);
                      }}
                    >
                      {tab}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <CreateTaskForm
                isEdit={false}
                open={openCreateTaskForm}
                setOpen={setOpenCreateTaskForm}
                initValue={null}
              >
                <ButtonCpn
                  type="button"
                  title="New"
                  icon={<Plus />}
                  onClick={() => {}}
                />
              </CreateTaskForm>
            </div>
          </CardHeader>

          <CardContent className="px-4 pt-0 pb-4">
            <div>
              <FilterBar />
            </div>

            <TabsContent value="table">
              <TableCpn />
            </TabsContent>
            <TabsContent value="kanban">
              <KanbanCpn />
            </TabsContent>
            <TabsContent value="calendar">
              <CalendarCpn />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default MyTasksPage;
