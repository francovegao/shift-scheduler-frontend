'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { role } from '@/app/lib/data';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon, visible: ["admin", "pharmacist", "manager"], },
  { name: 'Shifts', href: '/dashboard/shifts', icon: CalendarDaysIcon, visible: ["admin", "pharmacist", "manager"], },
  { name: 'Pharmacists', href: '/dashboard/list/pharmacists', icon: UserGroupIcon, visible: ["admin"], },
  { name: 'Locations', href: '/dashboard/list/locations', icon: BuildingOffice2Icon, visible: ["admin", "manager"], },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: DocumentDuplicateIcon,
    visible: ["admin"],
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: DocumentDuplicateIcon,
    visible: ["admin", "pharmacist", "manager"],
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        if(link.visible.includes(role)){
          return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
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