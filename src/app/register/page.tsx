"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "../lib/firebaseConfig";

export default function Register(){
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await register(email, password);
      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.code);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-200 p-8 rounded-lg">
        <h1>Register</h1>
        <form onSubmit={onSubmit}>
          <div>
            <input
              className="p-2 m-2 rounded-md border border-solid border-black/[.08]"
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
            className="p-2 m-2 rounded-md border border-solid border-black/[.08]"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            type="submit">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};