import { BlogPost } from "@/types";

interface BlogHeroProps {
  blog: BlogPost;
}

export default function BlogHero({ blog }: BlogHeroProps) {
  return (
    <>
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-50 mb-6 leading-tight transition-colors duration-300">
          {blog.title}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 italic border-l-4 border-teal-500 pl-4 py-1 transition-colors duration-300">
          {blog.description}
        </p>
      </header>

      {blog.featuredImage && (
        <figure className="mb-12">
          <div className="w-full h-64 md:h-[480px] relative rounded-[1rem] overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
          {blog.photoCredit && (
            <figcaption className="text-sm text-gray-400 dark:text-gray-500 mt-4 text-center transition-colors duration-300">
              Photo Credit: <span className="italic">{blog.photoCredit}</span>
            </figcaption>
          )}
        </figure>
      )}
    </>
  );
}