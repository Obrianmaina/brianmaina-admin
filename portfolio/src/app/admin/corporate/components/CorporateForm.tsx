import { FormData, FormMode } from "../types";

type Props = {
  formMode: FormMode;
  formData: FormData;
  setFormData: (data: FormData) => void;
  showCompanyFields: boolean;
  showProjectFields: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CorporateForm({
  formMode,
  formData,
  setFormData,
  showCompanyFields,
  showProjectFields,
  onSubmit,
}: Props) {
  const update = (patch: Partial<FormData>) => setFormData({ ...formData, ...patch });

  const formTitle = {
    add_company: "New Corporate Profile",
    edit_company: "Edit Corporate Profile",
    add_project: "Add Project to Company",
    edit_project: "Edit Project",
    closed: "",
  }[formMode];

  // Enhanced reusable UI classes
  const inputClasses = "w-full p-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-gray-900 transition-all duration-200";
  const labelClasses = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1";
  const sectionClasses = "bg-white dark:bg-gray-800/60 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-6 transition-colors";

  return (
    <div className="bg-gray-50/80 dark:bg-gray-900/50 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 mb-8 fade-in transition-colors duration-300">
      
      <div className="mb-8">
        <h3 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 transition-colors">
          {formTitle}
        </h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        
        {/* === Company Details === */}
        {showCompanyFields && (
          <div className="bg-violet-50/60 dark:bg-violet-900/10 p-6 sm:p-8 rounded-3xl border border-violet-100 dark:border-violet-900/30 shadow-inner space-y-6 transition-colors">
            <h4 className="text-xl font-bold text-violet-900 dark:text-violet-300 border-b border-violet-200 dark:border-violet-800/50 pb-3 mb-2 transition-colors">
              Company Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Company Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Acme Corporation"
                  className={inputClasses}
                  value={formData.companyName}
                  onChange={(e) => update({ companyName: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClasses}>Company Logo URL</label>
                <input
                  required
                  type="text"
                  placeholder="https://..."
                  className={inputClasses}
                  value={formData.companyLogo}
                  onChange={(e) => update({ companyLogo: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Disclaimer</label>
              <textarea
                required
                placeholder="Legal or standard disclaimer for this company's work..."
                className={`${inputClasses} h-24 text-sm resize-y`}
                value={formData.disclaimer}
                onChange={(e) => update({ disclaimer: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* === Project Details === */}
        {showProjectFields && (
          <div className={sectionClasses}>
            <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-3 mb-2 transition-colors">
              Project Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Project Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Annual Report 2023"
                  className={inputClasses}
                  value={formData.title}
                  onChange={(e) => update({ title: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClasses}>Tag</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Corporate Work"
                  className={inputClasses}
                  value={formData.tag}
                  onChange={(e) => update({ tag: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClasses}>Category</label>
                <select
                  className={inputClasses}
                  value={formData.category}
                  onChange={(e) => update({ category: e.target.value })}
                >
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
                <select
                  className={inputClasses}
                  value={formData.mediaType}
                  onChange={(e) => update({ mediaType: e.target.value })}
                >
                  <option value="image">Image(s)</option>
                  <option value="video">Video URL</option>
                  <option value="figma">Figma Embed</option>
                  <option value="googleslides">Google Slides Embed</option>
                  <option value="presentation">Presentation Images</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClasses}>Short Description</label>
              <textarea
                required
                placeholder="Briefly describe this project..."
                className={`${inputClasses} h-24 resize-y`}
                value={formData.description}
                onChange={(e) => update({ description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Media URLs / Embed Link</label>
                <textarea
                  required
                  placeholder="If multiple images, separate with commas"
                  className={`${inputClasses} h-28 resize-y`}
                  value={formData.media}
                  onChange={(e) => update({ media: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClasses}>Cover Image URL <span className="text-gray-400 font-normal">(Optional)</span></label>
                <textarea
                  placeholder="Best for Figma/Video thumbnails"
                  className={`${inputClasses} h-28 resize-y`}
                  value={formData.coverImage}
                  onChange={(e) => update({ coverImage: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div>
                <label className={labelClasses}>Challenge <span className="text-gray-400 font-normal">(Optional)</span></label>
                <textarea
                  placeholder="What was the problem?"
                  className={`${inputClasses} h-32 text-sm resize-y`}
                  value={formData.challenge}
                  onChange={(e) => update({ challenge: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClasses}>Process <span className="text-gray-400 font-normal">(Optional)</span></label>
                <textarea
                  placeholder="How did you solve it?"
                  className={`${inputClasses} h-32 text-sm resize-y`}
                  value={formData.process}
                  onChange={(e) => update({ process: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClasses}>Outcome <span className="text-gray-400 font-normal">(Optional)</span></label>
                <textarea
                  placeholder="What was the result?"
                  className={`${inputClasses} h-32 text-sm resize-y`}
                  value={formData.outcome}
                  onChange={(e) => update({ outcome: e.target.value })}
                />
              </div>
            </div>

            {/* Logo Fields */}
            {formData.category === "Logo" && (
              <div className="bg-emerald-50/60 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 mt-6 fade-in transition-colors">
                <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 mb-4 transition-colors">Logo Presentation Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>Brand Hex Colors</label>
                    <input
                      type="text"
                      placeholder="e.g. #000000, #FFFFFF"
                      className={inputClasses}
                      value={formData.brandColorsStr}
                      onChange={(e) => update({ brandColorsStr: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Mockup Image URLs</label>
                    <textarea
                      placeholder="Comma separated URLs"
                      className={`${inputClasses} resize-y`}
                      value={formData.brandMockupsStr}
                      onChange={(e) => update({ brandMockupsStr: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UI/UX Case Study Fields */}
            {formData.category === "UI/UX" && (
              <div className="bg-blue-50/60 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-200/60 dark:border-blue-800/40 mt-6 fade-in transition-colors space-y-6">
                <h4 className="text-lg font-bold text-blue-800 dark:text-blue-400 transition-colors">UI/UX Case Study Builder</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={labelClasses}>Role</label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Designer"
                      className={`${inputClasses} text-sm`}
                      value={formData.csRole}
                      onChange={(e) => update({ csRole: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 4 Weeks"
                      className={`${inputClasses} text-sm`}
                      value={formData.csDuration}
                      onChange={(e) => update({ csDuration: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Tools</label>
                    <input
                      type="text"
                      placeholder="e.g. Figma, Miro"
                      className={`${inputClasses} text-sm`}
                      value={formData.csToolsStr}
                      onChange={(e) => update({ csToolsStr: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>Problem Statement</label>
                    <textarea
                      placeholder="Describe the core problem..."
                      className={`${inputClasses} text-sm h-24 resize-y`}
                      value={formData.csProblemText}
                      onChange={(e) => update({ csProblemText: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Problem Images</label>
                    <textarea
                      placeholder="URLs, comma separated"
                      className={`${inputClasses} text-sm h-24 resize-y`}
                      value={formData.csProblemImagesStr}
                      onChange={(e) => update({ csProblemImagesStr: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>User Research Text</label>
                    <textarea
                      placeholder="Research methodologies and findings..."
                      className={`${inputClasses} text-sm h-24 resize-y`}
                      value={formData.csResearchText}
                      onChange={(e) => update({ csResearchText: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Research Images</label>
                    <textarea
                      placeholder="URLs, comma separated"
                      className={`${inputClasses} text-sm h-24 resize-y`}
                      value={formData.csResearchImagesStr}
                      onChange={(e) => update({ csResearchImagesStr: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Wireframes Text</label>
                    <textarea
                      placeholder="Describe the wireframing process..."
                      className={`${inputClasses} text-sm h-24 resize-y`}
                      value={formData.csWireframesText}
                      onChange={(e) => update({ csWireframesText: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Wireframe Images</label>
                    <textarea
                      placeholder="URLs, comma separated"
                      className={`${inputClasses} text-sm h-24 resize-y`}
                      value={formData.csWireframeImagesStr}
                      onChange={(e) => update({ csWireframeImagesStr: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Key Takeaways / Learnings</label>
                  <textarea
                    placeholder="What did you learn from this project?"
                    className={`${inputClasses} text-sm h-24 resize-y`}
                    value={formData.csLearnings}
                    onChange={(e) => update({ csLearnings: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-violet-600 text-white text-lg font-bold py-4 rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}