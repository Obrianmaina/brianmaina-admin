import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { Showcase } from "@/types";
import MediaDisplay from "@/components/MediaDisplay";
import DynamicImageGallery from "@/components/portfolio/DynamicImageGallery";
import MockupCarousel from "@/components/portfolio/MockupCarousel";

interface LightboxModalProps {
  lightbox: Showcase | null;
  onClose: () => void;
  setExpandedMockup: (m: string) => void;
}

// --- UI/UX Case Study Layout ---
const UXCaseStudyLayout = ({ lightbox }: { lightbox: Showcase }) => (
  <div className="max-w-4xl mx-auto py-8 space-y-12">
    <div className="text-center space-y-4">
      <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 transition-colors">{lightbox.title}</h3>
      <p className="text-xl text-gray-600 dark:text-gray-400 transition-colors">{lightbox.description}</p>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-4 transition-colors">
        <span><strong className="text-gray-700 dark:text-gray-300">Role:</strong> {lightbox.caseStudy!.role}</span>
        <span><strong className="text-gray-700 dark:text-gray-300">Timeline:</strong> {lightbox.caseStudy!.duration}</span>
        <span><strong className="text-gray-700 dark:text-gray-300">Tools:</strong> {lightbox.caseStudy!.tools.join(", ")}</span>
      </div>
    </div>

    <div>
      <h4 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100 transition-colors">The Problem</h4>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors">{lightbox.caseStudy!.problemStatement}</p>
      <DynamicImageGallery images={lightbox.caseStudy!.problemImages} />
    </div>

    {lightbox.caseStudy!.userResearch && (
      <div>
        <h4 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100 transition-colors">Research & Discovery</h4>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 transition-colors">{lightbox.caseStudy!.userResearch}</p>
        <DynamicImageGallery images={lightbox.caseStudy!.researchImages} />
      </div>
    )}

    {lightbox.caseStudy!.wireframesText && (
      <div>
        <h4 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100 transition-colors">Wireframes & Flow</h4>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 transition-colors">{lightbox.caseStudy!.wireframesText}</p>
        <DynamicImageGallery images={lightbox.caseStudy!.wireframesImages} />
      </div>
    )}

    <div>
      <h4 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100 transition-colors">Final Prototype</h4>
      <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm transition-colors">
        <MediaDisplay project={lightbox} />
      </div>
    </div>

    {lightbox.caseStudy!.learnings && (
      <div className="bg-teal-50 dark:bg-teal-900/20 border border-transparent dark:border-teal-900/50 p-6 rounded-2xl transition-colors">
        <h4 className="text-2xl font-semibold text-teal-800 dark:text-teal-300 mb-3 transition-colors">Key Takeaways</h4>
        <p className="text-teal-900 dark:text-teal-100 leading-relaxed transition-colors">{lightbox.caseStudy!.learnings}</p>
      </div>
    )}
  </div>
);

// --- Logo / Brand Book Layout ---
const LogoLayout = ({ lightbox, setExpandedMockup }: { lightbox: Showcase; setExpandedMockup: (m: string) => void }) => {
  const concepts = lightbox.logoConcepts?.length
    ? lightbox.logoConcepts
    : lightbox.brandDetails
      ? [{ title: "Primary Concept", description: "", primaryImage: "", colors: lightbox.brandDetails.colors, fonts: [], mockups: lightbox.brandDetails.mockups }]
      : [];

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* Brand Header */}
      <div className="text-center space-y-6">
        <h3 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight transition-colors">{lightbox.title}</h3>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto transition-colors">{lightbox.description}</p>
        <div className="flex justify-center gap-3">
          <span className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest transition-colors shadow-sm">{lightbox.tag}</span>
        </div>
      </div>

      {/* Main Logo Showcase */}
      <div className="w-full bg-gray-50 dark:bg-gray-950 rounded-3xl p-4 sm:p-12 shadow-inner border border-gray-200 dark:border-gray-800 transition-colors">
        <div className="w-full aspect-square sm:aspect-video relative rounded-2xl overflow-hidden">
          <MediaDisplay project={lightbox} />
        </div>
      </div>

      {/* Brand Strategy Grid */}
      {(lightbox.challenge || lightbox.process || lightbox.outcome) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          {lightbox.challenge && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-colors">The Challenge</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base transition-colors">{lightbox.challenge}</p>
            </div>
          )}
          {lightbox.process && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-colors">The Process</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base transition-colors">{lightbox.process}</p>
            </div>
          )}
          {lightbox.outcome && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-colors">The Outcome</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base transition-colors">{lightbox.outcome}</p>
            </div>
          )}
        </div>
      )}

      {/* Concepts */}
      {concepts.map((concept, idx) => (
        <div key={idx} className={`space-y-12 sm:space-y-16 ${idx > 0 ? "pt-16 border-t border-gray-200 dark:border-gray-800" : ""} transition-colors`}>
          <div className="text-center space-y-4">
            <h4 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{concept.title || `Concept ${idx + 1}`}</h4>
            {concept.description && <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto transition-colors">{concept.description}</p>}
          </div>

          {concept.primaryImage && (
            <div className="w-full bg-gray-50 dark:bg-gray-950 rounded-3xl p-4 sm:p-12 shadow-inner border border-gray-200 dark:border-gray-800 transition-colors">
              <div className="w-full aspect-square sm:aspect-video relative rounded-2xl overflow-hidden flex items-center justify-center bg-white dark:bg-gray-900 shadow-sm transition-colors">
                <Image src={concept.primaryImage} alt={concept.title || "Concept logo"} fill className="object-contain p-8" unoptimized={true} />
              </div>
            </div>
          )}

          {((concept.colors && concept.colors.length > 0) || (concept.fonts && concept.fonts.length > 0)) && (
            <div className={`grid grid-cols-1 ${concept.colors?.length && concept.fonts?.length ? "md:grid-cols-2" : ""} gap-8`}>
              {concept.colors && concept.colors.length > 0 && (
                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center transition-colors">
                  <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 transition-colors">Brand Colors</h4>
                  <div className="flex flex-wrap justify-center gap-6">
                    {concept.colors.map((color, cIdx) => (
                      <div key={cIdx} className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-inner border border-gray-200 dark:border-gray-700 transition-colors" style={{ backgroundColor: color }} />
                        <span className="text-sm font-mono text-gray-600 dark:text-gray-400 uppercase transition-colors">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {concept.fonts && concept.fonts.length > 0 && (
                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center h-full transition-colors">
                  <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 transition-colors">Typography</h4>
                  <div className="flex flex-wrap justify-center gap-4">
                    {concept.fonts.map((font, fIdx) => (
                      <span key={fIdx} className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 px-6 py-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-inner transition-colors">
                        Aa {font}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {concept.mockups && concept.mockups.length > 0 && (
            <MockupCarousel mockups={concept.mockups} setExpandedMockup={setExpandedMockup} />
          )}
        </div>
      ))}
    </div>
  );
};

// --- Standard Layout ---
const StandardLayout = ({ lightbox }: { lightbox: Showcase }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 h-full">
    <div className="lg:col-span-8 flex flex-col min-h-[40vh] sm:min-h-[50vh]">
      <MediaDisplay project={lightbox} />
    </div>
    <div className="lg:col-span-4 flex flex-col space-y-6 sm:space-y-8 pb-8">
      <div>
        <h3 id="lightbox-title" className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-gray-50 transition-colors">{lightbox.title}</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {lightbox.category && (
            <span className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide transition-colors">{lightbox.category}</span>
          )}
          {lightbox.tag && lightbox.tag !== lightbox.category && (
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide transition-colors">{lightbox.tag}</span>
          )}
        </div>
      </div>
      <div className="space-y-6">
        {lightbox.challenge && (
          <div>
            <h4 className="text-teal-600 dark:text-teal-400 uppercase tracking-wider text-sm font-bold mb-2 transition-colors">Challenge</h4>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">{lightbox.challenge}</p>
          </div>
        )}
        {lightbox.process && (
          <div>
            <h4 className="text-teal-600 dark:text-teal-400 uppercase tracking-wider text-sm font-bold mb-2 transition-colors">Process</h4>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">{lightbox.process}</p>
          </div>
        )}
        {lightbox.outcome && (
          <div>
            <h4 className="text-teal-600 dark:text-teal-400 uppercase tracking-wider text-sm font-bold mb-2 transition-colors">Outcome</h4>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">{lightbox.outcome}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

// --- Main Lightbox Modal ---
const LightboxModal = ({ lightbox, onClose, setExpandedMockup }: LightboxModalProps) => {
  const isUXCaseStudy = lightbox?.category === "UI/UX" && lightbox?.caseStudy;
  const isLogo = lightbox?.category === "Logo" || lightbox?.title?.toLowerCase().includes("logo");

  return (
    <AnimatePresence>
      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 dark:bg-black/95 flex items-center justify-center z-[60] p-0 sm:p-8 transition-colors duration-300"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            className="bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 rounded-none sm:rounded-3xl p-5 sm:p-8 max-w-7xl w-full relative overflow-hidden flex flex-col h-[100dvh] sm:h-auto sm:max-h-[90vh] transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white transition-colors z-10"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <X size={24} />
            </button>

            <div className="h-full overflow-y-auto pr-2 mt-10 sm:mt-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
              {isUXCaseStudy ? (
                <UXCaseStudyLayout lightbox={lightbox} />
              ) : isLogo ? (
                <LogoLayout lightbox={lightbox} setExpandedMockup={setExpandedMockup} />
              ) : (
                <StandardLayout lightbox={lightbox} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LightboxModal;