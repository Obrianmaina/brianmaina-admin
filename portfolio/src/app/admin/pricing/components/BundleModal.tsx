'use client';

import React from 'react';
import { X } from 'lucide-react';
import { CatalogBundle } from '@/types';

interface BundleModalProps {
  editingBundleId: string | null;
  bundleForm: CatalogBundle;
  setBundleForm: (form: CatalogBundle) => void;
  bundleServiceInput: string;
  setBundleServiceInput: (v: string) => void;
  loading: boolean;
  onSave: () => void;
  onClose: () => void;
}

export default function BundleModal({
  editingBundleId,
  bundleForm, setBundleForm,
  bundleServiceInput, setBundleServiceInput,
  loading, onSave, onClose,
}: BundleModalProps) {

  const addService = () => {
    if (bundleServiceInput.trim()) {
      setBundleForm({ ...bundleForm, includedServices: [...bundleForm.includedServices, bundleServiceInput.trim()] });
      setBundleServiceInput('');
    }
  };

  const removeService = (idx: number) => {
    setBundleForm({ ...bundleForm, includedServices: bundleForm.includedServices.filter((_, i) => i !== idx) });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl dark:shadow-none border border-transparent dark:border-gray-800 animate-in zoom-in-95 max-h-[90vh] flex flex-col transition-colors duration-300">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shrink-0 transition-colors">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 transition-colors">{editingBundleId ? 'Edit Bundle' : 'Add New Bundle'}</h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"><X size={24} /></button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">Bundle Name</label>
            <input
              type="text"
              value={bundleForm.name}
              onChange={e => setBundleForm({ ...bundleForm, name: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1 transition-colors"
              placeholder="e.g. Startup Package"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">Description</label>
            <textarea
              value={bundleForm.description}
              onChange={e => setBundleForm({ ...bundleForm, description: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1 transition-colors resize-y"
              placeholder="Brief summary of this package"
              rows={2}
            />
          </div>

          {/* Included Services */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block transition-colors">Included Services</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={bundleServiceInput}
                onChange={e => setBundleServiceInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addService(); } }}
                className="flex-grow p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                placeholder="Type a service and press enter"
              />
              <button onClick={addService} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {bundleForm.includedServices.map((service, idx) => (
                <span key={idx} className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors">
                  {service}
                  <button onClick={() => removeService(idx)} className="hover:text-red-500 dark:hover:text-red-400 ml-1 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"><X size={14} /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800 transition-colors">
            {(['KES', 'USD', 'EUR', 'GBP'] as const).map(curr => (
              <div key={curr}>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">Price ({curr})</label>
                <input
                  type="number"
                  value={bundleForm.prices[curr] || ''}
                  onChange={e => setBundleForm({ ...bundleForm, prices: { ...bundleForm.prices, [curr]: Number(e.target.value) } })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1 transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 shrink-0 transition-colors">
          <button onClick={onClose} className="px-5 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">Cancel</button>
          <button onClick={onSave} disabled={loading} className="px-5 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
            {loading ? 'Saving...' : 'Save Bundle'}
          </button>
        </div>
      </div>
    </div>
  );
}