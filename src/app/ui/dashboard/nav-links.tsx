"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  UserIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  XCircleIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "../context/auth-context";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const links = [
  {
    name: "Home",
    href: "/dashboard",
    icon: HomeIcon,
    visible: [
      "admin",
      "relief_pharmacist",
      "pharmacy_manager",
      "location_manager",
    ],
  },
  {
    name: "Shifts",
    href: "/dashboard/shifts",
    icon: CalendarDaysIcon,
    visible: ["admin"],
    children: [
      {
        name: "Upcoming",
        href: "/dashboard/shifts/upcoming",
        icon: ChevronDoubleRightIcon,
        visible: ["admin"],
      },
      {
        name: "Past",
        href: "/dashboard/shifts/past",
        icon: ChevronDoubleLeftIcon,
        visible: ["admin"],
      },
      {
        name: "Cancel Requests",
        href: "/dashboard/shifts/cancellation-requests",
        icon: XCircleIcon,
        visible: ["admin"],
      },
    ],
  },
  {
    name: "Shifts",
    href: "/dashboard/shifts",
    icon: CalendarDaysIcon,
    visible: ["pharmacy_manager", "location_manager"],
    children: [
      {
        name: "Upcoming",
        href: "/dashboard/shifts/upcoming",
        icon: ChevronDoubleRightIcon,
        visible: ["pharmacy_manager", "location_manager"],
      },
      {
        name: "Past",
        href: "/dashboard/shifts/past",
        icon: ChevronDoubleLeftIcon,
        visible: ["pharmacy_manager", "location_manager"],
      },
    ],
  },
  {
    name: "Open Shifts",
    href: "/dashboard/openShifts",
    icon: CalendarDaysIcon,
    visible: ["relief_pharmacist"],
  },
  {
    name: "My Shifts",
    href: "/dashboard/myShifts",
    icon: CalendarDaysIcon,
    visible: ["relief_pharmacist"],
  },
  {
    name: "Users",
    href: "/dashboard/list/users",
    icon: UserGroupIcon,
    visible: ["admin"],
    children: [
      {
        name: "Pharmacists",
        href: "/dashboard/list/pharmacists",
        icon: UserIcon,
        visible: ["admin", "pharmacy_manager", "location_manager"],
      },
    ],
  },
  {
    name: "Pharmacists",
    href: "/dashboard/list/pharmacists",
    icon: UserIcon,
    visible: ["pharmacy_manager", "location_manager"],
  },
  {
    name: "Companies",
    href: "/dashboard/list/companies",
    icon: BuildingOfficeIcon,
    visible: ["admin"],
  },
  // { name: 'Locations', href: '/dashboard/list/locations', icon: BuildingOffice2Icon, visible: ["admin", "pharmacy_manager" ], },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: DocumentDuplicateIcon,
    visible: ["admin"],
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: UserCircleIcon,
    visible: [
      "admin",
      "relief_pharmacist",
      "pharmacy_manager",
      "location_manager",
    ],
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { firebaseUser, appUser, loading } = useAuth();

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    if (!pathname) return;

    const initialExpandedState: Record<string, boolean> = {};
    links.forEach((link) => {
      if (link.children) {
        const hasActiveChild = link.children.some(
          (child) =>
            child.href === pathname &&
            child.visible.includes(appUser?.role ?? ""),
        );
        if (hasActiveChild) {
          initialExpandedState[link.name] = true;
        }
      }
    });

    setExpandedMenus((prev) => ({ ...prev, ...initialExpandedState }));
  }, [pathname, appUser?.role]);

  if (loading) return <div>Loading...</div>;

  if (!firebaseUser || !appUser) {
    return null;
  }

  const toggleMenu = (menuName: any) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  return (
    <div className="flex flex-wrap gap-2 md:flex-col md:gap-2">
      {links.map((link) => {
        const LinkIcon = link.icon;
        if (!appUser.role || !link.visible.includes(appUser.role)) return null;

        const hasChildren = link.children && link.children.length > 0;
        const isExpanded = !!expandedMenus[link.name];

        return (
          <div key={link.name} className="">
            <div className="">
              <Link
                href={link.href}
                onClick={() => hasChildren && toggleMenu(link.name)}
                className={clsx(
                  "flex h-[48px] items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-primary md:flex-none md:justify-start md:p-2 md:px-3",
                  {
                    "bg-sky-100 text-primary": pathname === link.href,
                  },
                )}
              >
                <LinkIcon className="w-6 shrink-0" />
                <p className="hidden md:block">{link.name}</p>
                {hasChildren && (
                  <div className="block shrink-0 ml-auto text-gray-400 group-hover:text-primary">
                    {isExpanded ? (
                      <ChevronDownIcon className="w-4 h-4 transition-transform duration-200" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4 transition-transform duration-200" />
                    )}
                  </div>
                )}
              </Link>
            </div>

            {hasChildren && isExpanded && (
              <div className="flex flex-col gap-1 pl-4 transition-all duration-200 mt-2">
                {link.children.map((child) => {
                  const ChildIcon = child.icon;
                  if (child.visible.includes(appUser.role ?? "")) {
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={clsx(
                          "flex h-[36px] items-center justify-start gap-2 rounded-md bg-gray-50 p-2 text-xs font-medium hover:bg-sky-100 hover:text-primary",
                          {
                            "bg-sky-100 text-primary": pathname === child.href,
                          },
                        )}
                      >
                        <ChildIcon className="w-6 shrink-0" />
                        <p className="hidden md:block">{child.name}</p>
                      </Link>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
