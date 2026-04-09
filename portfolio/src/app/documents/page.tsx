"use client";

import { useState, useEffect } from "react";
import { Search, FileText, CheckCircle, Clock, RefreshCw } from "lucide-react";
import PayInvoiceButton from "@/components/PayInvoiceButton"; 
import DownloadDocumentBtn from "@/components/DownloadDocumentBtn";
import { DocumentData } from "@/components/pdf/DocumentTemplate";

// 1. ADD disablePaystack to the interface here so TypeScript knows about it
interface TransactionDocument {
  _id: string;
  referenceNumber: string;
  type: 'invoice' | 'receipt';
  status: 'pending' | 'paid';
  clientName: string;
  clientEmail: string;
  description: string;
  amount: number;
  currency?: string;
  mpesaMessage?: string;
  date: string; 
  disablePaystack?: boolean; // <-- Added this
}

export default function DocumentsPage() {
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState<TransactionDocument | null>(null);
  const [error, setError] = useState("");

  const [exchangeRate, setExchangeRate] = useState(1);
  const [isConverting, setIsConverting] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDocument(null);

    try {
      const res = await fetch(`/api/documents?ref=${reference}`);
      const data = await res.json();

      if (res.ok) {
        setDocument(data);
      } else {
        setError(data.error || "Could not find a document with that reference.");
      }
    } catch (err) {
      setError("An error occurred while fetching the document.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (document && ['EUR', 'GBP'].includes(document.currency || '')) {
      setIsConverting(true);
      fetch(`/api/exchange-rate?base=${document.currency}`)
        .then(res => res.json())
        .then(data => {
          if (data.rate) setExchangeRate(data.rate);
        })
        .catch(err => console.error("Failed to fetch rate", err))
        .finally(() => setIsConverting(false));
    } else {
      setExchangeRate(1);
    }
  }, [document]);

  const isEuroOrGbp = ['EUR', 'GBP'].includes(document?.currency || '');
  const paystackCurrency = isEuroOrGbp ? 'KES' : (document?.currency || 'USD');
  const paystackAmount = isEuroOrGbp ? ((document?.amount || 0) * exchangeRate) : (document?.amount || 0);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-20 px-6 font-sans flex flex-col items-center transition-colors duration-300">
      
      {/* Search Portal */}
      <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-800 text-center mb-8 transition-colors duration-300">
        <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors">
          <FileText size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2 transition-colors">Client Portal</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 transition-colors">Enter the 6-character reference number from your email to view your document.</p>
        
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={reference}
            onChange={(e) => setReference(e.target.value.toUpperCase())}
            placeholder="e.g. A1B2C3" 
            maxLength={6}
            required
            className="w-full sm:flex-1 p-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-center font-bold tracking-widest uppercase transition-colors"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center bg-gray-900 dark:bg-teal-600 text-white p-4 rounded-xl hover:bg-gray-800 dark:hover:bg-teal-700 transition-colors disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            {loading ? <Clock size={24} className="animate-spin" /> : <Search size={24} />}
          </button>
        </form>

        {error && <p className="text-red-500 dark:text-red-400 mt-4 font-medium transition-colors">{error}</p>}
      </div>

      {/* Document View */}
      {document && (
        <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg dark:shadow-none border border-gray-100 dark:border-gray-800 fade-in transition-colors duration-300">
          <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-6 mb-6 transition-colors">
            <div>
              <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 transition-colors">
                {document.type === 'invoice' ? 'Invoice' : 'Receipt'}
              </p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 transition-colors">#{document.referenceNumber}</h2>
            </div>
            {document.status === 'paid' ? (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center transition-colors">
                <CheckCircle size={14} className="mr-1" /> PAID
              </span>
            ) : (
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold flex items-center transition-colors">
                <Clock size={14} className="mr-1" /> PENDING
              </span>
            )}
          </div>

          <div className="space-y-4 mb-8 text-gray-600 dark:text-gray-300 transition-colors">
            <div className="flex justify-between">
              <span className="font-medium">Billed To:</span>
              <span className="text-gray-900 dark:text-gray-100 font-semibold transition-colors">{document.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Service:</span>
              <span className="text-gray-900 dark:text-gray-100 font-semibold text-right max-w-[200px] transition-colors">{document.description}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-4 transition-colors">
              <span className="font-bold text-gray-900 dark:text-gray-100 transition-colors">Total Amount:</span>
              <span className="font-bold text-2xl text-teal-600 dark:text-teal-400 transition-colors">
                {document.currency || "EUR"} {parseFloat(String(document.amount)).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div>
            {/* ONLY show currency notice if it's an international currency AND Paystack is NOT disabled */}
            {isEuroOrGbp && document.status === 'pending' && !document.disablePaystack && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 mb-6 text-sm text-blue-800 dark:text-blue-300 transition-colors">
                <p className="flex items-center font-bold mb-1">
                  Currency Notice {isConverting && <RefreshCw size={12} className="ml-2 animate-spin" />}
                </p>
                <p>
                  Our payment gateway processes transactions in Kenyan Shillings (KES). 
                  Your {document.currency} invoice will be securely charged as approximately <strong className="dark:text-blue-200">KES {paystackAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</strong> based on the live market rate.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {document.type === 'invoice' && document.status === 'pending' && (
                 <div className="w-full" style={isConverting ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
                   <PayInvoiceButton 
                      invoice={{
                        _id: document._id,
                        clientName: document.clientName,
                        clientEmail: document.clientEmail,
                        amount: paystackAmount, 
                        currency: paystackCurrency as "USD" | "KES" | "GBP", 
                        isInternational: true, 
                        status: document.status,
                        createdAt: new Date(document.date),
                        disablePaystack: document.disablePaystack // 2. Pass the flag down!
                      }} 
                   />
                 </div>
              )}
              
              <div className="w-full flex *:w-full *:flex-1 *:py-2">
                <DownloadDocumentBtn 
                  data={document as DocumentData}
                  type={document.type} 
                />
              </div>
            </div>
          </div>

          {document.type === 'receipt' && document.mpesaMessage && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800 transition-colors">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 transition-colors">Payment Details</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 break-words transition-colors">{document.mpesaMessage}</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}