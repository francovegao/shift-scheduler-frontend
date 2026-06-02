"use client";

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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (firebaseUser) {
      firebaseUser.getIdToken().then(setToken);
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (!token) return;
    const fetchNotifications = async () => {
      try {
        const notificationsResponse = await fetchUnseenNotifications(token);
        setNotifications(notificationsResponse?.data ?? []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
  }, [token]);

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, token }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
