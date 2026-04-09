export type Showcase = {
  _id?: string;
  order?: number;
  title: string;
  category: string;
  description: string;
  tag: string;
  mediaType: string;
  media: string | string[];
  coverImage?: string;
  isHidden?: boolean;
  challenge?: string;
  process?: string;
  outcome?: string;
  brandDetails?: {
    colors?: string[];
    mockups?: string[];
  };
  logoConcepts?: {
    title: string;
    description?: string;
    primaryImage?: string;
    colors?: string[];
    fonts?: string[];
    mockups?: string[];
  }[];
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

export type LogoConceptForm = {
  title: string;
  description: string;
  primaryImage: string;
  colorsStr: string;
  fontsStr: string;
  mockupsStr: string;
};

export type FormState = {
  title: string; category: string; description: string; tag: string;
  mediaType: string; media: string; coverImage: string;
  isHidden: boolean;
  challenge: string; process: string; outcome: string;
  logoConcepts: LogoConceptForm[];
  csRole: string; csDuration: string; csToolsStr: string;
  csProblemText: string; csProblemImagesStr: string;
  csResearchText: string; csResearchImagesStr: string;
  csWireframesText: string; csWireframeImagesStr: string;
  csLearnings: string;
};

export type ModalState = {
  show: boolean;
  type: "success" | "error" | "confirm";
  title: string;
  message: string;
  onConfirm?: () => void;
};