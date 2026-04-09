"use client";

import { Mail, Clock, Calendar } from "lucide-react";
import { Quote } from "@/types";

export const STATUS_STYLES: Record<string, { header: string; card: string; dot: string }> = {
  "New":         { header: "bg-blue-500 dark:bg-blue-600",    card: "border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-900/20",       dot: "bg-blue-500 dark:bg-blue-400" },
  "Contacted":   { header: "bg-amber-500 dark:bg-amber-600",   card: "border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-900/20",     dot: "bg-amber-500 dark:bg-amber-400" },
  "In Progress": { header: "bg-purple-500 dark:bg-purple-600",  card: "border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-900/20",   dot: "bg-purple-500 dark:bg-purple-400" },
  "Closed Won":  { header: "bg-emerald-500 dark:bg-emerald-600", card: "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-900/20", dot: "bg-emerald-500 dark:bg-emerald-400" },
  "Closed Lost": { header: "bg-red-400 dark:bg-red-600",     card: "border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-900/20",         dot: "bg-red-400 dark:bg-red-500" },
};

interface KanbanColumnProps {
  status: Quote["status"];
  quotes: Quote[];
  draggedId: string | null;
  dragOverCol: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDragOver: (status: string) => void;
  onDragLeave: () => void;
  onDrop: (status: Quote["status"]) => void;
  dimmed?: boolean;
  onReply: (quote: Quote) => void;
}

export default function KanbanColumn({
  status,
  quotes,
  draggedId,
  dragOverCol,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  dimmed = false,
  onReply,
}: KanbanColumnProps) {
  const col = STATUS_STYLES[status!];
  const isOver = dragOverCol === status;

  return (
    <div
      className={`flex-shrink-0 w-72 rounded-2xl border-2 transition-all
        ${isOver ? "border-dashed border-gray-400 dark:border-gray-600 scale-[1.01]" : "border-transparent"}
        ${dimmed ? "opacity-60 hover:opacity-100 transition-opacity duration-200" : ""}
      `}
      onDragOver={(e) => { e.preventDefault(); onDragOver(status!); }}
      onDragLeave={onDragLeave}
      onDrop={() => onDrop(status)}
    >
      <div className={`${col.header} rounded-t-xl px-4 py-3 flex items-center justify-between transition-colors`}>
        <span className="text-white font-bold text-sm tracking-wide">{status}</span>
        <span className="bg-white/25 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {quotes.length}
        </span>
      </div>

      <div
        className={`rounded-b-xl p-3 space-y-3 min-h-[160px] transition-colors duration-300
          ${isOver ? "bg-gray-100 dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900/50"}
        `}
      >
        {quotes.length === 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-8 italic transition-colors">Drop leads here</p>
        )}
        {quotes.map((quote) => (
          <div
            key={quote._id}
            draggable
            onDragStart={() => onDragStart(quote._id)}
            onDragEnd={onDragEnd}
            className={`rounded-xl border p-4 shadow-sm cursor-grab active:cursor-grabbing transition-all hover:shadow-md
              ${col.card}
              ${draggedId === quote._id ? "opacity-40 scale-95" : ""}
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <p className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight transition-colors">{quote.name}</p>
              <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 transition-colors ${col.dot}`} />
            </div>

            <div className="flex items-center justify-between mb-3">
              <a
                href={`mailto:${quote.email}`}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center transition-colors truncate"
                title={quote.email}
              >
                <Mail size={11} className="mr-1 flex-shrink-0" /> <span className="truncate max-w-[140px]">{quote.email}</span>
              </a>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReply(quote);
                }}
                className="text-[10px] uppercase tracking-wider font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center"
              >
                Reply
              </button>
            </div>

            <div className="flex gap-1.5 flex-wrap mb-3">
              <span className="px-2 py-0.5 bg-white dark:bg-gray-950 rounded-md text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 transition-colors">
                {quote.service}
              </span>
              <span className="px-2 py-0.5 bg-white dark:bg-gray-950 rounded-md text-xs font-semibold text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50 transition-colors">
                {quote.budget}
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 italic line-clamp-2 mb-3 transition-colors">
              &ldquo;{quote.message}&rdquo;
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/60 dark:border-gray-800 transition-colors">
              <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center transition-colors">
                <Clock size={10} className="mr-1" />
                {new Date(quote.createdAt || new Date()).toLocaleDateString()}
              </span>
              {quote.lastContactedDate && (
                <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center transition-colors">
                  <Calendar size={10} className="mr-1" />
                  {new Date(quote.lastContactedDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}