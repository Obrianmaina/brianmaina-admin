import { FormState } from "./types";
import LogoConceptsSection from "./LogoConceptsSection";
import CaseStudySection from "./CaseStudySection";

type Props = {
  formData: FormState;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (updated: Partial<FormState>) => void;
};

export default function ProjectForm({ formData, isEditing, onSubmit, onChange }: Props) {
  const f = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) =>
      onChange({ [field]: e.target.value });

  const inputClasses = "w-full p-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-gray-900 transition-all duration-200";
  
  const labelClasses = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1";
  const sectionClasses = "bg-white dark:bg-gray-800/60 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-5 transition-colors";

  return (
    <div className={`p-6 md:p-8 rounded-3xl border mb-8 fade-in transition-colors duration-300 ${isEditing ? "bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30" : "bg-gray-50/80 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800"}`}>
      
      <div className="mb-8">
        <h3 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mb-3 transition-colors">
          {isEditing ? `Editing Project: ${formData.title || "Untitled"}` : "Create New Project"}
        </h3>
        {isEditing && (
          <div className="inline-block bg-amber-100 dark:bg-amber-900/30 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-800/50">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-400 transition-colors">
              You are editing an existing project. Changes will overwrite the saved data.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-6">

        <div className={sectionClasses}>
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-3 mb-2">
            Basic Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>Project Title</label>
              <input required type="text" placeholder="e.g. Acme Corp Rebrand" className={inputClasses} value={formData.title} onChange={f("title")} />
            </div>
            <div>
              <label className={labelClasses}>Tag</label>
              <input required type="text" placeholder="e.g. Branding" className={inputClasses} value={formData.tag} onChange={f("tag")} />
            </div>

            <div>
              <label className={labelClasses}>Category</label>
              <select className={inputClasses} value={formData.category} onChange={f("category")}>
                <option value="Graphics">Graphics</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Branding">Branding</option>
                <option value="Logo">Logo</option>
                <option value="Video">Video</option>
                <option value="Publication">Publication</option>
                <option value="Presentation">Presentation</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>Media Type</label>
              <select className={inputClasses} value={formData.mediaType} onChange={f("mediaType")}>
                <option value="image">Image(s)</option>
                <option value="video">Video URL</option>
                <option value="figma">Figma Embed</option>
                <option value="googleslides">Google Slides Embed</option>
                <option value="presentation">Presentation Images</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className={labelClasses}>Short Description</label>
            <textarea required placeholder="Briefly describe the purpose and scope of the project..." className={`${inputClasses} h-24 resize-y`} value={formData.description} onChange={f("description")} />
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-3">
            <input 
              type="checkbox" 
              id="isHidden" 
              className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700" 
              checked={formData.isHidden} 
              onChange={(e) => onChange({ isHidden: e.target.checked })} 
            />
            <label htmlFor="isHidden" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
              Hide project from public portfolio
            </label>
          </div>
        </div>

        <div className={sectionClasses}>
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-3 mb-2">
            Media & Links
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>Media URLs / Embed Link</label>
              <textarea required placeholder="If multiple images, separate with commas" className={`${inputClasses} h-28 resize-y`} value={formData.media} onChange={f("media")} />
            </div>
            <div>
              <label className={labelClasses}>Cover Image URL <span className="text-gray-400 font-normal">(Optional)</span></label>
              <textarea placeholder="Best for Figma/Video thumbnails" className={`${inputClasses} h-28 resize-y`} value={formData.coverImage} onChange={f("coverImage")} />
            </div>
          </div>
        </div>

        <div className={sectionClasses}>
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-3 mb-2">
            Project Context <span className="text-sm font-normal text-gray-400">(Optional)</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClasses}>The Challenge</label>
              <textarea placeholder="What was the core problem?" className={`${inputClasses} h-32 text-sm resize-y`} value={formData.challenge} onChange={f("challenge")} />
            </div>
            <div>
              <label className={labelClasses}>The Process</label>
              <textarea placeholder="How did you approach solving it?" className={`${inputClasses} h-32 text-sm resize-y`} value={formData.process} onChange={f("process")} />
            </div>
            <div>
              <label className={labelClasses}>The Outcome</label>
              <textarea placeholder="What were the final results?" className={`${inputClasses} h-32 text-sm resize-y`} value={formData.outcome} onChange={f("outcome")} />
            </div>
          </div>
        </div>

        {formData.category === "Logo" && (
          <div className="bg-emerald-50/60 dark:bg-emerald-900/10 p-4 md:p-6 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 shadow-inner">
            <LogoConceptsSection
              logoConcepts={formData.logoConcepts}
              onChange={(updated) => onChange({ logoConcepts: updated })}
            />
          </div>
        )}

        {formData.category === "UI/UX" && (
          <div className="bg-blue-50/60 dark:bg-blue-900/10 p-4 md:p-6 rounded-2xl border border-blue-200/60 dark:border-blue-800/40 shadow-inner">
            <CaseStudySection formData={formData} onChange={onChange} />
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            className={`w-full text-white text-lg font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${isEditing ? "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500 shadow-amber-500/25" : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 shadow-emerald-500/25"}`}
          >
            {isEditing ? "Save Changes" : "Publish Project"}
          </button>
        </div>
      </form>
    </div>
  );
}