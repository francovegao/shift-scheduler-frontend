"use client";

import { SetStateAction, useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";
import { fetchNotifications } from "@/app/lib/data";

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
            if(appUser){
               const notificationsResponse = await fetchNotifications(appUser.id, token);
               setNotifications(notificationsResponse?.data ?? []);
            }
          } catch (err) {
            console.error("Failed to fetch notifications", err);
          } finally {
            setIsFetching(false);
          }
        };
        if (token){ getNotifications() };
  }, [token, appUser]);

  // Handle mark as read
  const markAsRead = async (id: string) => {
    try {
      // Call API to mark as read
      await fetch(`/api/notifications/${id}/mark-as-read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Remove from local state
      setNotifications((prev) => prev.filter((n) => n.id !== id));

      // Keep showing 5 items (if more exist)
      if (visibleCount < notifications.length) {
        setVisibleCount((prev) => prev); // No change needed, as the next one will appear automatically
      }
    } catch (error) {
      console.error("Error marking as read", error);
    }
  };

    if (loading || isFetching) return <div>Loading...</div>;
    if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

  return (
    <div className="w-full md:col-span-4 ">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Notifications</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4 bg-white p-4 rounded-md">
        {notifications.map((item) => (
          <div className=" odd:bg-blue-100 even:bg-purple-100 rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{item.title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {item.createdAt.slice(0,10)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {item.message}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {item.actionUrl}
            </p>
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