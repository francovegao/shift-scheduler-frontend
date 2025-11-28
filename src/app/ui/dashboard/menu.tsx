'use client';

import { useEffect, useRef, useState } from 'react';

type MenuProps = {
  button: React.ReactNode;     
  children: React.ReactNode;   
  align?: "left" | "right";    
  width?: string;              
};

export default function Menu({
  button,
  children,
  align = "right",
  width = "w-48",
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggle = () => setOpen((prev) => !prev);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative">
      <div ref={buttonRef} onClick={toggle}>
        {button}
      </div>

      {open && (
        <div
          ref={menuRef}
          className={`absolute mt-2 bg-white rounded-md shadow-lg z-20 py-2 ${width} ${
            align === "right" ? "right-0" : ""
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
