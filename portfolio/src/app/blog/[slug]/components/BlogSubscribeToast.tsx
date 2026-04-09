import { motion, AnimatePresence } from "framer-motion";
import { Mail, X } from "lucide-react";

interface BlogSubscribeToastProps {
  show: boolean;
  isModalOpen: boolean;
  onSubscribeClick: () => void;
  onDismiss: () => void;
}

export default function BlogSubscribeToast({
  show,
  isModalOpen,
  onSubscribeClick,
  onDismiss,
}: BlogSubscribeToastProps) {
  return (
    <AnimatePresence>
      {show && !isModalOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, x: 50 }}
          className="fixed bottom-28 sm:bottom-6 right-4 sm:right-6 z-40 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl dark:shadow-xl rounded-2xl p-5 max-w-[320px] flex gap-4 items-start transition-colors duration-300"
        >
          <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center shrink-0 transition-colors">
            <Mail size={20} />
          </div>
          <div className="flex-1 pr-4">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1 text-sm transition-colors">Enjoying the read?</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 transition-colors">Get notified whenever a new article drops.</p>
            <button
              onClick={onSubscribeClick}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors w-full shadow-md shadow-teal-100 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Subscribe Now
            </button>
          </div>
          <button
            onClick={onDismiss}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}