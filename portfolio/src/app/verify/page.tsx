"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState("Verifying your subscription...");

  useEffect(() => {
    // If someone just types /verify into the browser without a token
    if (!token) {
      setStatus('error');
      setMessage("No verification token found in the link.");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch("/api/verify-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage("Your email has been successfully verified! You are now subscribed.");
        } else {
          setStatus('error');
          setMessage(data.message || "Verification failed. The link might be expired or invalid.");
        }
      } catch (error) {
        setStatus('error');
        setMessage("An unexpected error occurred. Please try again.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl dark:shadow-none max-w-md w-full text-center border border-gray-100 dark:border-gray-800 transition-colors duration-300">
      {status === 'loading' && (
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin text-teal-600 dark:text-teal-400 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2 transition-colors">Verifying...</h2>
          <p className="text-gray-500 dark:text-gray-400 transition-colors">Please wait a moment while we confirm your email.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center fade-in">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 transition-colors">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2 transition-colors">You are all set!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 transition-colors">{message}</p>
          <Link 
            href="/blog" 
            className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-all flex items-center justify-center shadow-lg shadow-teal-100 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Read Latest Articles <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center fade-in">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6 transition-colors">
            <XCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2 transition-colors">Something went wrong</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 transition-colors">{message}</p>
          <Link 
            href="/blog" 
            className="w-full py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Return to Blog
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6 py-12 font-sans transition-colors duration-300">
      {/* Suspense is required by Next.js when using useSearchParams in Client Components */}
      <Suspense fallback={<Loader2 className="animate-spin text-teal-600 dark:text-teal-400" size={32} />}>
        <VerifyContent />
      </Suspense>
    </main>
  );
}