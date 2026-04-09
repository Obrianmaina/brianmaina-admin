import Image from "next/image";
import { GripVertical, Image as ImageIcon, Pencil, Trash2 } from "lucide-react";
import { CompanyProject, Showcase } from "../types";

type Props = {
  company: CompanyProject;
  idx: number;
  isReordering: boolean;
  draggedIndex: number | null;
  dragOverIndex: number | null;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragEnter: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onEditCompany: (company: CompanyProject) => void;
  onAddProject: (company: CompanyProject) => void;
  onEditProject: (company: CompanyProject, project: Showcase, idx: number) => void;
  onDeleteCompany: (id: string, name: string) => void;
  onDeleteProject: (companyId: string, projectIdx: number, projectTitle: string) => void;
};

export default function CompanyCard({
  company, idx, isReordering, draggedIndex, dragOverIndex,
  onDragStart, onDragEnter, onDragEnd, onDrop,
  onEditCompany, onAddProject, onEditProject, onDeleteCompany, onDeleteProject,
}: Props) {
  return (
    <div
      draggable={isReordering}
      onDragStart={(e) => isReordering && onDragStart(e, idx)}
      onDragEnter={(e) => isReordering && onDragEnter(e, idx)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => isReordering && onDrop(e, idx)}
      className={`border rounded-2xl p-6 bg-white dark:bg-gray-900 transition-all duration-200
        ${isReordering ? "cursor-grab active:cursor-grabbing border-gray-300 dark:border-gray-600" : "border-gray-200 dark:border-gray-800 hover:shadow-md dark:hover:shadow-2xl dark:hover:shadow-violet-900/10"}
        ${draggedIndex === idx ? "opacity-50 scale-95 shadow-inner" : ""}
        ${dragOverIndex === idx && draggedIndex !== idx ? "border-violet-500 ring-4 ring-violet-200 dark:ring-violet-900/50 scale-105 z-10" : ""}
      `}
    >
      {/* ── Card Header ─────────────────────────────────────────────────────── */}
      <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 ${isReordering ? "pointer-events-none" : ""}`}>
        <div className="flex items-center gap-4">
          {isReordering && <GripVertical className="text-gray-400 dark:text-gray-500 mr-2 shrink-0 transition-colors" />}
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden relative shrink-0 transition-colors">
            {company.companyLogo ? (
              <Image src={company.companyLogo} alt={company.companyName} fill className="object-contain p-2" unoptimized />
            ) : (
              <ImageIcon className="text-gray-300 dark:text-gray-600 transition-colors" size={24} />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors">{company.companyName}</h3>
            {!isReordering && (
              <div className="flex flex-wrap gap-4 mt-1">
                <button
                  onClick={() => onAddProject(company)}
                  className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 font-semibold flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 rounded px-1 -ml-1"
                >
                  + Add Project
                </button>
                <button
                  onClick={() => onEditCompany(company)}
                  className="text-sm text-amber-500 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 font-semibold flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded px-1"
                >
                  <Pencil size={14} className="mr-1" /> Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {!isReordering && (
          <button
            onClick={() => onDeleteCompany(company._id!, company.companyName)}
            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-bold flex items-center bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 self-start"
          >
            <Trash2 size={16} className="mr-1" /> Delete
          </button>
        )}
      </div>

      {/* ── Disclaimer ──────────────────────────────────────────────────────── */}
      <p className={`text-xs text-gray-400 dark:text-gray-500 italic bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800 mb-6 transition-colors ${isReordering ? "pointer-events-none" : ""}`}>
        {company.disclaimer}
      </p>

      {/* ── Nested Projects Grid ─────────────────────────────────────────────── */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity ${isReordering ? "pointer-events-none opacity-60" : ""}`}>
        {company.projects?.map((project, pIdx) => (
          <ProjectTile
            key={pIdx}
            project={project}
            pIdx={pIdx}
            company={company}
            onEdit={onEditProject}
            onDelete={onDeleteProject}
          />
        ))}
      </div>
    </div>
  );
}

// ── ProjectTile ──────────────────────────────────────────────────────────────

type TileProps = {
  project: Showcase;
  pIdx: number;
  company: CompanyProject;
  onEdit: (company: CompanyProject, project: Showcase, idx: number) => void;
  onDelete: (companyId: string, projectIdx: number, projectTitle: string) => void;
};

function ProjectTile({ project, pIdx, company, onEdit, onDelete }: TileProps) {
  const thumbSrc = project.coverImage
    ? project.coverImage
    : project.mediaType === "image" && project.media.length > 0
    ? Array.isArray(project.media) ? project.media[0] : (project.media as string)
    : null;

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800/50 flex flex-col transition-colors">
      <div className="h-24 bg-gray-200 dark:bg-gray-800 relative overflow-hidden flex items-center justify-center transition-colors">
        {thumbSrc ? (
          <Image src={thumbSrc} alt={project.title} fill className="object-cover" unoptimized />
        ) : (
          <ImageIcon className="text-gray-300 dark:text-gray-600 transition-colors" size={24} />
        )}
        <span className="absolute top-1 right-1 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 px-1.5 py-0.5 text-[10px] font-bold rounded z-10 transition-colors">
          {project.category}
        </span>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1 truncate transition-colors">{project.title}</h4>
        <div className="mt-auto border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between items-center pointer-events-auto transition-colors">
          <button
            onClick={() => onEdit(company, project, pIdx)}
            className="text-amber-500 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 text-xs font-bold flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded px-1 -ml-1"
          >
            <Pencil size={12} className="mr-1" /> Edit
          </button>
          <button
            onClick={() => onDelete(company._id!, pIdx, project.title)}
            className="text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 text-xs font-bold flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-1 -mr-1"
          >
            <Trash2 size={12} className="mr-1" /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}