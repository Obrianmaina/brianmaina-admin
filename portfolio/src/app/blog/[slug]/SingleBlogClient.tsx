"use client";

import React, { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogPost } from "@/types";

import BlogHeader from "./components/BlogHeader";
import BlogHero from "./components/BlogHero";
import BlogContent from "./components/BlogContent";
import BlogComments from "./components/BlogComments";
import BlogSubscribeModal from "./components/BlogSubscribeModal";
import BlogSubscribeToast from "./components/BlogSubscribeToast";
import BlogFooter from "./components/BlogFooter";
import { BlogComment } from "./components/BlogCommentItem";

interface SingleBlogClientProps {
  initialSlug: string;
  initialPost: BlogPost | null;
}

export default function SingleBlogClient({ initialSlug, initialPost }: SingleBlogClientProps) {
  // Initialize state with the server-fetched data so it loads instantly
  const [blog, setBlog] = useState<BlogPost | null>(initialPost);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(!initialPost);
  const [submitting, setSubmitting] = useState(false);

  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [hasDismissedToast, setHasDismissedToast] = useState(false);
  const articleEndRef = useRef<HTMLDivElement>(null);

  const getApiUrl = (path: string) => {
    if (typeof window !== "undefined") {
      if (window.location.protocol === "blob:" || window.location.origin === "null") {
        return `http://localhost:3000${path}`;
      }
      return path;
    }
    return `http://localhost:3000${path}`;
  };

  useEffect(() => {
    if (initialSlug) {
      fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify({ target: initialSlug, type: "page_view" }),
        headers: { "Content-Type": "application/json" },
      });
    }
  }, [initialSlug]);

  // We only need to fetch comments now, as the blog post data comes from the server
  useEffect(() => {
    async function fetchCommentsData() {
      if (!initialSlug) return;
      try {
        const commentsRes = await fetch(getApiUrl(`/api/comments?postSlug=${initialSlug}`));
        const commentsData = await commentsRes.json();
        if (Array.isArray(commentsData)) {
          setComments(commentsData);
        }
      } catch (err) {
        console.error("Error loading comments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCommentsData();
  }, [initialSlug]);

  useEffect(() => {
    if (loading || !blog) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasDismissedToast) {
          setShowToast(true);
        }
      },
      { threshold: 0.1 }
    );

    if (articleEndRef.current) {
      observer.observe(articleEndRef.current);
    }

    return () => observer.disconnect();
  }, [loading, blog, hasDismissedToast]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(getApiUrl("/api/comments"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postSlug: initialSlug, text: newComment }),
      });

      if (res.ok) {
        setNewComment("");
        const refreshRes = await fetch(getApiUrl(`/api/comments?postSlug=${initialSlug}`));
        const refreshedData = await refreshRes.json();
        setComments(refreshedData);
      }
    } catch (err) {
      console.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (!blog) return;
    const shareData = { title: blog.title, text: blog.description, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-300">
        <Loader2 className="animate-spin text-teal-600 dark:text-teal-400" size={32} />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-gray-950 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 transition-colors">Article Not Found</h2>
        <Link href="/blog" className="text-teal-600 dark:text-teal-400 font-medium flex items-center hover:text-teal-700 dark:hover:text-teal-300 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <BlogSubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
      />

      <BlogSubscribeToast
        show={showToast}
        isModalOpen={isSubscribeModalOpen}
        onSubscribeClick={() => {
          setShowToast(false);
          setIsSubscribeModalOpen(true);
        }}
        onDismiss={() => {
          setShowToast(false);
          setHasDismissedToast(true);
        }}
      />

      <main className="min-h-screen bg-white dark:bg-gray-950 pb-24 font-sans transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 pt-12">
          <BlogHeader
            onSubscribeClick={() => setIsSubscribeModalOpen(true)}
            onShare={handleShare}
          />

          <BlogHero blog={blog} />

          <BlogContent ref={articleEndRef} content={blog.content} />

          <BlogComments
            comments={comments}
            newComment={newComment}
            submitting={submitting}
            onCommentChange={setNewComment}
            onSubmit={handlePostComment}
          />
        </div>
      </main>

      <BlogFooter />
    </>
  );
}