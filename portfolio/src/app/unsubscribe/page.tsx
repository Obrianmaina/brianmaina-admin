"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import toast from "react-hot-toast";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleUnsubscribe() {
    if (!email) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to unsubscribe");

      setIsSuccess(true);
      toast.success("Successfully unsubscribed");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">You have been unsubscribed</h1>
        <p className="text-gray-600">You will no longer receive updates from me. You can safely close this window.</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Unsubscribe</h1>
      <p className="text-gray-600 mb-6">
        Are you sure you want to unsubscribe <strong>{email}</strong> from these updates?
      </p>
      <button
        onClick={handleUnsubscribe}
        disabled={isLoading || !email}
        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-md transition-colors disabled:opacity-70"
      >
        {isLoading ? "Processing..." : "Confirm Unsubscribe"}
      </button>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full">
        <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
          <UnsubscribeContent />
        </Suspense>
      </div>
    </div>
  );
}