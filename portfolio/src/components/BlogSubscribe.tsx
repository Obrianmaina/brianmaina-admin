"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function BlogSubscribe() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !nickname) return;

    setLoading(true);
    setStatus('idle');

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          nickname,
          subscriptionType: "blog"
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage("Awesome! Check your inbox to verify your subscription.");
        setEmail("");
        setNickname("");
      } else {
        setStatus('error');
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus('error');
      setMessage("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50 rounded-2xl p-8 my-12 max-w-2xl mx-auto text-center transition-colors duration-300">
      <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
        <Mail size={24} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2 transition-colors">
        Never miss an update
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">
        Get notified whenever I publish a new article. No spam, unsubscribe at any time.
      </p>

      {status === 'success' ? (
        <div className="flex items-center justify-center text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 py-3 px-4 rounded-xl font-medium transition-colors">
          <CheckCircle size={20} className="mr-2" />
          {message}
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
               <input
                type="text"
                required
                placeholder="Your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="flex-grow p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              />
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors flex items-center justify-center disabled:opacity-70 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              {loading ? "Sending..." : "Subscribe"}
              {!loading && <ArrowRight size={18} className="ml-2" />}
            </button>
          </form>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 leading-relaxed transition-colors">
            By subscribing, you consent to the storage of your nickname and email address to receive blog updates. Read our{" "}
            <Link href="/privacy" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium underline transition-colors">
              Privacy Policy
            </Link>{" "}
            for full details.
          </p>
        </div>
      )}
      
      {status === 'error' && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-3 font-medium transition-colors">{message}</p>
      )}
    </div>
  );
}