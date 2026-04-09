import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

interface ExpandedMockupModalProps {
  src: string | null;
  onClose: () => void;
}

const ExpandedMockupModal = ({ src, onClose }: ExpandedMockupModalProps) => (
  <AnimatePresence>
    {src && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
        onClick={onClose}
      >
        <button
          className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[110]"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Close fullscreen mockup"
        >
          <X size={24} />
        </button>
        <div className="relative w-full h-full max-w-7xl max-h-full">
          <Image src={src} alt="Fullscreen mockup" fill className="object-contain" unoptimized={true} />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ExpandedMockupModal;