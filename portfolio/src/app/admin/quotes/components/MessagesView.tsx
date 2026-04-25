"use client";

import { useState, useEffect } from "react";
import { Clock, Send, Edit3, Mail, FileText, MessageSquare, Reply, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Quote, SentEmail } from "@/types";
import ConfirmModal from "@/components/ConfirmModal";

interface MessagesViewProps {
  quotes: Quote[];
  onOpenDraft: (quote: Quote, email?: SentEmail) => void;
  onUpdateEmailStatus: (quoteId: string, emailId: string, status: string) => void;
}

type GlobalEmail = SentEmail & { quote: Quote };
type TabId = "all" | "received" | "draft" | "scheduled" | "sent" | "trash";

const ITEMS_PER_PAGE = 10;

export default function MessagesView({ quotes, onOpenDraft, onUpdateEmailStatus }: MessagesViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [now, setNow] = useState(Date.now());
  const [currentPage, setCurrentPage] = useState(1);
  const [emailToDelete, setEmailToDelete] = useState<{quoteId: string, emailId: string} | null>(null);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const allEmails: GlobalEmail[] = quotes.flatMap(quote => 
    (quote.emailHistory || []).map(email => {
      const sendTimeMs = new Date(email.sentAt).getTime() + 60000;
      let computedStatus = email.status || "sent"; 
      
      if (computedStatus === "scheduled" && sendTimeMs <= now) {
        computedStatus = "sent";
      }
      return { ...email, quote, status: computedStatus as SentEmail["status"] };
    })
  ).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

  // Filter based on active tab
  const filteredEmails = allEmails.filter(email => {
    if (activeTab === "all") return email.status !== "trash"; // Don't show trash in 'All'
    return email.status === activeTab;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredEmails.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEmails = filteredEmails.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleDelete = (quoteId: string, emailId: string) => {
     setEmailToDelete({ quoteId, emailId });
  };

  // NEW: Function to actually execute the move to trash
  const executeTrashEmail = () => {
    if (emailToDelete) {
      onUpdateEmailStatus(emailToDelete.quoteId, emailToDelete.emailId, "trash");
      setEmailToDelete(null); // Close modal
    }
  };

  const handleRestore = (quoteId: string, emailId: string) => {
    onUpdateEmailStatus(quoteId, emailId, "sent"); // Restore defaults to sent
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      
      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-800 px-6 pt-4 gap-6 bg-gray-50/50 dark:bg-gray-900/50 overflow-x-auto custom-scrollbar">
        {[
          { id: "all", label: "All Messages", icon: <Mail size={16} /> },
          { id: "received", label: "Inbox", icon: <MessageSquare size={16} /> },
          { id: "scheduled", label: "Outgoing (Scheduled)", icon: <Clock size={16} /> },
          { id: "draft", label: "Drafts", icon: <FileText size={16} /> },
          { id: "sent", label: "Sent", icon: <Send size={16} /> },
          { id: "trash", label: "Trash", icon: <Trash2 size={16} /> },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabId)}
            className={`pb-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap
              ${activeTab === tab.id ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"}`}
          >
            {tab.icon} {tab.label}
            <span className="bg-gray-200 dark:bg-gray-800 text-xs py-0.5 px-2 rounded-full font-bold ml-1">
              {allEmails.filter(e => tab.id === "all" ? e.status !== "trash" : e.status === tab.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {paginatedEmails.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Mail className="mx-auto mb-4 opacity-50" size={48} />
            <p>No emails found in this category.</p>
          </div>
        ) : (
          paginatedEmails.map((email) => {
            const isScheduled = email.status === "scheduled";
            const isDraft = email.status === "draft";
            const isReceived = email.status === "received";
            const isTrash = email.status === "trash";
            const sendTimeMs = new Date(email.sentAt).getTime() + 60000;
            const secondsLeft = Math.max(0, Math.ceil((sendTimeMs - now) / 1000));

            return (
              <div key={email.id} className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex gap-6 ${isScheduled ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''}`}>
                
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-1">
                  {isTrash ? (
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">
                      <Trash2 size={20} />
                    </div>
                  ) : isReceived ? (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-200 dark:border-indigo-800/50">
                      <MessageSquare size={20} />
                    </div>
                  ) : isScheduled ? (
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <Clock size={20} />
                    </div>
                  ) : isDraft ? (
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                      <FileText size={20} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
                      <Send size={20} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base">{email.subject}</h4>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                      {new Date(email.sentAt).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                    {isReceived ? (
                      <span>From: <strong className="text-indigo-700 dark:text-indigo-400">{email.quote.name}</strong> ({email.quote.email})</span>
                    ) : (
                      <span>To: <strong className="text-gray-700 dark:text-gray-300">{email.quote.name}</strong> ({email.quote.email})</span>
                    )}
                  </div>

                  <p className={`text-sm line-clamp-3 p-4 rounded-xl border ${isReceived ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50 text-gray-800 dark:text-gray-200' : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'}`}>
                    {email.body}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2 w-36 flex-shrink-0">
                  {isTrash ? (
                    <button 
                      onClick={() => handleRestore(email.quote._id, email.id)}
                      className="w-full flex justify-center items-center gap-1.5 text-xs font-bold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Reply size={14} /> Restore
                    </button>
                  ) : (
                    <>
                      {isReceived && (
                        <button 
                          onClick={() => onOpenDraft(email.quote)}
                          className="w-full flex justify-center items-center gap-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors shadow-sm"
                        >
                          <Reply size={14} /> Reply
                        </button>
                      )}
                      {isScheduled && (
                        <>
                          <span className="animate-pulse bg-amber-200 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded w-full text-center">
                            Leaves in {secondsLeft}s
                          </span>
                          <button 
                            onClick={() => onOpenDraft(email.quote, email)}
                            className="w-full flex justify-center items-center gap-1 text-xs font-bold bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-500 px-3 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                        </>
                      )}
                      {isDraft && (
                        <button 
                          onClick={() => onOpenDraft(email.quote, email)}
                          className="w-full flex justify-center items-center gap-1 text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          <Edit3 size={14} /> Resume
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(email.quote._id, email.id)}
                        className="w-full flex justify-center items-center gap-1.5 text-xs font-bold bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{startIndex + 1}</span> to <span className="font-semibold text-gray-900 dark:text-gray-100">{Math.min(startIndex + ITEMS_PER_PAGE, filteredEmails.length)}</span> of <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredEmails.length}</span> messages
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} className="text-gray-600 dark:text-gray-300" />
            </button>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>

        </div>
      )}
      {/* NEW: Confirm Modal for Emails */}
      <ConfirmModal
        isOpen={emailToDelete !== null}
        onClose={() => setEmailToDelete(null)}
        onConfirm={executeTrashEmail}
        title="Move to Trash"
        message="Are you sure you want to move this message to the trash? You can restore it later from the Trash tab."
        confirmText="Move to Trash"
      />
    </div>
  );
}