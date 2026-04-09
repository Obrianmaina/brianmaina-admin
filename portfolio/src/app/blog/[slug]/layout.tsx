import { Metadata } from 'next';
import { BlogPost } from '@/types'; 

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  try {
    // Set NEXT_PUBLIC_SITE_URL in your .env file (e.g., https://yourdomain.com)
    // Server components require absolute URLs for fetching from your own API
    const apiUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${apiUrl}/api/blogs?slug=${slug}`);
    
    if (!res.ok) throw new Error("Failed to fetch");
    
    const blogData = await res.json();
    const post: BlogPost = Array.isArray(blogData) 
      ? blogData.find((b: BlogPost) => b.slug === slug) 
      : blogData;

    if (!post) {
      return { title: 'Post Not Found' };
    }

    // 1. URL encode the title so it passes safely through the web
    const encodedTitle = encodeURIComponent(post.title);
    
    // 2. Point to your new dynamic image generator
    const dynamicOgImage = `${apiUrl}/api/og?title=${encodedTitle}`;

    return {
      title: `${post.title} | Brian Maina Blog`,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        url: `/blog/${slug}`,
        // 3. Next.js will now call your API to build the image on the fly
        images: [
          {
            url: dynamicOgImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
        images: [dynamicOgImage],
      },
    };
  } catch (error) {
    return {
      title: 'Blog Article | Brian Maina Nyawira',
    };
  }
}

export default function SingleBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}