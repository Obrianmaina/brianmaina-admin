"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, Plus, Save, X } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import ProjectCard from "./ProjectCard";
import ProjectForm from "./ProjectForm";
import { Showcase, FormState, ModalState } from "./types";
import { initialFormState, showcaseToFormState, splitAndTrim } from "./constants";

export default function PortfolioCMS() {
  const router = useRouter();
  const [projects, setProjects] = useState<Showcase[]>([]);
  const [loading, setLoading] = useState(true);

  const [isReordering, setIsReordering] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [formMode, setFormMode] = useState<null | "new" | string>(null);
  const [formData, setFormData] = useState<FormState>(initialFormState);

  const [modal, setModal] = useState<ModalState>({ show: false, type: "success", title: "", message: "" });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/portfolio");
      if (res.ok) setProjects(await res.json());
    } catch { console.error("Failed to fetch projects"); }
    finally { setLoading(false); }
  };

  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

  const openEdit = (project: Showcase) => {
    setFormData(showcaseToFormState(project));
    setFormMode(String(project._id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openAdd = () => {
    setFormData(initialFormState);
    setFormMode("new");
    setIsReordering(false);
  };

  const closeForm = () => {
    setFormMode(null);
    setFormData(initialFormState);
  };

  const handleFormChange = (updated: Partial<FormState>) =>
    setFormData(prev => ({ ...prev, ...updated }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = formMode !== null && formMode !== "new";

    const payload: Partial<Showcase> & { id?: string } = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      tag: formData.tag,
      mediaType: formData.mediaType,
      challenge: formData.challenge,
      process: formData.process,
      outcome: formData.outcome,
      isHidden: formData.isHidden,
      media: formData.mediaType === "image" ? splitAndTrim(formData.media) : formData.media,
    };

    if (formData.coverImage) payload.coverImage = formData.coverImage;
    if (isEditing) payload.id = formMode as string;

    if (formData.category === "Logo") {
      payload.logoConcepts = formData.logoConcepts.map(c => ({
        title: c.title,
        description: c.description,
        primaryImage: c.primaryImage,
        colors: splitAndTrim(c.colorsStr),
        fonts: splitAndTrim(c.fontsStr),
        mockups: splitAndTrim(c.mockupsStr),
      }));
    }

    if (formData.category === "UI/UX") {
      payload.caseStudy = {
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

    try {
      const res = await fetch("/api/admin/portfolio", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModal({ show: true, type: "success", title: "Success", message: isEditing ? "Project updated successfully!" : "Project added to portfolio!" });
        closeForm();
        fetchProjects();
      } else {
        const errorData = await res.json().catch(() => ({}));
        const serverErrorMsg = errorData.error || errorData.message || res.statusText;
        setModal({ show: true, type: "error", title: "Update Failed", message: `Server reported: ${serverErrorMsg}. Please check that you haven't included large Base64 images.` });
      }
    } catch {
      setModal({ show: true, type: "error", title: "Network Error", message: "Failed to reach the server. Check your connection." });
    }
  };

  const handleDelete = (id: string, title: string) => {
    setModal({
      show: true, type: "confirm", title: "Delete Project",
      message: `Are you sure you want to delete "${title}"?`,
      onConfirm: async () => {
        const res = await fetch("/api/admin/portfolio", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          setProjects(projects.filter(p => p._id !== id));
          setModal({ show: false, type: "success", title: "", message: "" });
          if (formMode === id) closeForm();
        }
      },
    });
  };

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
    const next = [...projects];
    const [item] = next.splice(draggedIndex, 1);
    next.splice(dropIndex, 0, item);
    setProjects(next);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSaveOrder = async () => {
    const orderData = projects.map((p, index) => ({ _id: p._id, order: index }));
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        setModal({ show: true, type: "success", title: "Success", message: "Portfolio order updated successfully!" });
        setIsReordering(false);
        fetchProjects();
      } else {
        setModal({ show: true, type: "error", title: "Error", message: "Failed to update order." });
      }
    } catch {
      setModal({ show: true, type: "error", title: "Error", message: "An unexpected error occurred." });
    }
  };

  const isFormOpen = formMode !== null;
  const isEditing = isFormOpen && formMode !== "new";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-none border border-gray-100 dark:border-gray-800 fade-in transition-colors duration-300">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md p-1 -ml-1"
          >
            <ArrowLeft size={20} className="mr-2" /> Back to Hub
          </button>

          <div className="flex flex-wrap gap-2">
            {!isFormOpen && !isReordering && (
              <button onClick={() => setIsReordering(true)} className="flex items-center border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">
                Reorder Projects
              </button>
            )}
            {isReordering && (
              <>
                <button onClick={() => { setIsReordering(false); fetchProjects(); }} className="flex items-center border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">
                  Cancel Reorder
                </button>
                <button onClick={handleSaveOrder} className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                  <Save size={18} className="mr-2" /> Save Order
                </button>
              </>
            )}
            {!isReordering && (
              <>
                {isFormOpen && (
                  <button onClick={closeForm} className="flex items-center border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">
                    <X size={16} className="mr-1" /> Cancel
                  </button>
                )}
                <button onClick={isFormOpen ? closeForm : openAdd} className="flex items-center bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                  {isFormOpen ? "Close Form" : <><Plus size={18} className="mr-2" /> Add Project</>}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center mb-8 border-l-4 border-emerald-500 pl-4 transition-colors">
          <Briefcase size={28} className="text-emerald-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Portfolio Manager</h2>
        </div>

        {isFormOpen && (
          <ProjectForm
            formData={formData}
            isEditing={isEditing}
            onSubmit={handleSubmit}
            onChange={handleFormChange}
          />
        )}

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 transition-colors">Loading projects...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <ProjectCard
                key={project._id}
                project={project}
                idx={idx}
                isReordering={isReordering}
                isEditing={formMode === project._id}
                draggedIndex={draggedIndex}
                dragOverIndex={dragOverIndex}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}