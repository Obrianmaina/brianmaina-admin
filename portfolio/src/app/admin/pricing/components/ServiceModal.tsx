'use client';

import React from 'react';
import { X } from 'lucide-react';
import { CatalogService } from '@/types';

interface ServiceModalProps {
  editingServiceId: string | null;
  serviceForm: CatalogService;
  setServiceForm: (form: CatalogService) => void;
  loading: boolean;
  onSave: () => void;
  onClose: () => void;
}

export default function ServiceModal({ editingServiceId, serviceForm, setServiceForm, loading, onSave, onClose }: ServiceModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl dark:shadow-none border border-transparent dark:border-gray-800 animate-in zoom-in-95 transition-colors duration-300">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 transition-colors">{editingServiceId ? 'Edit Service' : 'Add New Service'}</h3>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"><X size={24} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">Service Name</label>
            <input
              type="text"
              value={serviceForm.name}
              onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1 transition-colors"
              placeholder="e.g. Logo Design"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">Category</label>
            <input
              type="text"
              value={serviceForm.category}
              onChange={e => setServiceForm({ ...serviceForm, category: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1 transition-colors"
              placeholder="e.g. Branding"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            {(['KES', 'USD', 'EUR', 'GBP'] as const).map(curr => (
              <div key={curr}>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">Price ({curr})</label>
                <input
                  type="number"
                  value={serviceForm.prices[curr] || ''}
                  onChange={e => setServiceForm({ ...serviceForm, prices: { ...serviceForm.prices, [curr]: Number(e.target.value) } })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1 transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 transition-colors">
          <button onClick={onClose} className="px-5 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500">Cancel</button>
          <button onClick={onSave} disabled={loading} className="px-5 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
            {loading ? 'Saving...' : 'Save Service'}
          </button>
        </div>
      </div>
    </div>
  );
}