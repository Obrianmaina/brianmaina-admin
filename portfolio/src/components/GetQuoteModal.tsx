"use client";

import { useState } from "react";
import { X, CheckCircle, Tag, Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function GetQuoteModal({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      nickname: formData.get("nickname"),
      email: formData.get("email"),
      service: formData.get("service"),
      details: formData.get("details"),
      newsletter: formData.get("newsletter") === "on",
    };

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to send request");

      setIsSuccess(true);
      toast.success("Message sent!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Blurred Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-md transition-colors duration-300"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-2xl shadow-teal-500/10 dark:shadow-teal-900/20 rounded-[1rem] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 transition-colors duration-300 pointer-events-auto"
        >
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 z-10 p-2 bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-10">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3">Quote Request Sent!</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
                  Thank you for reaching out. I have received your details and will get back to you at your email address shortly.
                </p>
                <button 
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 font-bold py-3.5 rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  Close Window
                </button>
              </motion.div>
            ) : (
              <>
                {/* Header with Pricing Icon Link */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 pr-6 gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50">Let&apos;s build something great.</h2>
                  
                  <Link 
                    href="/pricing"
                    onClick={onClose}
                    className="inline-flex w-fit items-center gap-1.5 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 px-4 py-2 rounded-full text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                    title="View Pricing Guide"
                  >
                    <Tag size={16} />
                    <span>Pricing Guide</span>
                  </Link>
                </div>
                
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8">Fill out the form below and I will get back to you within 24 hours.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Preferred Name / Nickname *</label>
                      <input 
                        type="text" 
                        id="nickname" 
                        name="nickname" 
                        required 
                        className="w-full p-3.5 bg-gray-50/50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                        placeholder="How should I address you?"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        className="w-full p-3.5 bg-gray-50/50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Service Needed *</label>
                    <input 
                      list="design-services" 
                      id="service" 
                      name="service" 
                      required 
                      className="w-full p-3.5 bg-gray-50/50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                      placeholder="Select or type a service"
                    />
                    <datalist id="design-services">
                      <option value="Logo Design" />
                      <option value="Full Brand Identity System" />
                      <option value="Landing Page Design" />
                      <option value="Website UI Design" />
                      <option value="Web App UI Design" />
                      <option value="SaaS Dashboard UI" />
                      <option value="Mobile App UI Design" />
                      <option value="UI/UX Consultation" />
                      <option value="Social Media Post Design" />
                      <option value="Banner Design" />
                      <option value="Ad Design" />
                      <option value="Billboard Design" />
                      <option value="Print Banner" />
                      <option value="Web Banner" />
                      <option value="Pitch Deck Design" />
                      <option value="Presentation Design" />
                      <option value="Brochure Design" />
                      <option value="Company Profile Design" />
                      <option value="Publication Design" />
                      <option value="Poster Design" />
                      <option value="Flyer Design" />
                      <option value="Church or NGO Poster Design" />
                      <option value="Church or NGO Flyer Design" />
                      <option value="Short Video Editing" />
                      <option value="Motion Graphics" />
                      <option value="Explainer Video" />
                      <option value="Business Card Design" />
                      <option value="Letterhead" />
                      <option value="Email Signature" />
                      <option value="Invoice Template" />
                      <option value="PowerPoint Template" />
                      <option value="Email Newsletter Template" />
                    </datalist>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Project Details (Optional)</label>
                    <textarea 
                      id="details" 
                      name="details" 
                      rows={3}
                      className="w-full p-3.5 bg-gray-50/50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none transition-all"
                      placeholder="Tell me a bit about your project..."
                    ></textarea>
                  </div>

                  <div className="flex items-start space-x-3 pt-2">
                    <input 
                      type="checkbox" 
                      id="newsletter" 
                      name="newsletter" 
                      className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 dark:bg-gray-900 dark:border-gray-700"
                    />
                    <label htmlFor="newsletter" className="text-sm text-gray-600 dark:text-gray-400 leading-snug">
                      I would like to receive occasional updates, design tips, and promotional material via email.
                    </label>
                  </div>

                  <div className="bg-gray-50/80 dark:bg-gray-950/50 p-4 rounded-2xl text-xs text-gray-500 dark:text-gray-400 mt-2 border border-gray-200/60 dark:border-gray-800/60 leading-relaxed transition-colors">
                    <strong className="text-gray-700 dark:text-gray-300">Data Collection Notice:</strong> By submitting this form, you consent to the storage of your preferred name, email address, and project details for the purpose of discussing your project. If you opt into the newsletter, your email will also be securely stored for marketing purposes. Your data will never be shared with third parties. Read our{" "}
                    <Link 
                      href="/privacy" 
                      onClick={onClose}
                      className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium underline inline-block transition-colors"
                    >
                      Privacy Policy
                    </Link>{" "}
                    for full details.
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold p-4 rounded-2xl transition-all disabled:opacity-70 mt-6 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-lg shadow-teal-500/20"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Request Quote <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}