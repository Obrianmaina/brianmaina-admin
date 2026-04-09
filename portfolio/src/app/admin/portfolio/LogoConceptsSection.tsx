import { X } from "lucide-react";
import { FormState, LogoConceptForm } from "./types";

type Props = {
  logoConcepts: LogoConceptForm[];
  onChange: (updated: LogoConceptForm[]) => void;
};

export default function LogoConceptsSection({ logoConcepts, onChange }: Props) {
  const addConcept = () =>
    onChange([...logoConcepts, { title: "", description: "", primaryImage: "", colorsStr: "", fontsStr: "", mockupsStr: "" }]);

  const removeConcept = (index: number) => {
    const next = [...logoConcepts];
    next.splice(index, 1);
    onChange(next);
  };

  const updateConcept = (index: number, field: keyof LogoConceptForm, value: string) => {
    const next = [...logoConcepts];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const inputClasses = "p-3 border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-colors";

  return (
    <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/50 space-y-4 mt-4 fade-in transition-colors">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-emerald-800 dark:text-emerald-400 transition-colors">Logo Concepts</h4>
        <button
          type="button"
          onClick={addConcept}
          className="bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-lg text-sm font-bold hover:bg-emerald-300 dark:hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          + Add Concept
        </button>
      </div>

      {logoConcepts.length === 0 && (
        <p className="text-sm text-emerald-700 dark:text-emerald-500 italic transition-colors">No concepts added yet. Click &quot;Add Concept&quot; to start.</p>
      )}

      {logoConcepts.map((concept, index) => (
        <div key={index} className="p-4 bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800/50 rounded-lg relative space-y-3 transition-colors">
          <button
            type="button"
            onClick={() => removeConcept(index)}
            className="absolute top-2 right-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <X size={16} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder={`Concept ${index + 1} Title`}
              className={inputClasses}
              value={concept.title}
              onChange={e => updateConcept(index, "title", e.target.value)}
            />
            <input
              type="text"
              placeholder="Colors (e.g. #000, #FFF)"
              className={inputClasses}
              value={concept.colorsStr}
              onChange={e => updateConcept(index, "colorsStr", e.target.value)}
            />
            <input
              type="text"
              placeholder="Fonts (e.g. Inter, Roboto)"
              className={inputClasses}
              value={concept.fontsStr}
              onChange={e => updateConcept(index, "fontsStr", e.target.value)}
            />
          </div>

          <input
            type="text"
            placeholder="Primary Concept Image URL (Main Media Image)"
            className={`w-full ${inputClasses}`}
            value={concept.primaryImage}
            onChange={e => updateConcept(index, "primaryImage", e.target.value)}
          />

          <textarea
            placeholder="Concept Description (Optional)"
            className={`w-full ${inputClasses} resize-y`}
            value={concept.description}
            onChange={e => updateConcept(index, "description", e.target.value)}
          />
          <textarea
            placeholder="Mockup Image URLs (comma separated)"
            className={`w-full ${inputClasses} resize-y`}
            value={concept.mockupsStr}
            onChange={e => updateConcept(index, "mockupsStr", e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}