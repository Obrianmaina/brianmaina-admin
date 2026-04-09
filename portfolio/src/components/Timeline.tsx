import { TimelineSection } from "@/types";

const Timeline: React.FC<{ sections: TimelineSection[] }> = ({ sections }) => {
  return (
    <div className="space-y-10">
      {sections.map((section, sectionIdx) => {
        // Detect if this is a section that needs highlighting
        const isHighlighted = 
          section.heading.toLowerCase().includes("certifications") || 
          section.heading.toLowerCase().includes("volunteer") || 
          section.heading.toLowerCase().includes("courses");

        return (
          <div key={sectionIdx}>
            <h4 
              className={`mb-5 transition-colors ${
                isHighlighted 
                  ? "text-sm font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 inline-block px-4 py-1.5 rounded-lg border border-teal-100 dark:border-teal-900/50 uppercase tracking-wider" 
                  : "text-xl font-semibold text-gray-900 dark:text-gray-50"
              }`}
            >
              {section.heading}
            </h4>
            
            <div className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-800 transition-colors">
              {section.entries.map((entry, entryIdx) => (
                <div key={entryIdx} className="mb-8 last:mb-0">
                  {/* The dot border adapts to the page background (white in light mode, gray-950 in dark mode) */}
                  <div className="absolute -left-[11px] top-1 h-5 w-5 bg-teal-500 rounded-full border-4 border-white dark:border-gray-950 transition-colors"></div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">{entry.date}</p>
                  <h5 className="font-bold text-gray-900 dark:text-gray-100 mt-1 transition-colors">{entry.title}</h5>

                  {/* This block checks if the description is an array and renders a list, otherwise it renders a paragraph. */}
                  {Array.isArray(entry.description) ? (
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300 transition-colors">
                      {entry.description.map((point, pointIdx) => (
                        <li key={pointIdx}>{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed transition-colors">{entry.description}</p>
                  )}
                  
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;