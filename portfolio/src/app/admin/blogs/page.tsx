"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from "@/types";
import { Pencil, Trash2, Plus, ArrowLeft, Eye, EyeOff } from "lucide-react";
import AdminModal from "@/components/AdminModal";

export default function BlogsPage() {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [photoCredit, setPhotoCredit] = useState("");

  const [modal, setModal] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ show: false, type: 'success', title: '', message: '' });

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs", { cache: "no-store", credentials: 'same-origin' });
      if (res.ok) setBlogs(await res.json());
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    }
  };

  const showModal = (type: 'success' | 'error' | 'confirm', title: string, message: string, onConfirm?: () => void) => {
    setModal({ show: true, type, title, message, onConfirm });
  };

  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

  const getWordCount = (str: string) => str.trim() === "" ? 0 : str.trim().split(/\s+/).length;

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (getWordCount(value) <= 20 || value.length < description.length) {
      setDescription(value);
    }
  };

  const resetEditor = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setContent("");
    setFeaturedImage("");
    setPhotoCredit("");
  };

  const openEditorForNew = () => {
    resetEditor();
    setView('editor');
  };

  const openEditorForEdit = (blog: BlogPost) => {
    if (!blog._id) return;
    setEditingId(blog._id.toString());
    setTitle(blog.title);
    setDescription(blog.description || "");
    setContent(blog.content);
    setFeaturedImage(blog.featuredImage || "");
    setPhotoCredit(blog.photoCredit || "");
    setView('editor');
  };

  const handleSubmit = async (isPublished: boolean) => {
    if (!title.trim() || !content.trim() || !description.trim()) {
      showModal('error', 'Incomplete', "Title, Description, and Content are required.");
      return;
    }
    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId
        ? { id: editingId, title, description, content, featuredImage, photoCredit, isPublished }
        : { title, description, content, featuredImage, photoCredit, isPublished };

      const res = await fetch("/api/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        showModal('success', 'Success', `Article ${isPublished ? "published" : "saved as draft"}!`);
        resetEditor();
        setView('list');
        fetchBlogs();
      } else {
        showModal('error', 'Save Failed', data.error || "Could not save the article. Please check your connection.");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      showModal('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (blog: BlogPost) => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          id: blog._id,
          title: blog.title,
          description: blog.description,
          content: blog.content,
          featuredImage: blog.featuredImage,
          photoCredit: blog.photoCredit,
          isPublished: !blog.isPublished,
        }),
      });
      
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        showModal('success', 'Status Updated', `Article has been ${!blog.isPublished ? "published" : "moved to drafts"}.`);
        fetchBlogs();
      } else {
        showModal('error', 'Update Failed', data.error || "Failed to change publication status.");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred.";
      showModal('error', 'Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    showModal('confirm', 'Delete Article', 'Are you sure? This will permanently remove the article.', () => executeDelete(id));
  };

  const executeDelete = async (id: string) => {
    closeModal();
    try {
      const res = await fetch("/api/blogs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id }),
      });
      
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        fetchBlogs();
      } else {
        showModal('error', 'Delete Failed', data.error || "Could not delete from database.");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error while deleting.";
      showModal('error', 'Error', errorMessage);
    }
  };

  // Reusable UI classes for the editor
  const inputClasses = "w-full p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-gray-900 transition-all duration-200";
  const labelClasses = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1";
  const sectionClasses = "bg-white dark:bg-gray-800/60 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-6 transition-colors";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">

        {/* LIST VIEW */}
        {view === 'list' && (
          <div className="fade-in">
            <button onClick={() => router.push('/admin')} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors font-medium">
              <ArrowLeft size={20} className="mr-2" /> Back to Hub
            </button>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-l-4 border-teal-500 pb-2 px-4 gap-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 transition-colors">Blog Management</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                onClick={openEditorForNew}
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-500 dark:hover:border-teal-500 rounded-2xl flex flex-col items-center justify-center min-h-[300px] cursor-pointer transition-colors group"
              >
                <Plus size={32} className="text-gray-400 dark:text-gray-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 mb-4 transition-colors" />
                <p className="font-semibold text-gray-600 dark:text-gray-400 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">New Article</p>
              </div>

              {blogs.map((blog) => (
                <Card key={blog._id} className="overflow-hidden flex flex-col h-full hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-teal-900/10 transition-shadow relative">
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`mt-6 ml-6 px-3 py-1 rounded-full text-xs font-bold shadow-sm transition-colors ${blog.isPublished ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <div className="h-40 relative bg-gray-200 dark:bg-gray-800 shrink-0 rounded-xl overflow-hidden m-4 border border-gray-100 dark:border-gray-700 transition-colors">
                    {blog.featuredImage ? (
                      <Image src={blog.featuredImage} alt={blog.title} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 transition-colors">No Cover</div>
                    )}
                  </div>

                  <CardContent className="px-6 pb-6 pt-2 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1 transition-colors">{blog.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 transition-colors">{blog.description}</p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800 transition-colors">
                      <button onClick={() => openEditorForEdit(blog)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center text-sm font-medium transition-colors">
                        <Pencil size={16} className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleTogglePublish(blog)}
                        className={`${blog.isPublished ? 'text-amber-600 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-400' : 'text-green-600 dark:text-green-500 hover:text-green-800 dark:hover:text-green-400'} flex items-center text-sm font-medium transition-colors`}
                      >
                        {blog.isPublished ? <><EyeOff size={16} className="mr-1" /> Unpublish</> : <><Eye size={16} className="mr-1" /> Publish</>}
                      </button>
                      <button onClick={(e) => blog._id && confirmDelete(blog._id.toString(), e)} className="text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 flex items-center text-sm font-medium transition-colors">
                        <Trash2 size={16} className="mr-1" /> Delete
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* EDITOR VIEW */}
        {view === 'editor' && (
          <div className="max-w-4xl mx-auto fade-in transition-all duration-300">
            <button onClick={() => { resetEditor(); setView('list'); }} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors font-medium">
              <ArrowLeft size={20} className="mr-2" /> Back to Blogs
            </button>

            <div className="mb-8 px-2">
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 transition-colors tracking-tight">
                {editingId ? "Edit Article" : "Create New Article"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                {editingId ? "Update your content and refine your ideas." : "Draft a fresh story for your audience."}
              </p>
            </div>

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              
              {/* SECTION 1: Basic Information */}
              <div className={sectionClasses}>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-3 mb-2">
                  Post Details
                </h3>
                
                <div>
                  <label className={labelClasses}>Title</label>
                  <input 
                    type="text" 
                    required 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className={inputClasses} 
                    placeholder="Enter an engaging title..." 
                  />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <label className={`${labelClasses} mb-0`}>Short Description</label>
                    <span className={`text-xs font-semibold ${getWordCount(description) >= 20 ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'}`}>
                      {getWordCount(description)} / 20 words
                    </span>
                  </div>
                  <textarea 
                    required 
                    rows={3} 
                    value={description} 
                    onChange={handleDescriptionChange} 
                    className={`${inputClasses} resize-none`} 
                    placeholder="A brief, compelling summary of the article..." 
                  />
                </div>
              </div>

              {/* SECTION 2: Media */}
              <div className={sectionClasses}>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-3 mb-2">
                  Featured Media
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>Image URL</label>
                    <input 
                      type="url" 
                      value={featuredImage} 
                      onChange={(e) => setFeaturedImage(e.target.value)} 
                      className={inputClasses} 
                      placeholder="https://example.com/image.jpg" 
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Photo Credit <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <input 
                      type="text" 
                      value={photoCredit} 
                      onChange={(e) => setPhotoCredit(e.target.value)} 
                      className={inputClasses} 
                      placeholder="e.g. Jane Doe via Unsplash" 
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Content */}
              <div className={sectionClasses}>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-3 mb-2 flex justify-between items-center">
                  <span>Content Editor</span>
                  <span className="text-xs font-normal text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-md">
                    Markdown Supported
                  </span>
                </h3>
                
                <div>
                  <textarea 
                    required 
                    rows={18} 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    className={`${inputClasses} font-mono text-sm leading-relaxed resize-y`} 
                    placeholder="Start writing your amazing article here..." 
                  />
                </div>
              </div>

              {/* ACTIONS FOOTER */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={(e) => { e.preventDefault(); handleSubmit(false); }} 
                  disabled={loading} 
                  className="flex-1 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-lg font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save as Draft"}
                </button>
                <button 
                  type="button" 
                  onClick={(e) => { e.preventDefault(); handleSubmit(true); }} 
                  disabled={loading} 
                  className="flex-1 py-4 bg-teal-600 text-white text-lg font-bold rounded-xl hover:bg-teal-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-teal-500/25 dark:shadow-none disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? "Publishing..." : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}