"use client";

import { useState, useEffect } from "react";
import DownloadCatalogButton from "@/components/DownloadCatalogButton";
import { CatalogService, CatalogBundle } from "@/types";
import Navbar from "@/components/Navbar"; 

export default function PublicPricingPage() {
  const [services, setServices] = useState<CatalogService[]>([]);
  const [bundles, setBundles] = useState<CatalogBundle[]>([]);
  const [currency, setCurrency] = useState<"KES" | "USD" | "EUR" | "GBP">("KES");
  const [loadingPrices, setLoadingPrices] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await fetch('/api/admin/catalog');
        if (res.ok) {
          const data = await res.json();
          setServices(data.services || []);
          setBundles(data.bundles || []);
        }
      } catch (error) {
        console.error("Failed to load pricing", error);
      } finally {
        setLoadingPrices(false);
      }
    };
    fetchPricing();
  }, []);

  const groupedCategories = services.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, CatalogService[]>);

  const getSymbol = (curr: string) => {
    if (curr === 'KES') return 'KES ';
    if (curr === 'USD') return '$';
    if (curr === 'EUR') return '€';
    return '£';
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-20 transition-colors duration-300">
      <Navbar /> 
      
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-50 transition-colors">Investment & Pricing</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-colors">
            Transparent pricing for high quality design and development services. Choose your preferred currency below.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <div className="flex bg-white dark:bg-gray-900 rounded-full p-1 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
              {(["KES", "USD", "EUR", "GBP"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                    currency === c 
                      ? "bg-teal-600 text-white shadow-md" 
                      : "text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            
            <DownloadCatalogButton currency={currency} />
          </div>
        </div>

        {loadingPrices ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 transition-colors">Loading catalog...</div>
        ) : (
          <div className="space-y-16">
            
            {/* Value Bundles Grid */}
            {bundles.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-l-4 border-teal-500 pl-4 transition-colors">Value Packages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bundles.map((bundle) => (
                    <div key={bundle._id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-teal-900/10 transition-all flex flex-col">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2 transition-colors">{bundle.name}</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 flex-grow transition-colors">{bundle.description}</p>
                      
                      <div className="mb-6">
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 transition-colors">What is included:</p>
                        <ul className="space-y-2">
                          {bundle.includedServices.map((service, idx) => (
                            <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2 transition-colors">
                              <span className="text-teal-500 dark:text-teal-400 mt-0.5">•</span>
                              <span>{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto transition-colors">
                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Starting at</p>
                        <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 transition-colors">
                          {getSymbol(currency)}{bundle.prices[currency].toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Individual Services */}
            {Object.keys(groupedCategories).length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-l-4 border-teal-500 pl-4 transition-colors">Individual Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {Object.entries(groupedCategories).map(([category, items]) => (
                    <div key={category} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                      <h4 className="text-lg font-bold text-teal-800 dark:text-teal-400 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800 transition-colors">{category}</h4>
                      <div className="space-y-4">
                        {items.map(item => (
                          <div key={item._id} className="flex justify-between items-center group">
                            <span className="text-gray-700 dark:text-gray-300 text-sm pr-4 transition-colors">{item.name}</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-md group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                              {getSymbol(currency)}{item.prices[currency].toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}