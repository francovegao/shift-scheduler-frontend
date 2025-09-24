"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerFirebaseUser } from "../lib/firebaseConfig";
import SchedulerLogo from "../ui/scheduler-logo";

export default function Register(){
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const registerUser = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await registerFirebaseUser(email, password);
      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.code);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-blue-100">
      <main className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2 items-center">
         <div className="w-48 text-white md:w-64 flex rounded-md bg-blue-600">
            <SchedulerLogo />
          </div>
          <h2 className="text-gray-400">Register New User</h2>
        <div className="font-mono list-inside list-decimal text-sm/6 text-center">
          <form onSubmit={registerUser} className="p-4">
            <div>
              <input
              className="p-2 m-1 rounded-md ring-1 ring-gray-300"
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                className="p-2 m-1 rounded-md ring-1 ring-gray-300"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              {errorMessage && <p className="text-sm text-red-400 p-2">{errorMessage}</p>}
            </div>
            <div className="flex gap-4 p-2 items-center flex-col sm:flex-row">
              <button
                className=" rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full"
                type="submit"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};