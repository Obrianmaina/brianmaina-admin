'use client';

import dynamic from 'next/dynamic';
import { Download, Loader2 } from 'lucide-react';
import { DocumentTemplate, DocumentData } from './pdf/DocumentTemplate';
import { useState, useEffect } from 'react';

// Dynamically import PDFDownloadLink to prevent Next.js SSR errors
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false }
);

export default function DownloadDocumentBtn({ 
  data, 
  type,
  iconOnly = false
}: { 
  data: DocumentData; 
  type: 'invoice' | 'receipt' | 'expense';
  iconOnly?: boolean;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use fallback values to prevent 'replace' or 'substring' errors on undefined
  const safeClientName = data?.clientName ? data.clientName.replace(/\s+/g, '_') : 'Client';
  const safeId = data?._id ? data._id.substring(0, 6) : '000000';
  const fileName = `${type}_${safeClientName}_${safeId}.pdf`;
  
  const tooltipText = `Download ${type === 'expense' ? 'Expense' : type === 'receipt' ? 'Receipt' : 'Invoice'}`;

  // Fallback UI to prevent hydration mismatch while respecting the iconOnly prop
  if (!isMounted) {
    return (
      <button disabled className={`flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900 cursor-not-allowed shadow-sm transition-colors duration-300 ${iconOnly ? 'p-2 rounded-lg' : 'px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-800'}`}>
        <Loader2 size={16} className={`animate-spin ${!iconOnly ? 'mr-2' : ''} opacity-50`} />
        {!iconOnly && 'Loading PDF...'}
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<DocumentTemplate data={data} type={type} />}
      fileName={fileName}
    >
      {({ loading }) => (
        <button 
          disabled={loading}
          title={tooltipText}
          className={`transition-colors duration-300 flex items-center justify-center shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950
            ${iconOnly 
              ? 'p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800' 
              : `px-4 py-2 rounded-xl text-sm font-medium ${
                  loading 
                    ? 'bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-gray-800' 
                    : 'bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700'
                }`
            }`}
        >
          {loading && iconOnly ? (
            <Loader2 size={16} className="animate-spin text-gray-400 dark:text-gray-500" />
          ) : (
            <Download size={16} className={`${!iconOnly ? 'mr-2' : ''} ${loading ? 'opacity-50' : 'text-gray-600 dark:text-gray-400'}`} />
          )}
          {!iconOnly && (loading ? 'Preparing...' : tooltipText)}
        </button>
      )}
    </PDFDownloadLink>
  );
}