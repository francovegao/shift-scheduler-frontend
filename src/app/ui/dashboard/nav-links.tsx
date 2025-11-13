'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  UserIcon,
  BuildingOfficeIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '../context/auth-context';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon, visible: ["admin", "relief_pharmacist", "pharmacy_manager", "location_manager"], },
  { name: 'Shifts', href: '/dashboard/shifts', icon: CalendarDaysIcon, visible: ["admin","pharmacy_manager", "location_manager"], },
  { name: 'Open Shifts', href: '/dashboard/openShifts', icon: CalendarDaysIcon, visible: ["relief_pharmacist"], },
  { name: 'My Shifts', href: '/dashboard/myShifts', icon: CalendarDaysIcon, visible: [ "relief_pharmacist" ], },
  { name: 'Users', href: '/dashboard/list/users', icon: UserGroupIcon, visible: ["admin"], },
  { name: 'Pharmacists', href: '/dashboard/list/pharmacists', icon: UserIcon, visible: ["admin"], },
  { name: 'Companies', href: '/dashboard/list/companies', icon: BuildingOfficeIcon, visible: ["admin"], },
  { name: 'Locations', href: '/dashboard/list/locations', icon: BuildingOfficeIcon, visible: ["admin"], },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: DocumentDuplicateIcon,
    visible: ["admin"],
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: UserCircleIcon,
    visible: ["admin", "relief_pharmacist", "pharmacy_manager", "location_manager"],
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { firebaseUser, appUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!firebaseUser || !appUser) {
    return null; // Prevent flicker before redirect
  }

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        if(appUser.role && link.visible.includes(appUser.role)){ 
          return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-primary md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-primary': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
          );
        }       
      })}
    </>
  );
}