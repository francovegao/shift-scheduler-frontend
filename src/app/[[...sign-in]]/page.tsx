"use client";

import { auth, login, loginGoogle } from "../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { fetchUser } from "../lib/data";
import Link from "next/link";
import SchedulerLogo from "../ui/scheduler-logo";
import SignOutButton from "../ui/dashboard/sign-out-button";
import Image from 'next/image';


export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [firebaseUser, loading] = useAuthState(auth);

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

  const redirectUser = async (firebaseUser: any) => {
    const token = await firebaseUser.getIdToken();
    const  userInfo = await fetchUser(firebaseUser.uid, token);

    const role = userInfo.role; 

    router.push(`/dashboard/${role}`);
  }


  if(loading){
    return <div>Loading...</div>
  }

  if(firebaseUser) {
    redirectUser(firebaseUser);
    return (
      <div>
        Loading... 

        <p className="mt-10">
          If this is taking too long please press the next button and try again
          </p>
        <SignOutButton />
      </div> 
    ) 
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 p-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-md shadow-2xl flex flex-col gap-6">
         <div className="flex justify-center mb-4">
            <div className="w-48 md:w-64 text-white flex rounded-md bg-primary">
              <SchedulerLogo />
            </div>
          </div>

          <h2 className="text-xl text-gray-500 font-sans text-center">Sign in to your account</h2>

        
          <form onSubmit={logIn} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email-input" className="sr-only">Email</label>
              <input
                id="email-input"
                className="w-full p-3 rounded-md ring-1 ring-gray-300 focus:ring-blue-500 focus:outline-none"
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password-input" className="sr-only">Password</label>
              <input
                id="password-input"
                className="w-full p-3 rounded-md ring-1 ring-gray-300 focus:ring-blue-500 focus:outline-none"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorMessage && <p className="text-sm text-red-400 text-center">{errorMessage}</p>}

            <button
                className="w-full h-12 rounded-full text-white bg-primary font-medium text-base transition-colors hover:bg-primary-100"
                type="submit"
              >
                Log In
              </button>
          </form>

          <Link href='/forgot_password' className="w-full h-12 rounded-full border border-gray-300 text-gray-700 font-medium text-base transition-colors hover:bg-gray-100 flex items-center justify-center gap-2" >
            Forgot Password
          </Link>
              
          <div className="text-center text-gray-500 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative inline-block px-4 bg-white text-sm">
              Or
            </div>
          </div>
           <p className="text-center text-gray-500 text-sm">If you already have an account</p>
          <button
            onClick={logInWithGoogle}
            className="w-full h-12 rounded-full border border-gray-300 text-gray-700 font-medium text-base transition-colors hover:bg-gray-100 flex items-center justify-center gap-2"
          >
            <Image src="./google-logo.svg" alt="Google Logo" width={20} height={20} />
            Log In With Google
          </button>
          
          <p className="mt-4 text-center text-gray-500 text-sm">
            Don't have an account?{' '}
            <span className="text-blue-600 hover:underline">
              <Link href="mailto:someone@example.com">Contact the administrator</Link>
            </span>
          </p>
      </div>
    </div>
  );
}
