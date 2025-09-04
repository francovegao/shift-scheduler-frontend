"use client";

import { auth, login, loginGoogle } from "../lib/firebaseConfig";
import { BuildingStorefrontIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { fetchUser } from "../lib/data";
import Link from "next/link";
import SchedulerLogo from "../ui/scheduler-logo";


export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, loading] = useAuthState(auth);

  const logIn = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      try {
        await login(email, password);
      } catch (err: any) {
        setErrorMessage(err.code);
      }
  };

  const logInWithGoogle = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      try {
        await loginGoogle();
      } catch (err: any) {
        setErrorMessage(err.code);
      }
  };

  const redirectUser = async (user: any) => {
    const  userInfo = await fetchUser(user.uid);
    
    const role = userInfo.role; 

    router.push(`/dashboard/${role}`);
  }


  if(loading){
    return <div>Loading...</div>
  }

  if(user) {
    redirectUser(user);
    return <div>Loading...</div>  //TODO add a signout button, this is reached when a user is registered but is not found in the DB
  }

  return (
    <div className="h-screen flex items-center justify-center bg-blue-100">
      <main className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2 items-center">
         <div className="w-48 text-white md:w-64 flex rounded-md bg-blue-600">
            <SchedulerLogo />
          </div>
          <h2 className="text-gray-400">Sign in to your account</h2>
        <div className="font-mono list-inside list-decimal text-sm/6 text-center">
          <form onSubmit={logIn} className="p-4">
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
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                type="submit"
              >
                Log In
              </button>
              <button
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                onClick={logInWithGoogle}
              >
                Log In With Google
              </button>
            </div>
          </form>
          <p>Don't have an account? Please register</p>
              <Link
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                href="/register"
              >
                Register
              </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
