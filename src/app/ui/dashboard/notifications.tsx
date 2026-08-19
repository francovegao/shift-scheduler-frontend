"use client";

import { SetStateAction, useState } from "react";
import { useAuth } from "../context/auth-context";
import { markAsReadNotification } from "@/app/lib/actions";
import { fetchUnseenNotifications } from "@/app/lib/data";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useNotifications } from "../context/notifications-context";

export default function Notifications() {
  const { firebaseUser, appUser, loading } = useAuth();
  const { notifications, setNotifications, token } = useNotifications();
  const [visibleCount, setVisibleCount] = useState(5);

  // Handle mark as read
  const markAsRead = async (id: string) => {
    const dataToSend = { seen: true };
    const originalNotifications = [...notifications];

    // Remove from local state
    setNotifications((prev: any[]) => prev.filter((n) => n.id !== id));

    try {
      // Call API to mark as read
      await markAsReadNotification(id, dataToSend, token);
    } catch (error) {
      console.error("Error marking as read", error);

      // Rollback if request fails
      setNotifications(originalNotifications);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!firebaseUser || !appUser) return <div>Please sign in to continue</div>;

  const role = appUser.role;

  const getTimeAgo = (date: string | number | Date) => {
    const notificationDate = new Date(date);
    const timeAgo = formatDistanceToNow(notificationDate, { addSuffix: true });

    return timeAgo;
  };

  const getActionLink = (notification: { type: string; actionUrl: string }) => {
    const commonLinkProps = {
      className: "text-sm text-blue-600 mt-1 hover:bg-blue-300",
    };

    if (notification.type === "shift" && notification.actionUrl) {
      if (role === "pharmacy_manager") {
        return (
          <Link
            {...commonLinkProps}
            href={`/dashboard/shifts?shiftId=${notification.actionUrl}`}
          >
            View More Info
          </Link>
        );
      }

      if (role === "relief_pharmacist") {
        return (
          <Link
            {...commonLinkProps}
            href={`/dashboard/myShifts?shiftId=${notification.actionUrl}`}
          >
            View More Info
          </Link>
        );
      }
    }

    if (notification.type === "cancellationRequest" && notification.actionUrl) {
      if (role === "admin") {
        return (
          <Link
            {...commonLinkProps}
            href={`/dashboard/shifts/cancellation-requests?cancellationRequestId=${notification.actionUrl}`}
          >
            View Request
          </Link>
        );
      }

      if (role === "relief_pharmacist") {
        return (
          <Link
            {...commonLinkProps}
            href={`/dashboard/myShifts?shiftId=${notification.actionUrl}`}
          >
            View More Info
          </Link>
        );
      }
    }

    if (notification.type === "pharmacistRequest" && notification.actionUrl) {
      if (role === "admin") {
        return (
          <Link
            {...commonLinkProps}
            href={`/dashboard/relief_pharmacist/pharmacist-requests?pharmacistRequestId=${notification.actionUrl}`}
          >
            View Request
          </Link>
        );
      }

      if (role === "pharmacy_manager") {
        return (
          <Link
            {...commonLinkProps}
            href={`/dashboard/list/pharmacists/${notification.actionUrl}`}
          >
            View Pharmacist
          </Link>
        );
      }
    }
  };

  return (
    <div className="w-full md:col-span-4 ">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Notifications</h1>
      </div>
      <div className="flex flex-col gap-4 mt-4 bg-surface p-4 rounded-md shadow-sm">
        {notifications.slice(0, visibleCount).map((item: any) => (
          <div
            key={item.id}
            className="text-white odd:bg-complementary-one even:bg-complementary-two rounded-md p-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{item.title}</h2>
              <span className="text-xs rounded-md px-1 py-1">
                {getTimeAgo(item.createdAt)}
              </span>
            </div>
            <p className="text-sm font-medium mt-1">{item.message}</p>
            <div>{getActionLink(item)}</div>
            <button
              onClick={() => markAsRead(item.id)}
              className="mt-2 text-sm bg-secondary text-white px-2 py-1 rounded hover:bg-secondary-100"
            >
              Mark as Read
            </button>
          </div>
        ))}

        {notifications.length === 0 && (
          <p className="text-tx-disabled text-center">No notifications 🎉</p>
        )}

        <div className="flex items-center pb-1 pt-2 px-1 text-tx-body-muted">
          <ArrowPathIcon className="h-5 w-5" />
          <h3 className="ml-2 text-sm">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
