"use client";

import { useState, useEffect } from "react";
import { X, Send, Clock, Edit3, Loader2, Save, Mail, FileText } from "lucide-react";
import { Quote, SentEmail } from "@/types";

interface EmailReplyModalProps {
  quote: Quote;
  existingEmail?: SentEmail;
  onClose: () => void;
  onSuccess: () => void;
  onRefresh?: () => void; 
}

export default function EmailReplyModal({ quote, existingEmail, onClose, onSuccess, onRefresh }: EmailReplyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [activeTab, setActiveTab] = useState<"compose" | "history">("compose");
  const [now, setNow] = useState(Date.now());
  
  const [subject, setSubject] = useState(existingEmail?.subject || `Following up on your inquiry: ${quote.service}`);
  const [message, setMessage] = useState(
    existingEmail?.body || `Hi ${quote.name.split(' ')[0]},\n\nThank you for reaching out regarding ${quote.service}. I have reviewed your request and would love to discuss how we can work together to achieve your goals.\n\nAre you available for a brief call sometime this week?\n\nBest regards,\nBrian`
  );

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Instantly cancel scheduled email upon opening
  useEffect(() => {
    if (existingEmail && existingEmail.status === "scheduled" && existingEmail.resendId) {
      handleEditScheduled(existingEmail.resendId, existingEmail.id);
    }
  }, [existingEmail]);

  const handleEditScheduled = async (resendId: string, emailId: string) => {
    try {
      const res = await fetch("/api/admin/quotes/reply/cancel", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: quote._id, resendId, emailId }), // Passed emailId
      });
      
      if (res.ok) {
        onRefresh?.(); 
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveToDatabase = async (action: "send" | "draft") => {
    try {
      const res = await fetch("/api/admin/quotes/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: quote._id,
          email: quote.email,
          subject,
          message,
          action,
          emailId: existingEmail?.id 
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        alert("Action failed.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await saveToDatabase("send");
    setIsSubmitting(false);
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    await saveToDatabase("draft");
    setIsSavingDraft(false);
  };

  const sortedHistory = [...(quote.emailHistory || [])].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">
              {existingEmail ? "Edit Message" : "New Message"} to {quote.name}
            </h3>
            <p className="text-sm text-gray-500">{quote.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-gray-100 dark:border-gray-800 px-4 pt-2 gap-4 bg-gray-50/50 dark:bg-gray-900">
          <button 
            onClick={() => setActiveTab("compose")}
            className={`pb-2 font-medium text-sm border-b-2 transition-colors ${activeTab === "compose" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Compose
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`pb-2 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === "history" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            History <span className="bg-gray-200 dark:bg-gray-800 text-xs py-0.5 px-2 rounded-full font-bold">{quote.emailHistory?.length || 0}</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {activeTab === "compose" ? (
            <form id="email-form" onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Subject</label>
                <input 
                  required type="text" value={subject} onChange={e => setSubject(e.target.value)} 
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 mt-1" 
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Message Body</label>
                <textarea 
                  required value={message} onChange={e => setMessage(e.target.value)} 
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 mt-1 h-60 resize-y leading-relaxed" 
                />
                <div className="flex items-start gap-2 mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                  <Clock size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-800 dark:text-blue-300 leading-tight">
                    <strong>Safety Delay:</strong> Emails are scheduled with a 1-minute delay. You can cancel and edit them in the Outbox tab before they leave.
                  </p>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {sortedHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-400 dark:text-gray-600 flex flex-col items-center">
                  <Mail className="mb-3 opacity-50" size={40} />
                  <p>No emails have been sent to this lead yet.</p>
                </div>
              ) : (
                sortedHistory.map((hist, i) => {
                  const sendTimeMs = new Date(hist.sentAt).getTime() + 60000; 
                  
                  let currentStatus = hist.status || "sent";
                  if (currentStatus === "scheduled" && sendTimeMs <= now) {
                    currentStatus = "sent";
                  }

                  const isScheduled = currentStatus === "scheduled";
                  const isDraft = currentStatus === "draft";
                  const secondsLeft = Math.max(0, Math.ceil((sendTimeMs - now) / 1000));

                  return (
                    <div key={i} className={`border rounded-xl p-4 transition-all ${isScheduled ? 'border-amber-300 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-900/10' : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50'}`}>
                      
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">{hist.subject}</h4>
                          <span className="text-xs text-gray-400">
                            {new Date(hist.sentAt).toLocaleString()}
                          </span>
                        </div>
                        
                        {isScheduled && (
                          <div className="flex flex-col items-end gap-2">
                            <span className="animate-pulse bg-amber-200 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded flex items-center gap-1">
                              <Clock size={10} /> Leaving in {secondsLeft}s
                            </span>
                          </div>
                        )}
                        
                        {isDraft && (
                          <span className="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded flex items-center gap-1">
                            <FileText size={10} /> Draft
                          </span>
                        )}

                        {(!isScheduled && !isDraft) && (
                          <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
                            Sent
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap mt-2 bg-white dark:bg-gray-950 p-4 rounded-lg border border-gray-100 dark:border-gray-800 font-sans">
                        {hist.body}
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {activeTab === "compose" && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-950/50">
            <button 
              type="button" 
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isSubmitting}
              className="px-4 py-2 flex items-center gap-2 text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSavingDraft ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
              Save as Draft
            </button>
            
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-5 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" form="email-form" disabled={isSubmitting || isSavingDraft} className="px-5 py-2 flex items-center gap-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Scheduling...</> : <><Send size={16} /> Schedule Send</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}