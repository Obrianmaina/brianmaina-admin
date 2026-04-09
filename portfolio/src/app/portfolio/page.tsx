"use client";

import { useState, useEffect } from "react";
import { SiLinkedin, SiGithub, SiBehance } from "react-icons/si";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Showcase, CompanyProject } from "@/types";

import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ThumbnailPreview from "@/components/ThumbnailPreview";
import LightboxModal from "@/components/portfolio/lightbox/LightboxModal";
import DisclaimerModal from "@/components/portfolio/DisclaimerModal";
import CorporateGalleryModal from "@/components/portfolio/CorporateGalleryModal";
import ExpandedMockupModal from "@/components/portfolio/ExpandedMockupModal";

const categories = ["All", "UI/UX", "Presentation", "Branding", "Logo", "Graphics", "Publication", "Video"] as const;
type Category = typeof categories[number];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [lightbox, setLightbox] = useState<Showcase | null>(null);
  const [disclaimerProject, setDisclaimerProject] = useState<CompanyProject | null>(null);
  const [companyProjectsToShow, setCompanyProjectsToShow] = useState<Showcase[] | null>(null);
  const [expandedMockup, setExpandedMockup] = useState<string | null>(null);

  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [corporateData, setCorporateData] = useState<CompanyProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const [showcasesRes, corporateRes] = await Promise.all([
          fetch("/api/admin/portfolio"),
          fetch("/api/admin/corporate"),
        ]);
        if (showcasesRes.ok) setShowcases(await showcasesRes.json());
        if (corporateRes.ok) setCorporateData(await corporateRes.json());
      } catch (error) {
        console.error("Failed to fetch portfolio projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpandedMockup(null);
        setLightbox(null);
        setDisclaimerProject(null);
        setCompanyProjectsToShow(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const visibleShowcases = showcases.filter((project) => !project.isHidden);

  const filteredShowcases = activeCategory === "All"
    ? visibleShowcases
    : visibleShowcases.filter((item) => item.category === activeCategory);

  const handleDisclaimerProceed = (projects: Showcase[]) => {
    if (projects.length === 1) {
      setLightbox(projects[0]);
    } else if (projects.length > 1) {
      setCompanyProjectsToShow(projects);
    }
    setDisclaimerProject(null);
  };

  return (
    <main className="relative bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen overflow-x-hidden pt-24 transition-colors duration-300">
      
      <section id="portfolio" className="relative max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-900 dark:text-gray-50">Design Showcase</h1>

        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map((cat) => (
            <Button key={cat} variant={activeCategory === cat ? "default" : "outline"} onClick={() => setActiveCategory(cat)}>
              {cat}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="text-lg font-medium">Loading projects...</p>
          </div>
        ) : filteredShowcases.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <p className="text-xl font-medium">Currently working on {activeCategory === "All" ? "new" : activeCategory} showcase</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShowcases.map((project, idx) => (
              <motion.div key={project._id || idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                <Card className="w-full shadow-lg rounded-2xl group relative overflow-hidden cursor-pointer h-full bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 transition-colors" onClick={() => setLightbox(project)}>
                  <CardContent>
                    <div className="h-40 flex items-center justify-center relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden transition-colors">
                      <ThumbnailPreview project={project} />
                      <span className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">{project.tag}</span>
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm mb-2 px-4 text-center">{project.description}</p>
                        <Button className="bg-teal-500 hover:bg-teal-600 border-none dark:text-white dark:hover:bg-teal-600">View Project</Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">{project.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Category: {project.category}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section id="corporate-work" className="relative max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-900 dark:text-gray-50">Corporate Work</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto text-center">
          This section contains confidential work created for specific companies. Access is granted for portfolio review purposes only after acknowledging the respective disclaimer.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {corporateData.map((project, idx) => (
            <motion.div key={project.companyName} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
              <Card
                className="w-full shadow-lg rounded-2xl group relative overflow-hidden cursor-pointer h-full flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-800 border border-transparent dark:border-gray-800 transition-colors"
                onClick={() => setDisclaimerProject(project)}
              >
                <Image src={project.companyLogo} alt={`${project.companyName} logo`} width={128} height={64} className="h-16 w-auto mb-4" unoptimized={true} />
                <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">{project.companyName}</h3>
                <p className="text-sm text-teal-600 dark:text-teal-400 font-semibold mt-4">View Projects</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <LightboxModal lightbox={lightbox} onClose={() => setLightbox(null)} setExpandedMockup={setExpandedMockup} />
      <DisclaimerModal disclaimerProject={disclaimerProject} onClose={() => setDisclaimerProject(null)} onProceed={handleDisclaimerProceed} />
      <CorporateGalleryModal
        projects={companyProjectsToShow}
        onClose={() => setCompanyProjectsToShow(null)}
        onSelect={(project) => { setLightbox(project); setCompanyProjectsToShow(null); }}
      />
      <ExpandedMockupModal src={expandedMockup} onClose={() => setExpandedMockup(null)} />

    </main>
  );
}