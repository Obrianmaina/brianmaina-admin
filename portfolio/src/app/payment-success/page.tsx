'use client';

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import DownloadDocumentBtn from "@/components/DownloadDocumentBtn";
import { DocumentData } from "@/components/pdf/DocumentTemplate";

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  
  const [invoiceData, setInvoiceData] = useState<DocumentData | null>(null);

  useEffect(() => {
    if (reference) {
      fetch(`/api/admin/accounts?id=${reference}`)
        .then(res => res.json())
        .then(data => {
            if (data && !data.error) {
                // Ensure we get the actual transaction object
                const txData = data.transaction || data;
                setInvoiceData(txData);
            }
        })
        .catch(err => console.error("Could not fetch invoice data for PDF", err));
    }
  }, [reference]);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
      <div className="flex flex-col items-center fade-in">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-500 mb-6">
          Thank you for your payment. Your transaction has been securely processed and your invoice is now paid.
        </p>
        
        {reference && (
          <div className="bg-gray-50 p-4 rounded-lg w-full mb-8 text-sm text-gray-600">
            <p><strong>Reference:</strong></p>
            <p className="break-all">{reference}</p>
          </div>
        )}

        {/* Added extra check to verify clientName exists before rendering */}
        {invoiceData && invoiceData.clientName && (
          <div className="mb-6 w-full flex justify-center">
            <DownloadDocumentBtn data={{ ...invoiceData, status: 'paid' }} type="receipt" />
          </div>
        )}

        <Link 
          href="/" 
          className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-all flex items-center justify-center shadow-lg shadow-teal-100"
        >
          Return to Portfolio <ArrowRight size={20} className="ml-2" />
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12 font-sans">
      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}