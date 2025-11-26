'use client';

import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from "../context/auth-context";
import { displayRole } from "@/app/lib/utils";
import SignOutButton from "./sign-out-button";

export default function NavBar() {
  const { firebaseUser, appUser, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);  

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleUserMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) return <div>Loading...</div>;

  if (!firebaseUser || !appUser) {
    return null; 
  }

  return (
    <div className='flex items-center justify-between p-4'>
      {/* ICONS AND USER */}
      <div className='flex items-center gap-6 justify-end w-full'>
        <div className='rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative hover:bg-sky-100 hover:text-primary'>
          <BellIcon className="w-20" />
          <div className='absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg--500 text-white rounded-full text-xs'>1</div>
        </div>
        <div className='flex flex-col'>
          <span className="text-xs leading-3 font-medium">{appUser.firstName} {appUser.lastName}</span>
          <span className="text-[10px] text-gray-500 text-right">{displayRole(appUser.role)}</span>
        </div>
        
        {/* User Menu Container */}
        <div className="relative">
          <div
            ref={buttonRef} // Attach ref to the clickable area
            onClick={toggleUserMenu} 
            className="cursor-pointer hover:bg-sky-100 hover:text-primary rounded-full"
          >
            <UserCircleIcon className="w-7 h-7" />
          </div>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div
              ref={menuRef} // Attach ref to the menu
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1"
            >
              <Link
                href="/"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <p>Profile</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}