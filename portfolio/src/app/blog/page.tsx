"use client";

import React, { useEffect, useState } from "react";
// Using standard img and a tags to resolve resolution errors in the preview environment
// while maintaining the Next.js project structure
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from "@/types";
import Button from "@/components/ui/button";
import { X, Info, ChevronLeft, ChevronRight } from "lucide-react"; 
import { SiLinkedin, SiGithub, SiX, SiInstagram, SiBehance } from "react-icons/si";

export default function BlogLandingPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs");
        if (!res.ok) {
           throw new Error("Failed to fetch blogs");
        }
        const data = await res.json();
        
        // Filter to only show articles where isPublished is true
        const publishedOnly = data.filter((blog: BlogPost) => blog.isPublished === true);
        
        setBlogs(publishedOnly);
      } catch (error) {
        console.error("Failed to load blogs", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-sans text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">Loading articles...</div>;
  }

  if (blogs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 relative font-sans transition-colors duration-300">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 transition-colors">No articles published yet</h2>
        <p className="text-gray-600 dark:text-gray-400 transition-colors">Check back soon for new content!</p>
      </div>
    );
  }

  const featuredBlog = blogs[0];
  const gridBlogs = blogs.slice(1, 13); // Up to 12 per page

  // Array of colors to cycle through for the card decorators
  const decoratorColors = [
    "bg-teal-500",
    "bg-blue-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-purple-500",
    "bg-indigo-500"
  ];

  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 transition-colors">Insights</h1>
        </div>
        {/* New Subtitle Line */}
        <p className="text-center text-gray-600 dark:text-gray-400 italic mb-8 -mt-6 transition-colors">
          Unapologetically random.
        </p>
        
       
        {/* Featured Blog */}
        {featuredBlog && (
          <a href={`/blog/${featuredBlog.slug}`} className="block">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              
              <Card className="relative overflow-hidden group hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-teal-900/10 transition-shadow cursor-pointer p-0 border border-transparent dark:border-gray-800 shadow-md">
                  
                {/* Corner decorator */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full opacity-10 bg-teal-500 pointer-events-none z-30"
                />
                  
                <div className="flex flex-col md:flex-row">
                  
                  <div className="md:w-2/3 h-64 md:h-72 relative bg-gray-200 dark:bg-gray-800 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden transition-colors">
                  
                    {featuredBlog.featuredImage ? (
                      <img 
                        src={featuredBlog.featuredImage} 
                        alt={featuredBlog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-20" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-400 relative z-20 transition-colors">No Image</div>
                    )}
                  </div>
                  
                  <div className="md:w-1/3 p-8 flex flex-col justify-center bg-white dark:bg-gray-900 relative z-20 transition-colors">
                    <span className="text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider text-xs mb-2 transition-colors">Featured Post</span>
                    <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-50 leading-tight group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{featuredBlog.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 leading-relaxed transition-colors">
                      {featuredBlog.description || (featuredBlog.content.substring(0, 150) + "...")}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-auto transition-colors">
                      <span>{new Date(featuredBlog.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>
                  </div>
                  
                </div>
              </Card>
            </motion.div>
          </a>
        )}

        {/* 3x4 Grid */}
        {gridBlogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridBlogs.map((blog, idx) => (
              <a key={blog.slug || idx} href={`/blog/${blog.slug}`} className="block h-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="h-full">
                  
                  <Card className="relative h-full overflow-hidden group hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-teal-900/10 transition-shadow cursor-pointer flex flex-col p-0 bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 shadow-sm">
                    
                    {/* Dynamic Corner decorator right here */}
                    <div className={`absolute bottom-0 right-0 w-24 h-24 -mr-12 -mb-12 rounded-full opacity-20 z-10 transition-transform duration-500 group-hover:scale-150 ${decoratorColors[idx % decoratorColors.length]}`} />
                    
                    <div className="h-48 relative rounded-t-lg bg-gray-200 dark:bg-gray-800 w-full shrink-0 overflow-hidden transition-colors">
                      {blog.featuredImage ? (
                        <img 
                          src={blog.featuredImage} 
                          alt={blog.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors">No Image</div>
                      )}
                    </div>
                    
                    <CardContent className="relative z-20 p-6 flex-grow flex flex-col justify-between h-full bg-white dark:bg-gray-900 transition-colors">
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors line-clamp-2 leading-snug">{blog.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed transition-colors">
                          {blog.description || (blog.content.substring(0, 120) + "...")}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-gray-800 transition-colors">
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium transition-colors">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                          Read More
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>

    
  </>
  );
}