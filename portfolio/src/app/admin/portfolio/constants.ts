import { FormState, Showcase } from "./types";

export const initialFormState: FormState = {
  title: "", category: "Graphics", description: "", tag: "", mediaType: "image", media: "", coverImage: "",
  isHidden: false,
  challenge: "", process: "", outcome: "",
  logoConcepts: [],
  csRole: "", csDuration: "", csToolsStr: "", csProblemText: "", csProblemImagesStr: "",
  csResearchText: "", csResearchImagesStr: "", csWireframesText: "", csWireframeImagesStr: "", csLearnings: ""
};

/** Map a saved Showcase back into flat FormState for editing */
export function showcaseToFormState(p: Showcase): FormState {
  const joinArr = (arr?: string[]) => arr?.join(", ") ?? "";
  const mediaStr = Array.isArray(p.media) ? p.media.join(", ") : (p.media ?? "");

  let mappedConcepts = p.logoConcepts?.map(c => ({
    title: c.title || "",
    description: c.description || "",
    primaryImage: c.primaryImage || "",
    colorsStr: joinArr(c.colors),
    fontsStr: joinArr(c.fonts),
    mockupsStr: joinArr(c.mockups),
  })) || [];

  if (mappedConcepts.length === 0 && p.brandDetails) {
    mappedConcepts = [{
      title: "Concept 1",
      description: "",
      primaryImage: "",
      colorsStr: joinArr(p.brandDetails.colors),
      fontsStr: "",
      mockupsStr: joinArr(p.brandDetails.mockups)
    }];
  }

  return {
    title: p.title ?? "",
    category: p.category ?? "Graphics",
    description: p.description ?? "",
    tag: p.tag ?? "",
    mediaType: p.mediaType ?? "image",
    media: mediaStr,
    coverImage: p.coverImage ?? "",
    isHidden: p.isHidden ?? false,
    challenge: p.challenge ?? "",
    process: p.process ?? "",
    outcome: p.outcome ?? "",
    logoConcepts: mappedConcepts,
    csRole: p.caseStudy?.role ?? "",
    csDuration: p.caseStudy?.duration ?? "",
    csToolsStr: joinArr(p.caseStudy?.tools),
    csProblemText: p.caseStudy?.problemStatement ?? "",
    csProblemImagesStr: joinArr(p.caseStudy?.problemImages),
    csResearchText: p.caseStudy?.userResearch ?? "",
    csResearchImagesStr: joinArr(p.caseStudy?.researchImages),
    csWireframesText: p.caseStudy?.wireframesText ?? "",
    csWireframeImagesStr: joinArr(p.caseStudy?.wireframesImages),
    csLearnings: p.caseStudy?.learnings ?? "",
  };
}

export function splitAndTrim(str: string | string[] | null | undefined): string[] {
  if (!str) return [];
  return String(str).split(",").map(s => s.trim()).filter(Boolean);
}