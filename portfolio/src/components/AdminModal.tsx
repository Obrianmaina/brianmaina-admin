"use client";

import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminModalProps {
  modal: {
    show: boolean;
    type: "success" | "error" | "confirm";
    title: string;
    message: string;
    onConfirm?: () => void;
  };
  close: () => void;
}

export default function AdminModal({ modal, close }: AdminModalProps) {
  return (
    <AnimatePresence>
      {modal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={modal.type !== "confirm" ? close : undefined}
            className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm transition-colors duration-300"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl dark:shadow-none border border-transparent dark:border-gray-800 p-8 text-center overflow-hidden transition-colors duration-300"
          >
            <div className="mb-6 flex justify-center">
              {modal.type === "success" && (
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400 transition-colors">
                  <CheckCircle2 size={40} />
                </div>
              )}
              {modal.type === "error" && (
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full text-red-600 dark:text-red-400 transition-colors">
                  <AlertCircle size={40} />
                </div>
              )}
              {modal.type === "confirm" && (
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full text-amber-600 dark:text-amber-400 transition-colors">
                  <Info size={40} />
                </div>
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2 transition-colors">
              {modal.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 transition-colors">{modal.message}</p>

            <div className="flex gap-3 justify-center">
              {modal.type === "confirm" ? (
                <>
                  <button
                    onClick={close}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={modal.onConfirm}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={close}
                  className="px-8 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  OK
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}