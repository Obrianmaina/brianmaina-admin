import Image from 'next/image';
import { Showcase } from "@/types";

const ThumbnailPreview: React.FC<{ project: Showcase }> = ({ project }) => {
  if (project.coverImage) {
    return <Image 
      src={project.coverImage} 
      alt={project.title} 
      fill 
      className="object-cover" 
      sizes="(max-width: 768px) 100vw, 33vw" 
      unoptimized={true} // <-- Fix added here
    />;
  }

  if (project.mediaType === "image" || project.mediaType === "presentation") {
    const media = Array.isArray(project.media) ? project.media[0] : project.media;
    return <Image 
      src={media as string} 
      alt={project.title} 
      fill 
      className="object-cover" 
      sizes="(max-width: 768px) 100vw, 33vw" 
      unoptimized={true} // <-- Fix added here
    />;
  }

  if (project.mediaType === "video") {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-white text-4xl">▶</div>
      </div>
    );
  }

  if (project.mediaType === "figma") {
    return (
      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
        <span className="text-white font-bold">Figma</span>
      </div>
    );
  }

  if (project.mediaType === "powerpoint" || project.mediaType === "googleslides") {
    return (
      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
        <span className="text-white font-bold">Slides</span>
      </div>
    );
  }

  return null;
};

export default ThumbnailPreview;
