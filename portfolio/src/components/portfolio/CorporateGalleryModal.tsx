import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Showcase } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import Button from "@/components/ui/button";

interface CorporateGalleryModalProps {
  projects: Showcase[] | null;
  onClose: () => void;
  onSelect: (project: Showcase) => void;
}

const CorporateGalleryModal = ({ projects, onClose, onSelect }: CorporateGalleryModalProps) => (
  <AnimatePresence>
    {projects && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 dark:bg-black/90 flex items-center justify-center z-[60] p-4 transition-colors duration-300"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-title"
          className="bg-white dark:bg-gray-950 border border-transparent dark:border-gray-800 rounded-2xl p-4 sm:p-6 max-w-4xl w-full relative overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 transition-colors duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <button
             className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>

          <h3 id="gallery-title" className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-50 transition-colors">Corporate Projects</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors">Please select a project to view its details.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card
                  className="shadow-lg rounded-2xl group relative overflow-hidden cursor-pointer h-full"
                  onClick={() => onSelect(project)}
                >
                  <CardContent>
                    <div className="h-40 flex items-center justify-center relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden transition-colors">
                      <ThumbnailPreview project={project} />
                      <span className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">{project.tag}</span>
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm mb-2 px-4 text-center">{project.description}</p>
                        <Button className="bg-teal-500 hover:bg-teal-600 border-none dark:text-white dark:hover:bg-teal-600">View Project</Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 transition-colors">{project.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Category: {project.category}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default CorporateGalleryModal;