import { motion } from "framer-motion";
import { Send } from "lucide-react";

export interface BlogComment {
  _id: string;
  postSlug: string;
  text: string;
  animalIdentity: string;
  animalIcon: string;
  createdAt: string;
  adminReply?: string | null;
}

interface BlogCommentItemProps {
  comment: BlogComment;
  idx: number;
}

export default function BlogCommentItem({ comment, idx }: BlogCommentItemProps) {
  return (
    <motion.div
      key={comment._id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="flex gap-4 group flex-col"
    >
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 flex items-center justify-center text-2xl shrink-0 shadow-sm transition-colors duration-300">
          {comment.animalIcon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-gray-900 dark:text-gray-100 transition-colors">
              Anonymous {comment.animalIdentity}
            </span>
            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 transition-colors">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="bg-gray-50/80 dark:bg-gray-800/50 p-5 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
            {comment.text}
          </div>

          {comment.adminReply && (
            <div className="mt-4 ml-4 sm:ml-8 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0 shadow-sm transition-colors">
                <Send size={14} className="rotate-45" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-teal-700 dark:text-teal-400 text-sm transition-colors">
                    Brian (Admin)
                  </span>
                </div>
                <div className="bg-teal-50/50 dark:bg-teal-900/20 p-4 rounded-2xl rounded-tl-none border border-teal-100 dark:border-teal-900/50 text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic transition-colors duration-300">
                  {comment.adminReply}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}