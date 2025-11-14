"use client";

import { useState } from "react";
import { resetPasswordEmail } from "../lib/firebaseConfig";
import Link from "next/link";
import SchedulerLogo from "../ui/scheduler-logo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPasswordEmail(email);
      setMessage("If it matches an account, a password reset email has been sent to "+email);
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 p-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-md shadow-2xl flex flex-col gap-6">
         <div className="flex justify-center mb-4">
            <div className="w-48 md:w-64 text-white flex rounded-md bg-primary">
              <SchedulerLogo />
            </div>
          </div>
      
      <h2 className="text-xl text-gray-500 font-sans text-center">Forgot your password?</h2>
      <p className="text-center text-gray-500 text-sm">Enter your email and if we have a matching account we will send you a link to reset it:</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            className="w-full p-3 rounded-md ring-1 ring-gray-300 focus:ring-blue-500 focus:outline-none"
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          className="w-full h-12 rounded-full text-white bg-primary font-medium text-base transition-colors hover:bg-primary-100"
          type="submit"
        >
          Send Reset Email
        </button>
      </form>
      <Link href='/' className="w-full h-12 rounded-full border border-gray-300 text-gray-700 font-medium text-base transition-colors hover:bg-gray-100 flex items-center justify-center gap-2" >
        Back
      </Link>
      {message && <p className="text-sm text-center">{message}</p>}


      </div>
    </div>
  );
}
