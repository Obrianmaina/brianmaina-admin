import Link from "next/link";
import { ArrowLeft, Mail, Share2 } from "lucide-react";

interface BlogHeaderProps {
  onSubscribeClick: () => void;
  onShare: () => void;
}

export default function BlogHeader({ onSubscribeClick, onShare }: BlogHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
      <Link
        href="/blog"
        className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Articles
      </Link>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          onClick={onSubscribeClick}
          className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 px-5 py-2.5 rounded-xl transition-all border border-teal-100 dark:border-teal-800 shadow-sm font-medium"
        >
          <Mail size={18} />
          Subscribe
        </button>

        <button
          onClick={onShare}
          className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-gray-50 dark:bg-gray-900 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-gray-700 dark:text-gray-300 hover:text-teal-700 dark:hover:text-teal-400 px-5 py-2.5 rounded-xl transition-all border border-gray-100 dark:border-gray-800 shadow-sm font-medium"
        >
          <Share2 size={18} />
          Share
        </button>
      </div>
    </div>
  );
}