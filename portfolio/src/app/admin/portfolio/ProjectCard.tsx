import Image from "next/image";
import { GripVertical, Image as ImageIcon, Pencil, Trash2 } from "lucide-react";
import { Showcase } from "./types";

type Props = {
  project: Showcase;
  idx: number;
  isReordering: boolean;
  isEditing: boolean;
  draggedIndex: number | null;
  dragOverIndex: number | null;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragEnter: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onEdit: (project: Showcase) => void;
  onDelete: (id: string, title: string) => void;
};

export default function ProjectCard({
  project, idx, isReordering, isEditing,
  draggedIndex, dragOverIndex,
  onDragStart, onDragEnter, onDragEnd, onDrop,
  onEdit, onDelete,
}: Props) {
  const mediaSrc = Array.isArray(project.media) ? project.media[0] : (project.media as string);

  return (
    <div
      draggable={isReordering}
      onDragStart={(e) => isReordering && onDragStart(e, idx)}
      onDragEnter={(e) => isReordering && onDragEnter(e, idx)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => isReordering && onDrop(e, idx)}
      className={`border rounded-2xl overflow-hidden bg-white dark:bg-gray-900 flex flex-col transition-all duration-200
        ${isEditing ? "border-amber-400 ring-2 ring-amber-300 dark:border-amber-500/50 dark:ring-amber-900/50" : "border-gray-200 dark:border-gray-800"}
        ${isReordering ? "cursor-grab active:cursor-grabbing" : ""}
        ${draggedIndex === idx ? "opacity-50 scale-95 shadow-inner" : "hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-emerald-900/10"}
        ${dragOverIndex === idx && draggedIndex !== idx ? "border-emerald-500 ring-4 ring-emerald-200 dark:ring-emerald-900/50 scale-105 z-10" : ""}
      `}
    >
      <div className={`h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative overflow-hidden transition-colors ${isReordering ? "pointer-events-none" : ""}`}>
        {project.coverImage ? (
          <Image src={project.coverImage} alt={project.title} fill className="object-cover" unoptimized />
        ) : project.mediaType === "image" && project.media.length > 0 ? (
          <Image src={mediaSrc} alt={project.title} fill className="object-cover" unoptimized />
        ) : (
          <ImageIcon className="text-gray-300 dark:text-gray-600 transition-colors" size={48} />
        )}
        <span className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 px-2 py-1 text-xs font-bold rounded-md z-10 transition-colors">{project.category}</span>
        
        {project.isHidden && (
          <span className="absolute top-2 left-2 bg-red-500/90 text-white px-2 py-1 text-xs font-bold rounded-md z-10 transition-colors">Hidden</span>
        )}

        {isReordering && (
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center transition-colors">
            <span className="text-white text-5xl font-black opacity-50">#{idx + 1}</span>
          </div>
        )}
      </div>

      <div className={`p-4 flex flex-col flex-grow transition-colors ${isReordering ? "pointer-events-none" : ""}`}>
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 truncate transition-colors">{project.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 transition-colors">{project.description}</p>

        <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center pointer-events-auto transition-colors">
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 transition-colors">
            {project.category === "Logo" && "Branding"}
            {project.category === "UI/UX" && "Case Study"}
          </span>
          <div className="flex gap-3">
            {isReordering ? (
              <div className="text-gray-400 dark:text-gray-500 flex items-center gap-1 font-semibold text-sm transition-colors">
                <GripVertical size={16} /> Drag
              </div>
            ) : (
              <>
                <button
                  onClick={() => onEdit(project)}
                  className="text-amber-500 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 text-sm font-bold flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 rounded px-1 -ml-1"
                >
                  <Pencil size={15} className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => onDelete(project._id!, project.title)}
                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-bold flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-1 -mr-1"
                >
                  <Trash2 size={15} className="mr-1" /> Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}