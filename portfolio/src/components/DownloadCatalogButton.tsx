'use client';

import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CatalogPDF } from './CatalogPDF';
import { Download } from 'lucide-react';
import { CatalogService, CatalogBundle } from '@/types';

interface Props {
  currency: 'KES' | 'USD' | 'EUR' | 'GBP';
  buttonText?: string;
}

export default function DownloadCatalogButton({ currency, buttonText = "Download Price List" }: Props) {
  const [services, setServices] = useState<CatalogService[]>([]);
  const [bundles, setBundles] = useState<CatalogBundle[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Fetch the live data from your database
    fetch('/api/admin/catalog')
      .then(res => res.json())
      .then(data => {
        setServices(data.services || []);
        setBundles(data.bundles || []);
      });
  }, []);

  // PDFDownloadLink only works on the client side
  if (!isClient || services.length === 0) {
    return (
      <button disabled className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-lg font-medium transition-colors cursor-not-allowed">
        <Download size={18} /> Loading PDF...
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<CatalogPDF services={services} bundles={bundles} currency={currency} />}
      fileName={`Brian_Maina_Pricing_${currency}.pdf`}
      className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white px-4 py-2 rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-sm"
    >
      {({ loading }) => (
        <>
          <Download size={18} />
          <span>{loading ? 'Generating PDF...' : buttonText}</span>
        </>
      )}
    </PDFDownloadLink>
  );
}