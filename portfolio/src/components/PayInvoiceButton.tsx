'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import { Invoice } from '@/types';
import { RefreshCw } from 'lucide-react';

export default function PayInvoiceButton({ invoice }: { invoice: Invoice }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [conversionData, setConversionData] = useState<{ message: string; url: string } | null>(null);

  // States for currency conversion logic on manual M-Pesa payments
  const [kesRate, setKesRate] = useState<number | null>(null);
  const [isFetchingRate, setIsFetchingRate] = useState(false);

  useEffect(() => {
    // Only fetch the exchange rate if Paystack is disabled AND the currency is not already KES
    if (invoice.disablePaystack && invoice.currency !== 'KES') {
      const fetchRate = async () => {
        setIsFetchingRate(true);
        try {
          const res = await fetch(`/api/exchange-rate?base=${invoice.currency}`);
          if (res.ok) {
            const data = await res.json();
            if (data.rate) {
              setKesRate(data.rate);
            }
          }
        } catch (error) {
          console.error("Failed to fetch exchange rate for manual payment:", error);
        } finally {
          setIsFetchingRate(false);
        }
      };
      
      fetchRate();
    }
  }, [invoice.disablePaystack, invoice.currency]);

  // 1. EARLY RETURN: If Paystack is disabled, ONLY show manual payment instructions.
  if (invoice.disablePaystack) {
    const isForeignCurrency = invoice.currency !== 'KES';
    
    // Calculate estimated KES if we have a rate. We add a slight 1.5% buffer often used by gateways/banks for conversion.
    const estimatedKES = kesRate ? Math.ceil(invoice.amount * kesRate * 1.015) : null;

    return (
      <div className="p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700/50 mt-4 transition-colors">
        <p className="text-sm font-bold text-amber-900 dark:text-amber-400 mb-2">
          Manual Payment Required
        </p>
        <div className="text-sm text-amber-800 dark:text-amber-200 space-y-3">
          
          <div className="flex items-center gap-2">
            <p>
              Please pay <strong>{invoice.currency} {invoice.amount.toLocaleString()}</strong> via M-Pesa.
            </p>
          </div>

          {/* Render the KES Conversion if applicable */}
          {isForeignCurrency && (
            <div className="bg-amber-100/50 dark:bg-amber-900/40 p-3 rounded-lg border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase opacity-70 mb-1 flex items-center">
                  Estimated KES Equivalent
                  {isFetchingRate && <RefreshCw size={12} className="ml-2 animate-spin" />}
                </p>
                {estimatedKES ? (
                  <p className="font-bold text-lg">KSh {estimatedKES.toLocaleString('en-KE')}</p>
                ) : (
                  <p className="text-xs italic opacity-80">{isFetchingRate ? "Calculating..." : "Rate unavailable. Check current rates."}</p>
                )}
              </div>
              {kesRate && (
                <div className="text-right">
                  <p className="text-[10px] opacity-70">1 {invoice.currency} = {kesRate} KES</p>
                  <p className="text-[10px] opacity-70">+ ~1.5% buffer</p>
                </div>
              )}
            </div>
          )}

          <div className="bg-white/60 dark:bg-black/20 p-3 rounded-lg border border-amber-100 dark:border-amber-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p><strong>Send to Number:</strong> <span className="font-mono text-base">0728 036 420</span></p>
            <p className="text-xs opacity-80">Name: Brian Maina</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. STANDARD FLOW: If Paystack is NOT disabled, load the normal payment logic
  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: invoice.clientEmail,
          invoiceId: invoice._id, 
        }),
      });

      const data = await res.json();
      
      if (res.ok && data.checkoutUrl) {
        if (data.conversionMessage) {
          setConversionData({
            message: data.conversionMessage,
            url: data.checkoutUrl
          });
          setShowModal(true);
          setLoading(false);
        } else {
          window.location.href = data.checkoutUrl;
        }
      } else {
        alert(`Payment Error: ${data.error || data.message || 'Failed to initiate payment'}`);
        console.error("Checkout API Error Details:", data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert('An error occurred while connecting to the payment gateway.');
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (conversionData?.url) {
      setLoading(true);
      window.location.href = conversionData.url;
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setConversionData(null);
  };

  return (
    <>
      <Button onClick={handlePayment} disabled={loading && !showModal}>
        {loading && !showModal ? 'Processing...' : `Pay ${invoice.currency} ${invoice.amount}`}
      </Button>

      {/* Modern, Branded Tailwind Popup Modal */}
      {showModal && conversionData && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4 bg-black/40 dark:bg-black/70 backdrop-blur-sm transition-colors duration-300">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden animate-in slide-in-from-top-4 fade-in duration-200 transition-colors">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-3 transition-colors">
                Currency Conversion
              </h3>
              
              <div className="text-gray-600 dark:text-gray-300 mb-6 space-y-2 leading-relaxed transition-colors">
                {conversionData.message.split('\n').map((line, index) => {
                   if (!line.trim()) return null;
                   return <p key={index}>{line}</p>;
                })}
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 transition-colors">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceed}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium text-white dark:text-gray-900 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-xl shadow-md dark:shadow-none transition-colors disabled:opacity-50 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {loading ? 'Redirecting...' : 'Proceed to Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}