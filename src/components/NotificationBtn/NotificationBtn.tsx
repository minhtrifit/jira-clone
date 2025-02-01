"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import useTaskStore, { TaskStoreState } from "@/store/task";
import useWorkspaceStore, { WorkspaceStoreState } from "@/store/workspace";
import useNotifcationStore, {
  NotificationStoreState,
} from "@/store/notifications";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NOTIFICATION_TYPE } from "@/types";
import {
  formatTimeStampDate,
  getFirstLetterUppercase,
  getTimeAgo,
} from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import Empty from "../Empty/Empty";

const NotificationBtn = () => {
  const { user }: any = useAuth();

  const { workspace }: WorkspaceStoreState = useWorkspaceStore();
  const { projects }: TaskStoreState = useTaskStore();
  const {
    error,
    notifications,
    getNotificationsByReceiverId,
    updateNotificationById,
  }: NotificationStoreState = useNotifcationStore();

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user?.uid) getNotificationsByReceiverId(user?.uid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const handleUpdateIsSeenNotification = async (
    notis: NOTIFICATION_TYPE[],
    notification: NOTIFICATION_TYPE
  ) => {
    if (notification?.isSeen) return;

    const updateNotification: NOTIFICATION_TYPE = {
      id: notification?.id,
      name: notification?.name,
      url: notification?.url,
      senderId: notification?.senderId,
      receiverId: notification?.receiverId,
      isSeen: true,
    };

    if (user?.uid && updateNotification) {
      await updateNotificationById(updateNotification);

      if (error) return;

      await getNotificationsByReceiverId(user?.uid);
      handleGetUnreadNotification(notis);
    }
  };

  const handleGetUnreadNotification = (notis: NOTIFICATION_TYPE[]) => {
    return (
      notis?.filter((noti: NOTIFICATION_TYPE) => {
        return noti?.isSeen === false;
      })?.length ?? 0
    );
  };

  return (
    <div className="relative">
      {handleGetUnreadNotification(notifications) !== 0 && (
        <div className="absolute right-[-5px] top-[-10px] bg-red-500 w-5 h-5 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-[0.7rem] max-w-[20px] truncate">
            {handleGetUnreadNotification(notifications)}
          </span>
        </div>
      )}

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setOpen((prev) => !prev)}
          >
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Open</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Notification</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {notifications?.length === 0 && (
              <div className="w-[380px] p-3">
                <Empty size={40} />
              </div>
            )}

            {notifications?.length !== 0 &&
              notifications?.map((notification: NOTIFICATION_TYPE) => {
                return (
                  <DropdownMenuItem key={notification?.id}>
                    <Link
                      href={notification?.url ?? "/workspace"}
                      className="w-[380px] p-1"
                      onMouseEnter={() => {
                        handleUpdateIsSeenNotification(
                          notifications,
                          notification
                        );
                      }}
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <Avatar className="h-10 w-10 rounded-md">
                            <AvatarImage
                              src={notification?.sender?.photoURL as string}
                              alt={notification?.sender?.displayName}
                            />
                            <AvatarFallback
                              className={`rounded-full text-white text-[0.9rem] bg-primary`}
                            >
                              {notification?.sender?.displayName
                                ? getFirstLetterUppercase(
                                    notification?.sender?.displayName
                                  )
                                : "U"}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex flex-col gap-1">
                            <span className="max-w-[250px] truncate text-[0.rem] font-semibold">
                              {notification?.name}
                            </span>
                            <span className="text-[0.8rem] text-gray-500 dark:text-gray-400">
                              {notification?.createdAt &&
                                formatTimeStampDate(
                                  notification?.createdAt as Timestamp,
                                  "datetime"
                                )}
                            </span>
                          </div>
                        </div>

                        {!notification?.isSeen && (
                          <div className="w-[10px] h-[10px] rounded-full bg-primary"></div>
                        )}
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationBtn;
