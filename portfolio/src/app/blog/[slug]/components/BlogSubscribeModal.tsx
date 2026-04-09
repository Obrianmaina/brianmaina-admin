import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import BlogSubscribe from "@/components/BlogSubscribe";

interface BlogSubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BlogSubscribeModal({ isOpen, onClose }: BlogSubscribeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm transition-colors duration-300">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 rounded-[2rem] shadow-2xl overflow-hidden transition-colors duration-300"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-2">
              <BlogSubscribe />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}