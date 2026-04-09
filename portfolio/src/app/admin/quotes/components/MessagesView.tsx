"use client";

import { useState, useEffect } from "react";
import { Clock, Send, Edit3, Mail, FileText } from "lucide-react";
import { Quote, SentEmail } from "@/types";

interface MessagesViewProps {
  quotes: Quote[];
  onOpenDraft: (quote: Quote, email: SentEmail) => void;
}

type GlobalEmail = SentEmail & { quote: Quote };

// Use exact status names as Tab IDs to prevent mismatches
type TabId = "all" | "draft" | "scheduled" | "sent";

export default function MessagesView({ quotes, onOpenDraft }: MessagesViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Aggregate and normalize all emails
  const allEmails: GlobalEmail[] = quotes.flatMap(quote => 
    (quote.emailHistory || []).map(email => {
      const sendTimeMs = new Date(email.sentAt).getTime() + 60000;
      
      // Fallback to "sent" for older emails that don't have a status field
      let computedStatus = email.status || "sent"; 
      
      // If a scheduled email's time has passed, mark it as sent
      if (computedStatus === "scheduled" && sendTimeMs <= now) {
        computedStatus = "sent";
      }
      
      // Cast safely to SentEmail["status"] instead of TabId
      return { ...email, quote, status: computedStatus as SentEmail["status"] };
    })
  ).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

  // Filter based on active tab
  const filteredEmails = allEmails.filter(email => {
    if (activeTab === "all") return true;
    return email.status === activeTab;
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      
      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-800 px-6 pt-4 gap-6 bg-gray-50/50 dark:bg-gray-900/50">
        {[
          { id: "all", label: "All Messages", icon: <Mail size={16} /> },
          { id: "scheduled", label: "Outgoing (Scheduled)", icon: <Clock size={16} /> },
          { id: "draft", label: "Drafts", icon: <FileText size={16} /> },
          { id: "sent", label: "Sent", icon: <Send size={16} /> },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabId)}
            className={`pb-3 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 
              ${activeTab === tab.id ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"}`}
          >
            {tab.icon} {tab.label}
            <span className="bg-gray-200 dark:bg-gray-800 text-xs py-0.5 px-2 rounded-full font-bold ml-1">
              {allEmails.filter(e => tab.id === "all" ? true : e.status === tab.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {filteredEmails.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Mail className="mx-auto mb-4 opacity-50" size={48} />
            <p>No emails found in this category.</p>
          </div>
        ) : (
          filteredEmails.map((email) => {
            const isScheduled = email.status === "scheduled";
            const isDraft = email.status === "draft";
            const sendTimeMs = new Date(email.sentAt).getTime() + 60000;
            const secondsLeft = Math.max(0, Math.ceil((sendTimeMs - now) / 1000));

            return (
              <div key={email.id} className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex gap-6 ${isScheduled ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''}`}>
                
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-1">
                  {isScheduled ? (
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
                    <span>To: <strong className="text-gray-700 dark:text-gray-300">{email.quote.name}</strong> ({email.quote.email})</span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 bg-white dark:bg-gray-950 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    {email.body}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2 w-36 flex-shrink-0">
                  {isScheduled && (
                    <>
                      <span className="animate-pulse bg-amber-200 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded w-full text-center">
                        Leaves in {secondsLeft}s
                      </span>
                      <button 
                        onClick={() => onOpenDraft(email.quote, email)}
                        className="w-full flex justify-center items-center gap-1 text-xs font-bold bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-500 px-3 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
                      >
                        <Edit3 size={14} /> Cancel & Edit
                      </button>
                    </>
                  )}
                  {isDraft && (
                    <button 
                      onClick={() => onOpenDraft(email.quote, email)}
                      className="w-full flex justify-center items-center gap-1 text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Edit3 size={14} /> Resume Draft
                    </button>
                  )}
                  {(!isScheduled && !isDraft) && (
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded w-full text-center">
                      Delivered
                    </span>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}