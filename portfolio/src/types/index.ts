import { ButtonHTMLAttributes } from "react";

export interface TimelineEntry {
  title: string;
  date: string;
  description: string | string[];
}

export interface TimelineSection {
  heading: string;
  entries: TimelineEntry[];
}

export interface CaseStudyDetails {
  role: string;
  duration: string;
  tools: string[];
  problemStatement: string;
  problemImages?: string[];
  userResearch?: string;
  researchImages?: string[];
  wireframesText?: string;
  wireframesImages?: string[];
  designSystemText?: string;
  designSystemImage?: string;
  learnings?: string;
}

export interface LogoConcept {
  title: string;
  description?: string;
  primaryImage?: string; // NEW FIELD: Main media image for this concept
  colors?: string[];
  fonts?: string[];
  mockups?: string[];
}

export interface Showcase {
  _id?: string;
  order?: number;
  title: string;
  category: string;
  description: string;
  tag: string;
  coverImage?: string;
  mediaType: string;
  media: string | string[];
  challenge: string;
  process: string;
  outcome: string;
  isHidden?: boolean; // <-- ADD THIS LINE
  caseStudy?: CaseStudyDetails;
  brandDetails?: {
    colors?: string[];
    mockups?: string[]; 
  };
  logoConcepts?: LogoConcept[];
}

export interface CompanyProject {
  companyName: string;
  companyLogo: string;
  disclaimer: string;
  projects: Showcase[];
}

// NEW BLOG TYPES
export interface BlogPost {
  _id?: string;
  title: string;
  slug?: string; // Add this line!
  description?: string;
  content: string;
  featuredImage?: string;
  photoCredit?: string;
  isPublished: boolean;
  bibliography?: string;
  author?: string; // Added field
  topic?: string;  // Added field
  tags?: string[]; // Added field
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogComment {
  _id?: string;
  postSlug: string;
  text: string;
  animalIdentity: string;
  animalIcon: string;
  createdAt: Date;
}

export interface Invoice {
  _id?: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  currency: "USD" | "KES" | "GBP"; 
  isInternational: boolean;
  status: "pending" | "paid";
  createdAt: Date;
  paidAt?: Date;
  disablePaystack?: boolean; // Added this line to fix the TypeScript error
}

// src/types/index.ts
export interface PricingItem {
  name: string;
  description?: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface PricingList {
  _id?: string;
  title: string;
  clientName: string;
  clientEmail: string;
  currency: string; // e.g., 'USD', 'KES', 'EUR'
  items: PricingItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'paid';
  createdAt: string;
  updatedAt: string;
}

export interface CatalogPrices {
  KES: number;
  USD: number;
  EUR: number;
  GBP: number;
}

export interface CatalogService {
  _id?: string;
  name: string;
  category: string;
  prices: CatalogPrices;
}

export interface CatalogBundle {
  _id?: string;
  name: string;
  description: string;
  includedServices: string[];
  prices: CatalogPrices;
}

export interface SentEmail {
  id: string; // Add a unique ID for editing
  subject: string;
  body: string;
  sentAt: string;
  resendId?: string | null;
  status: "draft" | "scheduled" | "sent" | "received";
}

export interface Quote {
  _id: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Closed Won' | 'Closed Lost';
  notes?: string;
  lastContactedDate?: string;
  emailHistory?: SentEmail[];
  createdAt: string;
}

// UI COMPONENT TYPES
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}