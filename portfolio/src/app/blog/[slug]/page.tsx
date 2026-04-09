import { Metadata } from "next";
import SingleBlogClient from "./SingleBlogClient";
import { BlogPost } from "@/types"; 

// Define your base URL for absolute paths required by Open Graph
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brianmaina.de"; 

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${SITE_URL}/api/blogs?slug=${slug}`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    if (!res.ok) return null;
    const data = await res.json();
    
    return Array.isArray(data) ? data.find((b: BlogPost) => b.slug === slug) : data;
  } catch (error) {
    console.error("Error fetching post for metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  // Use the actual blog featured image instead of the generated text image
  // This logic ensures the URL is absolute, which social scrapers require
  const imageUrl = post.featuredImage.startsWith('http') 
    ? post.featuredImage 
    : `${SITE_URL}${post.featuredImage.startsWith('/') ? '' : '/'}${post.featuredImage}`;

  return {
    title: `${post.title} | Brian Maina Nyawira`,
    description: post.description,
    openGraph: {
      title: post.title, 
      description: post.description, 
      url: `${SITE_URL}/blog/${resolvedParams.slug}`,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image", // This specific value forces the large, YouTube style hero image
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);

  return <SingleBlogClient initialSlug={resolvedParams.slug} initialPost={post} />;
}