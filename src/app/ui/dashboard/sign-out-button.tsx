"use client";

import { auth } from "@/app/lib/firebaseConfig";
import { PowerIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

export default function SignOutButton(){
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  if (loading) { return <div>Loading...</div> }

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
    return(
          <button 
            onClick={handleSignOut}
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
    );
}