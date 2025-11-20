"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuth } from "../../context/auth-context";
import { changePassword } from "@/app/lib/firebaseConfig";
import { toast } from "react-toastify";

export default function ChangePasswordForm({ 
  setOpen,
 }: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  }) {
    const { firebaseUser, loading } = useAuth()

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (message) {
            toast(message, {toastId: 'unique-toast'});
            setOpen(false);
        }
    }, [message, setOpen])

    if (loading) return <div>Loading...</div>;
    if (!firebaseUser ) return <div>Please sign in to continue</div>;

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
          setError("New passwords do not match.");
          return;
        }

        const msg = await changePassword(firebaseUser?.email, oldPassword, newPassword, firebaseUser);
        setMessage(msg)
    };
    
  return (
    <form className="flex flex-col gap-6 text-black" onSubmit={handleChangePassword}>
      <h1 className="text-xl font-semibold">Change Password</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                
        {/* Old Password field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500" htmlFor="old-password">Old Password</label>
          <input
            id="old-password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        {/* New Password field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500" htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        {/* Confirm New Password field (added field) */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500" htmlFor="confirm-new-password">Confirm New Password</label>
          <input
            id="confirm-new-password"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="bg-primary text-white p-2 rounded-md hover:bg-primary-100 cursor-pointer">
        Update Password
      </button>
    </form>
  );
}
