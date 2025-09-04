'use client';

import { fetchUserRole } from "@/app/lib/data";
import { auth } from "@/app/lib/firebaseConfig";
import { MagnifyingGlassIcon, BellIcon, UserCircleIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function NavBar() {
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  // Fetch role from backend once we have a user
  useEffect(() => {
      const fetchRole = async () => {
        if (user) {
          try {
            const token = await user.getIdToken();
            const res = await fetchUserRole(user.uid, token);
            setRole(res.role); 
          } catch (err) {
            console.error("Error fetching role:", err);
          } finally {
            setCheckingRole(false);
          }
        }
      };

    fetchRole();
  }, [user]);

  if (loading || checkingRole) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Prevent flicker before redirect
  }

  return (
    <div className='flex items-center justify-between p-4'>
      {/* SEARCH BAR */}
      <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
        <MagnifyingGlassIcon className="w-7 h-7" />
        <input type="text" placeholder="Search..." className="w-[200px] p-2 bg-transparent outline-none"/>
      </div>
      {/* ICONS AND USER */}
      <div className='flex items-center gap-6 justify-end w-full'>
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'>
          <BellIcon className="w-20" />
          <div className='absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg--500 text-white rounded-full text-xs'>1</div>
        </div>
        <div className='flex flex-col'>
          <span className="text-xs leading-3 font-medium">John Doe</span>
          <span className="text-[10px] text-gray-500 text-right">{role}</span>
        </div>
        <UserCircleIcon className="w-7 h-7" />
      </div>
    </div>
  )

}