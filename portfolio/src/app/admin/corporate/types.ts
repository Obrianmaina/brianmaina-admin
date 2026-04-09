export type Showcase = {
  _id?: string;
  title: string;
  category: string;
  description: string;
  tag: string;
  mediaType: string;
  media: string | string[];
  coverImage?: string;
  challenge?: string;
  process?: string;
  outcome?: string;
  brandDetails?: { colors?: string[]; mockups?: string[] };
  caseStudy?: {
    role?: string;
    duration?: string;
    tools?: string[];
    problemStatement?: string;
    problemImages?: string[];
    userResearch?: string;
    researchImages?: string[];
    wireframesText?: string;
    wireframesImages?: string[];
    learnings?: string;
  };
};

export type CompanyProject = {
  _id?: string;
  order?: number;
  companyName: string;
  companyLogo: string;
  disclaimer: string;
  projects: Showcase[];
};

export type FormMode = "closed" | "add_company" | "edit_company" | "add_project" | "edit_project";

export type ModalState = {
  show: boolean;
  type: "success" | "error" | "confirm";
  title: string;
  message: string;
  onConfirm?: () => void;
};

export type FormData = {
  companyName: string;
  companyLogo: string;
  disclaimer: string;
  title: string;
  category: string;
  description: string;
  tag: string;
  mediaType: string;
  media: string;
  coverImage: string;
  challenge: string;
  process: string;
  outcome: string;
  brandColorsStr: string;
  brandMockupsStr: string;
  csRole: string;
  csDuration: string;
  csToolsStr: string;
  csProblemText: string;
  csProblemImagesStr: string;
  csResearchText: string;
  csResearchImagesStr: string;
  csWireframesText: string;
  csWireframeImagesStr: string;
  csLearnings: string;
};