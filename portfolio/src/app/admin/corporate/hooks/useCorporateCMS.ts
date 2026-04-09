import { useState, useEffect } from "react";
import { CompanyProject, FormData, FormMode, ModalState, Showcase } from "../types";

export const initialFormState: FormData = {
  companyName: "",
  companyLogo: "",
  disclaimer:
    "The following work was created during my tenure. It is shared with permission for portfolio purposes only.",
  title: "",
  category: "Graphics",
  description: "",
  tag: "Corporate Work",
  mediaType: "image",
  media: "",
  coverImage: "",
  challenge: "",
  process: "",
  outcome: "",
  brandColorsStr: "",
  brandMockupsStr: "",
  csRole: "",
  csDuration: "",
  csToolsStr: "",
  csProblemText: "",
  csProblemImagesStr: "",
  csResearchText: "",
  csResearchImagesStr: "",
  csWireframesText: "",
  csWireframeImagesStr: "",
  csLearnings: "",
};

export function useCorporateCMS() {
  const [companies, setCompanies] = useState<CompanyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<FormMode>("closed");
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [modal, setModal] = useState<ModalState>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/admin/corporate");
      if (res.ok) setCompanies(await res.json());
    } catch {
      console.error("Failed to fetch corporate entries");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setModal((prev) => ({ ...prev, show: false }));

  const showcaseToFormState = (p: Showcase): FormData => {
    const joinArr = (arr?: string[]) => arr?.join(", ") ?? "";
    const mediaStr = Array.isArray(p.media) ? p.media.join(", ") : (p.media ?? "");
    return {
      ...initialFormState,
      title: p.title ?? "",
      category: p.category ?? "Graphics",
      description: p.description ?? "",
      tag: p.tag ?? "",
      mediaType: p.mediaType ?? "image",
      media: mediaStr,
      coverImage: p.coverImage ?? "",
      challenge: p.challenge ?? "",
      process: p.process ?? "",
      outcome: p.outcome ?? "",
      brandColorsStr: joinArr(p.brandDetails?.colors),
      brandMockupsStr: joinArr(p.brandDetails?.mockups),
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
  };

  // ── Action Handlers ──────────────────────────────────────────────────────────

  const handleOpenAddCompany = () => {
    setFormData(initialFormState);
    setFormMode("add_company");
    setIsReordering(false);
  };

  const handleOpenEditCompany = (company: CompanyProject) => {
    setFormData({
      ...initialFormState,
      companyName: company.companyName,
      companyLogo: company.companyLogo,
      disclaimer: company.disclaimer,
    });
    setActiveCompanyId(company._id!);
    setFormMode("edit_company");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenAddProject = (company: CompanyProject) => {
    setFormData(initialFormState);
    setActiveCompanyId(company._id!);
    setFormMode("add_project");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenEditProject = (
    company: CompanyProject,
    project: Showcase,
    idx: number
  ) => {
    setFormData(showcaseToFormState(project));
    setActiveCompanyId(company._id!);
    setActiveProjectIndex(idx);
    setFormMode("edit_project");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelForm = () => {
    setFormMode("closed");
    setFormData(initialFormState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const splitAndTrim = (str: string) =>
        str ? str.split(",").map((s) => s.trim()).filter(Boolean) : [];

      let projectPayload: Partial<Showcase> | null = null;

      if (formMode !== "edit_company") {
        projectPayload = {
          title: formData.title,
          category: formData.category,
          description: formData.description,
          tag: formData.tag,
          mediaType: formData.mediaType,
          challenge: formData.challenge,
          process: formData.process,
          outcome: formData.outcome,
          media:
            formData.mediaType === "image" && typeof formData.media === "string"
              ? splitAndTrim(formData.media)
              : formData.media,
        };
        if (formData.coverImage) projectPayload.coverImage = formData.coverImage;
        if (formData.category === "Logo")
          projectPayload.brandDetails = {
            colors: splitAndTrim(formData.brandColorsStr),
            mockups: splitAndTrim(formData.brandMockupsStr),
          };
        if (formData.category === "UI/UX")
          projectPayload.caseStudy = {
            role: formData.csRole,
            duration: formData.csDuration,
            tools: splitAndTrim(formData.csToolsStr),
            problemStatement: formData.csProblemText,
            problemImages: splitAndTrim(formData.csProblemImagesStr),
            userResearch: formData.csResearchText,
            researchImages: splitAndTrim(formData.csResearchImagesStr),
            wireframesText: formData.csWireframesText,
            wireframesImages: splitAndTrim(formData.csWireframeImagesStr),
            learnings: formData.csLearnings,
          };
      }

      let method = "PUT";
      let bodyPayload: Partial<CompanyProject> = {};

      if (formMode === "add_company") {
        method = "POST";
        bodyPayload = {
          companyName: formData.companyName,
          companyLogo: formData.companyLogo,
          disclaimer: formData.disclaimer,
          projects: projectPayload ? [projectPayload as Showcase] : [],
        };
      } else if (formMode === "edit_company") {
        bodyPayload = {
          _id: activeCompanyId || undefined,
          companyName: formData.companyName,
          companyLogo: formData.companyLogo,
          disclaimer: formData.disclaimer,
        };
      } else if (formMode === "add_project") {
        const company = companies.find((c) => c._id === activeCompanyId);
        bodyPayload = {
          _id: activeCompanyId || undefined,
          projects: [...(company?.projects || []), projectPayload as Showcase],
        };
      } else if (formMode === "edit_project") {
        const company = companies.find((c) => c._id === activeCompanyId);
        const newProjects = [...(company?.projects || [])];
        if (activeProjectIndex !== null)
          newProjects[activeProjectIndex] = projectPayload as Showcase;
        bodyPayload = { _id: activeCompanyId || undefined, projects: newProjects };
      }

      const res = await fetch("/api/admin/corporate", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      if (res.ok) {
        setModal({ show: true, type: "success", title: "Success", message: "Corporate portfolio updated successfully!" });
        setFormMode("closed");
        setFormData(initialFormState);
        fetchCompanies();
      } else {
        setModal({ show: true, type: "error", title: "Error", message: "Failed to save changes." });
      }
    } catch {
      setModal({ show: true, type: "error", title: "Error", message: "An unexpected error occurred." });
    }
  };

  const handleDeleteCompany = (id: string, name: string) => {
    setModal({
      show: true,
      type: "confirm",
      title: "Delete Corporate Entry",
      message: `Are you sure you want to delete "${name}" and all its nested projects?`,
      onConfirm: async () => {
        const res = await fetch("/api/admin/corporate", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          setCompanies(companies.filter((c) => c._id !== id));
          setModal({ show: false, type: "success", title: "", message: "" });
        }
      },
    });
  };

  const handleDeleteProject = (companyId: string, projectIdx: number, projectTitle: string) => {
    setModal({
      show: true,
      type: "confirm",
      title: "Delete Project",
      message: `Remove "${projectTitle}" from this company?`,
      onConfirm: async () => {
        const company = companies.find((c) => c._id === companyId);
        if (!company) return;
        const newProjects = company.projects.filter((_, idx) => idx !== projectIdx);
        const res = await fetch("/api/admin/corporate", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: companyId, projects: newProjects }),
        });
        if (res.ok) {
          fetchCompanies();
          setModal({ show: false, type: "success", title: "", message: "" });
        }
      },
    });
  };

  // ── Drag & Drop ──────────────────────────────────────────────────────────────

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (index !== draggedIndex) setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const newItems = [...companies];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    setCompanies(newItems);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSaveOrder = async () => {
    const orderData = companies.map((c, index) => ({ _id: c._id, order: index }));
    try {
      const res = await fetch("/api/admin/corporate", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        setModal({ show: true, type: "success", title: "Success", message: "Corporate order updated successfully!" });
        setIsReordering(false);
        fetchCompanies();
      } else {
        setModal({ show: true, type: "error", title: "Error", message: "Failed to update order." });
      }
    } catch {
      setModal({ show: true, type: "error", title: "Error", message: "An unexpected error occurred." });
    }
  };

  return {
    // State
    companies,
    loading,
    formMode,
    formData,
    setFormData,
    isReordering,
    setIsReordering,
    draggedIndex,
    dragOverIndex,
    modal,
    // Derived
    isFormOpen: formMode !== "closed",
    showCompanyFields: formMode === "add_company" || formMode === "edit_company",
    showProjectFields: formMode === "add_company" || formMode === "add_project" || formMode === "edit_project",
    // Handlers
    closeModal,
    handleOpenAddCompany,
    handleOpenEditCompany,
    handleOpenAddProject,
    handleOpenEditProject,
    handleCancelForm,
    handleSubmit,
    handleDeleteCompany,
    handleDeleteProject,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDrop,
    handleSaveOrder,
    fetchCompanies,
  };
}