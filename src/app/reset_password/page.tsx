"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { confirmPasswordResetLink } from "../lib/firebaseConfig";
import Link from "next/link";
import SchedulerLogo from "../ui/scheduler-logo";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!oobCode) {
      setError("Invalid or expired reset link. Please request a new one.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordResetLink(oobCode, password);
      setMessage("Password has been reset successfully. You can now log in.");
    } catch (err: any) {
      if (err.code === "auth/expired-action-code") {
        setError("This reset link has expired. Please request a new one.");
      } else if (err.code === "auth/invalid-action-code") {
        setError("Invalid reset link. Please request a new one.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-sm p-8 bg-surface rounded-md shadow-2xl flex flex-col gap-6">
        <div className="flex justify-center mb-4">
          <div className="w-48 md:w-64 text-white flex items-center justify-center p-4 rounded-md bg-primary">
            <SchedulerLogo />
          </div>
        </div>

        <h2 className="text-xl text-tx-body-muted font-sans text-center">
          Reset Your Password
        </h2>
        <p className="text-center text-tx-body-muted text-sm">
          Enter your new password below:
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="sr-only">
              New Password
            </label>
            <input
              id="password"
              className="w-full p-3 rounded-md ring-1 ring-gray-300 focus:ring-blue-500 focus:outline-none"
              type="password"
              placeholder="New password (min 6 characters)"
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              className="w-full p-3 rounded-md ring-1 ring-gray-300 focus:ring-blue-500 focus:outline-none"
              type="password"
              placeholder="Confirm new password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            className="w-full h-12 rounded-full text-white bg-primary font-medium text-base transition-colors hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <Link
          href="/"
          className="w-full h-12 rounded-full border border-gray-300 text-tx-tertiary font-medium text-base transition-colors hover:bg-gray-100 flex items-center justify-center gap-2"
        >
          Back to Login
        </Link>

        {error && <p className="text-sm text-center text-red-600">{error}</p>}
        {message && <p className="text-sm text-center text-green-600">{message}</p>}
      </div>
    </div>
  );
}