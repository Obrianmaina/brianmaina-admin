import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MockupCarouselProps {
  mockups: string[];
  setExpandedMockup: (m: string) => void;
}

const MockupCarousel = ({ mockups, setExpandedMockup }: MockupCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    if (Math.abs(walk) > 10) setHasDragged(true);
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.5;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-6 relative group/carousel">
      <h4 className="text-2xl font-bold text-center text-gray-900">Logo in Action</h4>

      <button
        onClick={(e) => { e.stopPropagation(); scroll("left"); }}
        className="absolute left-0 top-1/2 -translate-y-1/2 sm:-ml-4 z-10 p-3 bg-white hover:bg-gray-100 text-gray-800 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden sm:flex items-center justify-center border border-gray-100"
        aria-label="Scroll left"
      >
        <ChevronLeft size={24} />
      </button>

      <div
        ref={carouselRef}
        className={`flex overflow-x-auto snap-x gap-6 pb-6 px-4 sm:px-0 transition-all ${isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-mandatory"}`}
        style={{ scrollbarWidth: "none" }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {mockups.map((mockup, mIdx) => (
          <div
            key={mIdx}
            className="flex-shrink-0 w-[85%] sm:w-[60%] lg:w-[45%] aspect-video relative snap-center rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-shadow"
            onClick={() => { if (!hasDragged) setExpandedMockup(mockup); }}
          >
            <Image
              src={mockup}
              alt={`Brand mockup ${mIdx + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
              unoptimized={true}
            />
          </div>
        ))}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); scroll("right"); }}
        className="absolute right-0 top-1/2 -translate-y-1/2 sm:-mr-4 z-10 p-3 bg-white hover:bg-gray-100 text-gray-800 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden sm:flex items-center justify-center border border-gray-100"
        aria-label="Scroll right"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default MockupCarousel;