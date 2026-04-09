"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Mail, Clock, Calendar, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Quote } from "@/types";

interface QuotesTableProps {
  quotes: Quote[];
  expandedId: string | null;
  editingNotes: { [id: string]: string };
  onToggleExpand: (id: string) => void;
  onUpdateLead: (id: string, updates: Partial<Quote>) => void;
  onNotesSave: (id: string) => void;
  onContactDateUpdate: (id: string) => void;
  onNotesChange: (id: string, value: string) => void;
  onReply: (quote: Quote) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "New":          return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    case "Contacted":    return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
    case "In Progress":  return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800";
    case "Closed Won":   return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    case "Closed Lost":  return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
    default:             return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700";
  }
};

export default function QuotesTable({
  quotes = [], // SAFEGURAD: Defaults to an empty array
  expandedId,
  editingNotes,
  onToggleExpand,
  onUpdateLead,
  onNotesSave,
  onContactDateUpdate,
  onNotesChange,
  onReply,
}: QuotesTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
      <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 uppercase text-xs transition-colors duration-300">
          <tr>
            <th className="px-4 py-4 rounded-tl-xl w-10"></th>
            <th className="px-4 py-4">Client Details</th>
            <th className="px-4 py-4">Project Request</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-4 py-4 text-right rounded-tr-xl">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 transition-colors duration-300">
          {quotes.map((quote) => (
            <React.Fragment key={quote._id}>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                <td className="px-4 py-4 align-top">
                  <button
                    onClick={() => onToggleExpand(quote._id)}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded transition-colors"
                  >
                    {expandedId === quote._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </td>

                <td className="px-4 py-4 align-top">
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-base transition-colors">{quote.name}</p>
                  <a
                    href={`mailto:${quote.email}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center mt-1 mb-2 transition-colors"
                  >
                    <Mail size={14} className="mr-1.5" /> {quote.email}
                  </a>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 transition-colors">
                    <Clock size={12} className="mr-1" />
                    Received: {new Date(quote.createdAt || new Date()).toLocaleDateString()}
                  </div>
                </td>

                <td className="px-4 py-4 align-top max-w-xs">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition-colors">
                      {quote.service}
                    </span>
                    <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-md text-xs font-semibold text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50 transition-colors">
                      {quote.budget}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 italic line-clamp-2 transition-colors" title={quote.message}>
                    &ldquo;{quote.message}&rdquo;
                  </p>
                </td>

                <td className="px-4 py-4 align-top whitespace-nowrap">
                  <select
                    value={quote.status || "New"}
                    onChange={(e) =>
                      onUpdateLead(quote._id, { status: e.target.value as Quote["status"] })
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border outline-none cursor-pointer appearance-none focus:ring-2 focus:ring-teal-500 transition-colors ${getStatusColor(quote.status || "New")}`}
                  >
                    <option value="New" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">New Lead</option>
                    <option value="Contacted" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">Contacted</option>
                    <option value="In Progress" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">In Progress</option>
                    <option value="Closed Won" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">Closed Won</option>
                    <option value="Closed Lost" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">Closed Lost</option>
                  </select>
                </td>

                <td className="px-4 py-4 align-top text-right space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => onReply(quote)}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() =>
                      router.push(
                        `/admin/accounts?email=${encodeURIComponent(quote.email)}&name=${encodeURIComponent(quote.name)}`
                      )
                    }
                    className="inline-flex items-center px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Create Invoice
                  </button>
                </td>
              </tr>

              {/* Expanded CRM Row */}
              {expandedId === quote._id && (
                <tr className="bg-gray-50/50 dark:bg-gray-800/20 transition-colors">
                  <td colSpan={5} className="p-0 border-b border-gray-200 dark:border-gray-800">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-l-4 border-blue-400 dark:border-blue-600 transition-colors">

                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center mb-2 transition-colors">
                          <MessageSquare size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                          Original Message
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm whitespace-pre-wrap transition-colors">
                          {quote.message}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center transition-colors">
                              <Calendar size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                              Last Contacted
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                              {quote.lastContactedDate
                                ? new Date(quote.lastContactedDate).toLocaleString()
                                : "Never"}
                            </p>
                          </div>
                          <button
                            onClick={() => onContactDateUpdate(quote._id)}
                            className="text-xs font-semibold px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            Mark as Contacted Today
                          </button>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors">Internal Notes</h4>
                          <textarea
                            className="w-full p-3 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-colors"
                            rows={3}
                            placeholder="Add notes from your client call here..."
                            value={
                              editingNotes[quote._id] !== undefined
                                ? editingNotes[quote._id]
                                : quote.notes || ""
                            }
                            onChange={(e) => onNotesChange(quote._id, e.target.value)}
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => onNotesSave(quote._id)}
                              className="text-xs font-semibold px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                              Save Notes
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}