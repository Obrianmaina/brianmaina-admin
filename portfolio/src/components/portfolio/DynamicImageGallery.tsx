import Image from "next/image";

const DynamicImageGallery = ({ images }: { images?: string[] }) => {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="mt-6 w-full rounded-2xl overflow-hidden shadow-sm bg-gray-100">
        <Image src={images[0]} alt="Case Study Media" width={1200} height={800} className="w-full h-auto object-cover" unoptimized={true} />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((img, i) => (
          <div key={i} className="rounded-2xl overflow-hidden shadow-sm bg-gray-100 aspect-video">
            <Image src={img} alt={`Case Study Media ${i + 1}`} width={600} height={400} className="w-full h-full object-cover" unoptimized={true} />
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div key={i} className="rounded-2xl overflow-hidden shadow-sm bg-gray-100 aspect-video sm:aspect-square md:aspect-video">
            <Image src={img} alt={`Case Study Media ${i + 1}`} width={400} height={300} className="w-full h-full object-cover" unoptimized={true} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4" style={{ scrollbarWidth: "none" }}>
      {images.map((img, i) => (
        <div key={i} className="flex-shrink-0 w-[85%] sm:w-[60%] md:w-[45%] snap-center rounded-2xl overflow-hidden shadow-sm bg-gray-100 aspect-video">
          <Image src={img} alt={`Case Study Media ${i + 1}`} width={600} height={400} className="w-full h-full object-cover" unoptimized={true} />
        </div>
      ))}
    </div>
  );
};

export default DynamicImageGallery;