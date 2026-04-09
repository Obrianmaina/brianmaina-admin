import { AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import BlogCommentItem, { BlogComment } from "./BlogCommentItem";

interface BlogCommentsProps {
  comments: BlogComment[];
  newComment: string;
  submitting: boolean;
  onCommentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function BlogComments({
  comments,
  newComment,
  submitting,
  onCommentChange,
  onSubmit,
}: BlogCommentsProps) {
  return (
    <section className="border-t border-gray-100 dark:border-gray-800 pt-16 transition-colors duration-300">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center">
          <div className="bg-teal-50 dark:bg-teal-900/30 p-2 rounded-lg mr-4 transition-colors">
            <MessageSquare className="text-teal-600 dark:text-teal-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 transition-colors">
            Comments <span className="text-teal-600 dark:text-teal-400 font-normal ml-1">({comments.length})</span>
          </h2>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mb-12">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-1 border-2 border-gray-100 dark:border-gray-800 focus-within:border-teal-500 dark:focus-within:border-teal-500 transition-all shadow-sm dark:shadow-none">
          <textarea
            value={newComment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="What's on your mind? Thoughts are shared anonymously..."
            className="w-full bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 p-4 resize-none h-28 transition-colors"
            required
          />
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-950 rounded-xl m-1 transition-colors">
            <p className="text-[12px] uppercase tracking-wider text-gray-400 dark:text-gray-500 pl-2">
              Random Animal Identity Assigned on Post
            </p>
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center hover:bg-teal-700 transition-all disabled:opacity-50 shadow-lg shadow-teal-100 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-8">
        <AnimatePresence initial={false}>
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 dark:text-gray-500 italic transition-colors">No comments yet. Start the conversation!</p>
            </div>
          ) : (
            comments.map((comment, idx) => (
              <BlogCommentItem key={comment._id} comment={comment} idx={idx} />
            ))
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}