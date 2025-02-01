import { USER_TYPE, NOTIFICATION_TYPE } from "@/types";
import { create } from "zustand";

export interface NotificationStoreState {
  notifications: NOTIFICATION_TYPE[];
  loading: boolean;
  error: unknown;

  setNotifications: (
    notis: NOTIFICATION_TYPE[]
  ) => Promise<NOTIFICATION_TYPE[]>;
  getNotificationsByReceiverId: (
    receiverId: string
  ) => Promise<NOTIFICATION_TYPE[]>;
  createNotification: (
    notification: NOTIFICATION_TYPE
  ) => Promise<NOTIFICATION_TYPE>;
  updateNotificationById: (
    notification: NOTIFICATION_TYPE
  ) => Promise<NOTIFICATION_TYPE>;
}

const useNotifcationStore = create<NotificationStoreState>((set, get) => ({
  notifications: [],
  loading: false,
  error: null,

  setNotifications: async (notis: NOTIFICATION_TYPE[]) => {
    set({ notifications: notis });

    const currentNotis = get().notifications;

    return currentNotis;
  },

  getNotificationsByReceiverId: async (receiverId: string) => {
    set({ loading: true, error: null });
    try {
      // Get notifications by receiverId
      const res = await fetch(
        `/api/notification/all/receiver-id/${receiverId}`
      );
      if (!res.ok) throw new Error("Get notifications by receiverId failed!");

      const data = await res.json();

      // Get notification sender
      await Promise.all(
        data?.map(async (notification: NOTIFICATION_TYPE) => {
          const senderResponse = await fetch(
            `/api/users/${notification?.senderId}`
          );

          if (!senderResponse.ok)
            throw new Error("Failed to fetch user details!");

          const sender: USER_TYPE = await senderResponse.json();
          notification.sender = sender;
        })
      );

      // Get notification receiver
      await Promise.all(
        data?.map(async (notification: NOTIFICATION_TYPE) => {
          const receiverResponse = await fetch(`/api/users/${receiverId}`);

          if (!receiverResponse.ok)
            throw new Error("Failed to fetch user details!");

          const receiver: USER_TYPE = await receiverResponse.json();
          notification.receiver = receiver;
        })
      );

      set({ notifications: data, loading: false });

      return data;
    } catch (error) {
      set({ error: error, loading: false });
    }
  },

  createNotification: async (notification: NOTIFICATION_TYPE) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) throw new Error("Create notification failed!");

      const data = await response.json();

      set({ loading: false });

      return data;
    } catch (error) {
      set({ error: error, loading: false });
    }
  },

  updateNotificationById: async (notification: NOTIFICATION_TYPE) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `/api/notification/update/notification-id/${notification?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notification),
        }
      );

      if (!res.ok) throw new Error("Update notification failed!");

      const data = await res.json();

      set({ loading: false });

      return data;
    } catch (error) {
      set({ error: error, loading: false });
    }
  },
}));

export default useNotifcationStore;
