'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Comment {
  _id: string;
  postSlug: string;
  text: string;
  animalIdentity: string;
  animalIcon: string;
  status?: string;
  adminReply?: string | null;
  createdAt: string;
}

export default function AdminCommentsPage() {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch('/api/admin/comments');
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, status: newStatus }),
      });
      if (res.ok) {
        setComments(comments.map(c => c._id === id ? { ...c, status: newStatus } : c));
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const submitReply = async (id: string) => {
    const text = replyText[id];
    if (!text || text.trim() === '') return;

    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, adminReply: text }),
      });
      if (res.ok) {
        setComments(comments.map(c => c._id === id ? { ...c, adminReply: text } : c));
        setReplyText({ ...replyText, [id]: '' }); // clear input
      }
    } catch (error) {
      console.error("Failed to submit reply", error);
    }
  };

  const deleteComment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment forever?")) return;
    
    try {
      const res = await fetch(`/api/admin/comments?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setComments(comments.filter(c => c._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500 dark:text-gray-400 transition-colors">Loading comments...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 md:mb-8">
          <button 
            onClick={() => router.push('/admin')} 
            className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md p-1 -ml-1"
          >
            <ArrowLeft size={20} className="mr-2" /> Back to Hub
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 transition-colors">Comment Moderation</h1>
        </div>
        
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 transition-colors">No comments found.</p>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <Card key={comment._id} className="p-4 md:p-6 shadow-sm border border-transparent dark:border-gray-800 transition-colors">
                <div className="flex flex-col md:flex-row md:justify-between items-start mb-4 gap-4">
                  <div className="w-full md:w-auto break-words">
                    <div className="flex flex-wrap items-center gap-2 mb-1 text-gray-900 dark:text-gray-100 transition-colors">
                      <span className="text-2xl">{comment.animalIcon}</span>
                      <span className="font-semibold">{comment.animalIdentity}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                        on post: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded break-all transition-colors">{comment.postSlug}</span>
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 dark:text-gray-500 mt-1 md:mt-0 transition-colors">
                      {new Date(comment.createdAt).toLocaleString()} 
                      <span className={`ml-0 md:ml-3 px-2 py-0.5 rounded text-xs font-bold inline-block mt-2 md:mt-0 transition-colors ${
                        comment.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                        comment.status === 'spam' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                      }`}>
                        {comment.status || 'legacy'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full md:w-auto mt-2 md:mt-0">
                    {comment.status !== 'approved' && (
                      <Button variant="outline" className="border-green-500 dark:border-green-500/50 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex-1 md:flex-none transition-colors" onClick={() => updateStatus(comment._id, 'approved')}>
                        Approve
                      </Button>
                    )}
                    {comment.status !== 'spam' && (
                      <Button variant="outline" className="border-red-500 dark:border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex-1 md:flex-none transition-colors" onClick={() => updateStatus(comment._id, 'spam')}>
                        Spam
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      className="border-red-600 dark:border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex-1 md:flex-none transition-colors" 
                      onClick={() => deleteComment(comment._id)}
                      >
                      Delete
                    </Button>
                  </div>
                </div>

                <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/50 border border-transparent dark:border-gray-800 p-3 rounded mb-4 break-words transition-colors">
                  {comment.text}
                </p>

                <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4 transition-colors">
                  {comment.adminReply ? (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-gray-100 dark:border-blue-900/50 p-3 rounded transition-colors">
                      <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1 transition-colors">Your Reply:</p>
                      <p className="text-gray-700 dark:text-gray-300 break-words transition-colors">{comment.adminReply}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="text" 
                        placeholder="Write a public reply..." 
                        className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full transition-colors"
                        value={replyText[comment._id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [comment._id]: e.target.value })}
                      />
                      <Button className="w-full sm:w-auto" onClick={() => submitReply(comment._id)}>
                        Reply
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}