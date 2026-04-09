"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize, X } from "lucide-react";
import { Showcase } from "@/types";

export default function MediaDisplay({ project }: { project: Showcase }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Store the raw RGB values for each slide so we can use them differently 
  // in the normal view vs the fullscreen view
  const [slideColors, setSlideColors] = useState<Record<number, { r: number, g: number, b: number }>>({});
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset state when project changes
  useEffect(() => {
    setCurrentSlide(0);
    setSlideColors({});
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0 });
    }
  }, [project]);

  // Extract the color as soon as the small images load
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>, idx: number) => {
    if (slideColors[idx]) return; 
    
    const img = e.currentTarget;
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);

      const imgData = ctx.getImageData(0, 0, 50, 50).data;
      let r = 0, g = 0, b = 0;
      const pixelCount = imgData.length / 4;

      for (let i = 0; i < imgData.length; i += 4) {
        r += imgData[i];
        g += imgData[i + 1];
        b += imgData[i + 2];
      }

      setSlideColors((prev) => ({
        ...prev,
        [idx]: {
          r: Math.floor(r / pixelCount),
          g: Math.floor(g / pixelCount),
          b: Math.floor(b / pixelCount),
        },
      }));
    } catch (err) {
      console.error("Could not extract color. Using default.", err);
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const child = container.children[0] as HTMLElement;
    if (!child) return;

    const scrollPosition = container.scrollLeft;
    const itemWidth = child.offsetWidth;
    const slideIndex = Math.round(scrollPosition / itemWidth);
    setCurrentSlide(slideIndex);
  };

  const scrollToSlide = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const child = container.children[index] as HTMLElement;
    if (!child) return;

    container.scrollTo({
      left: child.offsetLeft - container.offsetLeft,
      behavior: 'smooth'
    });
  }, []);

  const handleNext = useCallback(() => {
    const media = Array.isArray(project.media) ? project.media : [project.media];
    const nextSlide = Math.min(media.length - 1, currentSlide + 1);
    scrollToSlide(nextSlide);
  }, [currentSlide, project.media, scrollToSlide]);

  const handlePrev = useCallback(() => {
    const prevSlide = Math.max(0, currentSlide - 1);
    scrollToSlide(prevSlide);
  }, [currentSlide, scrollToSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === "Escape") setIsFullscreen(false);
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
        return; 
      }
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, isFullscreen]);

  if (project.mediaType === "image" || project.mediaType === "presentation") {
    const media = Array.isArray(project.media) ? project.media : [project.media];
    const isSingle = media.length === 1;

    // Calculate dynamic backgrounds based on the CURRENT slide
    const currentRgb = slideColors[currentSlide];
    
    // Soft, light pastel version for the normal view (15% opacity over white)
    const normalBgColor = currentRgb 
      ? `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, 0.15)` 
      : '#f3f4f6'; // fallback to gray-100

    // Deep, rich dark version for the fullscreen view
    const fullscreenBgColor = currentRgb 
      ? `rgba(${Math.floor(currentRgb.r * 0.15)}, ${Math.floor(currentRgb.g * 0.15)}, ${Math.floor(currentRgb.b * 0.15)}, 0.98)` 
      : 'rgba(0, 0, 0, 0.95)';

    return (
      <>
        {/* Main Stage Container */}
        <div 
          className="relative group w-full flex flex-col rounded-2xl overflow-hidden h-full min-h-[40vh] transition-colors duration-700 ease-in-out"
          style={{ backgroundColor: normalBgColor }}
        >
          {isSingle ? (
            <div
              className="relative w-full h-full flex items-center justify-center cursor-zoom-in group/single flex-grow p-4 sm:p-0"
              onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
            >
              {/* Single Image Card for Mobile */}
              <div className="relative w-full sm:w-full h-full sm:h-full rounded-2xl sm:rounded-none overflow-hidden bg-white/30 sm:bg-transparent shadow-sm sm:shadow-none">
                <Image
                  src={media[0]}
                  alt={project.title}
                  fill
                  className="object-cover sm:object-contain p-0 sm:p-2"
                  priority
                  unoptimized={true}
                  crossOrigin="anonymous" 
                  onLoad={(e) => handleImageLoad(e, 0)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover/single:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
                  <div className="bg-black/60 p-3 rounded-full text-white opacity-0 group-hover/single:opacity-100 transition-all scale-95 group-hover/single:scale-100 shadow-lg">
                    <Maximize size={24} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex flex-col flex-grow overflow-hidden">
              <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
              
              {/* Scroll Container (Apple Style Spacing on Mobile) */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="hide-scrollbar flex w-full h-full overflow-x-auto snap-x snap-mandatory items-center pb-2 gap-4 px-6 sm:gap-0 sm:px-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {media.map((src, idx) => (
                  <div
                    key={idx}
                    // Apple Style Card: w-[80%] with rounded corners on mobile, full width on desktop
                    className="relative w-[80%] sm:w-full h-[100%] sm:h-full flex-shrink-0 snap-center flex items-center justify-center cursor-zoom-in group/item rounded-2xl sm:rounded-none overflow-hidden bg-white/40 sm:bg-transparent shadow-sm sm:shadow-none transition-transform"
                    onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
                  >
                    <Image
                      src={src as string}
                      alt={`${project.title} slide ${idx + 1}`}
                      fill
                      // Fills the mobile card (object-cover), behaves normally on desktop (object-contain)
                      className="object-cover sm:object-contain p-0 sm:p-2"
                      priority={idx === 0}
                      unoptimized={true}
                      crossOrigin="anonymous" 
                      onLoad={(e) => handleImageLoad(e, idx)}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
                      <div className="bg-black/60 p-3 rounded-full text-white opacity-0 group-hover/item:opacity-100 transition-all scale-95 group-hover/item:scale-100 shadow-lg hidden sm:flex">
                        <Maximize size={24} />
                      </div>
                    </div>
                  </div>
                ))}
                {/* Extra spacer block removed since padding covers the edges natively now */}
              </div>

              {/* Desktop Navigation Arrows */}
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                disabled={currentSlide === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-white opacity-0 sm:group-hover:opacity-100 transition-all disabled:opacity-0 disabled:pointer-events-none hidden sm:block"
                aria-label="Previous slide"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                disabled={currentSlide === media.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-white opacity-0 sm:group-hover:opacity-100 transition-all disabled:opacity-0 disabled:pointer-events-none hidden sm:block"
                aria-label="Next slide"
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium z-10">
                {currentSlide + 1} / {media.length}
              </div>

              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-2 hidden sm:flex z-10">
                {media.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); scrollToSlide(idx); }}
                    className={`relative w-16 h-12 rounded-md overflow-hidden transition-all ${
                      idx === currentSlide ? "ring-2 ring-teal-500 opacity-100 scale-110" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={src as string} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" unoptimized={true} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FULLSCREEN MODAL REMAINS EXACTLY THE SAME BELOW THIS */}

        {/* FULLSCREEN MODAL */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, backgroundColor: fullscreenBgColor }}
              exit={{ opacity: 0 }}
              style={{ backgroundColor: fullscreenBgColor }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-8 transition-colors duration-500"
              onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
            >
              <button
                className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[110]"
                onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
                aria-label="Close fullscreen"
              >
                <X size={24} />
              </button>
              
              <div className="relative w-full h-full max-w-7xl max-h-full">
                <Image
                  src={media[currentSlide]}
                  alt="Fullscreen view"
                  fill
                  className="object-contain"
                  unoptimized={true}
                />
              </div>

              {!isSingle && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    disabled={currentSlide === 0}
                    className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all disabled:opacity-0 disabled:pointer-events-none z-[110]"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    disabled={currentSlide === media.length - 1}
                    className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all disabled:opacity-0 disabled:pointer-events-none z-[110]"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Other media types (Video, Figma, Slides, PPT) remain exactly the same below...
  if (project.mediaType === "video") {
    return (
      <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden flex items-center justify-center">
        <video src={project.media as string} controls className="w-full h-auto max-h-full" controlsList="nodownload" onClick={(e) => e.stopPropagation()} />
      </div>
    );
  }

  if (project.mediaType === "figma") {
    return (
      <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center gap-4">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-gray-300 border-t-teal-500 rounded-full" />
              <p className="text-sm text-gray-600">Loading prototype...</p>
            </div>
          </div>
        )}
        <iframe style={{ width: "100%", height: "100%", opacity: isLoading ? 0 : 1, transition: "opacity 0.3s ease-in-out" }} src={project.media as string} allowFullScreen title={`${project.title} Figma prototype`} onLoad={() => setIsLoading(false)} />
      </div>
    );
  }

  if (project.mediaType === "googleslides") {
    return (
      <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center gap-4">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-gray-300 border-t-orange-500 rounded-full" />
              <p className="text-sm text-gray-600">Loading slides...</p>
            </div>
          </div>
        )}
        <iframe style={{ width: "100%", height: "100%", opacity: isLoading ? 0 : 1, transition: "opacity 0.3s ease-in-out", border: "none" }} src={project.media as string} allowFullScreen title={`${project.title} Google Slides presentation`} onLoad={() => setIsLoading(false)} />
      </div>
    );
  }

  if (project.mediaType === "powerpoint") {
    return (
      <div className="relative w-full h-full flex flex-col">
        <div className="bg-gray-100 rounded-2xl overflow-hidden flex-grow min-h-[500px]">
          <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(project.media as string)}`} width="100%" height="100%" frameBorder="0" title={`${project.title} PowerPoint presentation`} allowFullScreen />
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">View in fullscreen for the best experience and animations.</p>
      </div>
    );
  }

  return null;
}