import { FormState } from "./types";

type Props = {
  formData: FormState;
  onChange: (updated: Partial<FormState>) => void;
};

export default function CaseStudySection({ formData, onChange }: Props) {
  const f = (field: keyof FormState) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
    onChange({ [field]: e.target.value });

  const inputClasses = "p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-colors";

  return (
    <div className="bg-blue-50/50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-900/50 space-y-4 mt-4 fade-in transition-colors">
      <h4 className="font-bold text-blue-800 dark:text-blue-400 transition-colors">UI/UX Case Study Builder</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" placeholder="Role (e.g. Lead Designer)" className={inputClasses} value={formData.csRole} onChange={f("csRole")} />
        <input type="text" placeholder="Duration (e.g. 4 Weeks)" className={inputClasses} value={formData.csDuration} onChange={f("csDuration")} />
        <input type="text" placeholder="Tools (e.g. Figma, Miro)" className={inputClasses} value={formData.csToolsStr} onChange={f("csToolsStr")} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea placeholder="Problem Statement" className={`${inputClasses} resize-y`} value={formData.csProblemText} onChange={f("csProblemText")} />
        <textarea placeholder="Problem Images (URLs, comma separated)" className={`${inputClasses} resize-y`} value={formData.csProblemImagesStr} onChange={f("csProblemImagesStr")} />

        <textarea placeholder="User Research Text" className={`${inputClasses} resize-y`} value={formData.csResearchText} onChange={f("csResearchText")} />
        <textarea placeholder="Research Images (URLs, comma separated)" className={`${inputClasses} resize-y`} value={formData.csResearchImagesStr} onChange={f("csResearchImagesStr")} />

        <textarea placeholder="Wireframes Text" className={`${inputClasses} resize-y`} value={formData.csWireframesText} onChange={f("csWireframesText")} />
        <textarea placeholder="Wireframe Images (URLs, comma separated)" className={`${inputClasses} resize-y`} value={formData.csWireframeImagesStr} onChange={f("csWireframeImagesStr")} />
      </div>

      <textarea placeholder="Key Takeaways / Learnings" className={`w-full ${inputClasses} resize-y`} value={formData.csLearnings} onChange={f("csLearnings")} />
    </div>
  );
}