"use client";

import { useDataRevision } from "@/app/lib/data-revisions";
import { acceptRefresh } from "@/app/lib/refresh-response";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth-context";
import { fetchUnseenNotifications } from "@/app/lib/data";

const NotificationContext = createContext<any>(null);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseUser } = useAuth();
  const notificationsRevision = useDataRevision("notifications");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    let active = true;
    if (firebaseUser) {
      firebaseUser.getIdToken().then((idToken: string) => {
        if (active) setToken(idToken);
      });
    } else {
      setToken("");
      setNotifications([]);
    }
    return () => {
      active = false;
    };
  }, [firebaseUser]);

  useEffect(() => {
    if (!token) return;
    let active = true;
    const fetchNotifications = async () => {
      try {
        const notificationsResponse = await fetchUnseenNotifications(token);
        if (!active || !acceptRefresh(notificationsResponse, "notifications")) return;
        setNotifications(notificationsResponse.data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
    return () => {
      active = false;
    };
  }, [token, notificationsRevision]);

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, token }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
