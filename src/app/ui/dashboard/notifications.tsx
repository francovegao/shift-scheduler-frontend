"use client";

import { SetStateAction, useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";
import { markAsReadNotification } from "@/app/lib/actions";
import { fetchUnseenNotifications } from "@/app/lib/data";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function Notifications() {
  const { firebaseUser, appUser, loading } = useAuth();
  const [isFetching, setIsFetching] = useState(true);
  const [token, setToken] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);

  // Get token
    useEffect(() => {
      if (firebaseUser) {
        firebaseUser.getIdToken().then((idToken: SetStateAction<string>) => {
          setToken(idToken);
        });
      }
    }, [firebaseUser]);
 
      // Fetch notifications when token is ready
      useEffect(() => {
        const getNotifications = async () => {
          setIsFetching(true);
          try {
            const notificationsResponse = await fetchUnseenNotifications(token);
            setNotifications(notificationsResponse?.data ?? []);
          } catch (err) {
            console.error("Failed to fetch notifications", err);
          } finally {
            setIsFetching(false);
          }
        };
        if (token){ getNotifications() };
    }, [token]);

  // Handle mark as read
  const markAsRead = async (id: string) => {
    const dataToSend = { seen: true };

    // Remove from local state
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      // Call API to mark as read
      await markAsReadNotification(id, dataToSend, token);

    } catch (error) {
      console.error("Error marking as read", error);

      // Rollback if request fails
      setNotifications((prev) => [
        ...prev,
        notifications.find((n) => n.id === id)!,
      ]);
    }
  };

  if (loading || isFetching) return <div>Loading...</div>;
  if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

  const role = appUser.role;

  const getTimeAgo = (date: string | number | Date) => {
    const notificationDate = new Date(date);
    const timeAgo = formatDistanceToNow(notificationDate, {addSuffix: true});

    return timeAgo;
  }

  const getActionLink = (notification : {type: string, actionUrl: string}) => {
    if (notification.type !== "shift" || !notification.actionUrl) {
      return (
        <p className="text-sm text-blue-600 mt-1">
          {notification.actionUrl}
        </p>
      );
    }

    // Common link properties
    const commonLinkProps = {
      className: "text-sm text-blue-600 mt-1"
    };

    if (role === "pharmacy_manager") {
      return (
        <Link {...commonLinkProps} href={`/dashboard/shifts?shiftId=${notification.actionUrl}`}>
          View More Info
        </Link>
      );
    }

    if (role === "relief_pharmacist") {
      return (
        <Link {...commonLinkProps} href={`/dashboard/myShifts?shiftId=${notification.actionUrl}`}>
          View More Info
        </Link>
      );
    }
  };

  return (
    <div className="w-full md:col-span-4 ">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Notifications</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4 bg-white p-4 rounded-md shadow-sm">
        {notifications.slice(0, visibleCount).map((item) => (
          <div className=" odd:bg-blue-100 even:bg-purple-100 rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{item.title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {getTimeAgo(item.createdAt)}
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              {item.message}
            </p>
            <div>
              {getActionLink(item)}
            </div>
            <button
              onClick={() => markAsRead(item.id)}
              className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              Mark as Read
            </button>
          </div>
        ))}

        {notifications.length === 0 && (
          <p className="text-gray-400 text-center">No notifications 🎉</p>
        )}
      </div>
    </div>
  );
};