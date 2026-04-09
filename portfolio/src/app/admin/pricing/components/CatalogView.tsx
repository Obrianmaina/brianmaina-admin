'use client';

import React from 'react';
import { Plus, Trash2, Edit, ChevronDown } from 'lucide-react';
import { CatalogService, CatalogBundle, CatalogPrices } from '@/types';
import DownloadCatalogButton from '@/components/DownloadCatalogButton';

interface GroupedCategory {
  category: string;
  items: CatalogService[];
}

interface CatalogViewProps {
  activeCatalogTab: 'kenyan' | 'international' | 'bundles';
  setActiveCatalogTab: (tab: 'kenyan' | 'international' | 'bundles') => void;
  intlCurrency: 'USD' | 'EUR' | 'GBP';
  setIntlCurrency: (c: 'USD' | 'EUR' | 'GBP') => void;
  expandedCategories: string[];
  groupedCategories: GroupedCategory[];
  catalogBundles: CatalogBundle[];
  getCurrencySymbol: () => string;
  getDisplayPrice: (prices: CatalogPrices) => string;
  toggleCategory: (category: string) => void;
  openNewServiceModal: () => void;
  openEditServiceModal: (service: CatalogService) => void;
  openNewBundleModal: () => void;
  openEditBundleModal: (bundle: CatalogBundle) => void;
  deleteCatalogItem: (id: string, type: 'service' | 'bundle') => void;
}

export default function CatalogView({
  activeCatalogTab, setActiveCatalogTab,
  intlCurrency, setIntlCurrency,
  expandedCategories,
  groupedCategories,
  catalogBundles,
  getCurrencySymbol, getDisplayPrice,
  toggleCategory,
  openNewServiceModal, openEditServiceModal,
  openNewBundleModal, openEditBundleModal,
  deleteCatalogItem,
}: CatalogViewProps) {
  return (
    <div className="fade-in bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Manage Base Price List</h2>
        <div className="flex flex-wrap items-center gap-4">
          <DownloadCatalogButton currency={activeCatalogTab === 'kenyan' ? 'KES' : intlCurrency} />
          <button
            onClick={activeCatalogTab === 'bundles' ? openNewBundleModal : openNewServiceModal}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <Plus size={18} />
            <span>Add New {activeCatalogTab === 'bundles' ? 'Bundle' : 'Service'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-gray-200 dark:border-gray-800 mb-6 pb-2 transition-colors">
        {(['kenyan', 'international', 'bundles'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveCatalogTab(tab)}
            className={`pb-2 px-3 font-medium capitalize transition-colors focus:outline-none ${activeCatalogTab === tab ? 'border-b-2 border-teal-500 text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
          >
            {tab === 'kenyan' ? 'Kenyan (KES)' : tab === 'international' ? 'International' : 'Bundled Services'}
          </button>
        ))}
      </div>

      {/* International Currency Picker */}
      {activeCatalogTab === 'international' && (
        <div className="flex gap-2 mb-6">
          {(['USD', 'EUR', 'GBP'] as const).map(curr => (
            <button
              key={curr}
              onClick={() => setIntlCurrency(curr)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${intlCurrency === curr ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              {curr}
            </button>
          ))}
        </div>
      )}

      {/* Services List */}
      {(activeCatalogTab === 'kenyan' || activeCatalogTab === 'international') && (
        <div className="space-y-4">
          {groupedCategories.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8 transition-colors">No services found. Click &quot;Add New Service&quot; to start.</p>
          ) : (
            groupedCategories.map(group => (
              <div key={group.category} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm dark:shadow-none transition-colors">
                <button
                  onClick={() => toggleCategory(group.category)}
                  className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors">{group.category}</h3>
                  <ChevronDown
                    size={20}
                    className={`text-gray-500 dark:text-gray-400 transform transition-transform ${expandedCategories.includes(group.category) ? 'rotate-180' : ''}`}
                  />
                </button>

                {expandedCategories.includes(group.category) && (
                  <div>
                    {group.items.map(item => (
                      <div key={item._id} className="flex justify-between items-center p-4 border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <span className="font-medium text-gray-700 dark:text-gray-300 transition-colors">{item.name}</span>
                        <div className="flex items-center gap-4 sm:gap-6">
                          <span className="font-mono font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-md transition-colors">
                            {getCurrencySymbol()} {getDisplayPrice(item.prices)}
                          </span>
                          <div className="flex gap-2">
                            <button onClick={() => openEditServiceModal(item)} className="text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded" title="Edit Price">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => deleteCatalogItem(item._id!, 'service')} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded" title="Delete Item">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Bundles Grid */}
      {activeCatalogTab === 'bundles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogBundles.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 py-8 col-span-full text-center transition-colors">No bundles found. Click &quot;Add New Bundle&quot; to start.</p>
          ) : (
            catalogBundles.map(bundle => (
              <div key={bundle._id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-teal-900/10 transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 transition-colors">{bundle.name}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => openEditBundleModal(bundle)} className="text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded p-1 -m-1"><Edit size={16} /></button>
                    <button onClick={() => deleteCatalogItem(bundle._id!, 'bundle')} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1 -m-1"><Trash2 size={16} /></button>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow transition-colors">{bundle.description}</p>

                <div className="mb-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg transition-colors">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-colors">Includes:</h4>
                  <ul className="space-y-2">
                    {bundle.includedServices.map((service, idx) => (
                      <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400 shrink-0"></div>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide transition-colors">Starting at</span>
                    <span className="text-2xl font-bold text-teal-600 dark:text-teal-400 transition-colors">KES {bundle.prices.KES.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}