'use client';

import React from 'react';
import { ArrowLeft, Plus, Trash2, Send, Save, Edit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PricingList, PricingItem } from '@/types';

interface PricingListViewProps {
  // list view
  pricingLists: PricingList[];
  // editor state
  view: 'list' | 'editor';
  setView: (v: 'list' | 'editor') => void;
  editingId: string | null;
  title: string;
  setTitle: (v: string) => void;
  clientName: string;
  setClientName: (v: string) => void;
  clientEmail: string;
  setClientEmail: (v: string) => void;
  currency: string;
  setCurrency: (v: string) => void;
  tax: number;
  setTax: (v: number) => void;
  items: PricingItem[];
  subtotal: number;
  totalAmount: number;
  loading: boolean;
  // actions
  resetEditor: () => void;
  handleEdit: (list: PricingList) => void;
  handleItemChange: (index: number, field: keyof PricingItem, value: string | number) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  handleSave: () => void;
  handleDelete: (list: PricingList) => void;
  handleSendEmail: (list: PricingList) => void;
}

const statusBadge = (status: string = 'Draft') => {
  const isSent = status === 'sent';
  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full mb-4 inline-block transition-colors ${isSent ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>
      {isSent ? 'Sent' : status === 'draft' ? 'Draft' : status}
    </span>
  );
};

export default function PricingListView({
  pricingLists,
  view, setView,
  editingId,
  title, setTitle,
  clientName, setClientName,
  clientEmail, setClientEmail,
  currency, setCurrency,
  tax, setTax,
  items,
  subtotal, totalAmount,
  loading,
  resetEditor, handleEdit, handleItemChange,
  addItem, removeItem, handleSave, handleDelete, handleSendEmail,
}: PricingListViewProps) {

  if (view === 'list') {
    return (
      <div className="transition-colors duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Client Pricing Lists</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => { resetEditor(); setView('editor'); }}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-500 dark:hover:border-teal-500 rounded-2xl flex flex-col items-center justify-center min-h-[250px] cursor-pointer transition-colors group"
          >
            <Plus size={32} className="text-gray-400 dark:text-gray-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 mb-4 transition-colors" />
            <p className="font-semibold text-gray-600 dark:text-gray-400 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">Create New List</p>
          </div>

          {pricingLists.map((list) => (
            <Card key={list._id} className="overflow-hidden flex flex-col h-full hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-teal-900/10 transition-shadow p-6 bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800">
              <div className="flex-grow">
                {statusBadge(list.status)}
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-1 transition-colors">{list.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors">For: {list.clientName}</p>
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-4 transition-colors">{list.currency} {list.totalAmount.toFixed(2)}</div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto transition-colors">
                <div className="flex items-center gap-4">
                  <button onClick={() => handleSendEmail(list)} disabled={loading} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center text-sm font-medium transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1">
                    <Send size={16} className="mr-1" /> Send
                  </button>
                  <button onClick={() => handleEdit(list)} className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded p-1">
                    <Edit size={16} className="mr-1" /> Edit
                  </button>
                </div>
                <button onClick={() => handleDelete(list)} disabled={loading} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center text-sm font-medium transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1">
                  <Trash2 size={16} className="mr-1" /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Editor view
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-none border border-gray-100 dark:border-gray-800 fade-in transition-colors duration-300">
      <button onClick={() => { resetEditor(); setView('list'); }} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 rounded p-1 -ml-1">
        <ArrowLeft size={20} className="mr-2" /> Back to Lists
      </button>
      <h2 className="text-3xl font-bold mb-8 border-l-4 border-teal-500 pb-2 px-4 text-gray-800 dark:text-gray-50 transition-colors">
        {editingId ? 'Edit Pricing List' : 'New Pricing List'}
      </h2>

      <div className="space-y-6">
        {/* Client Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 transition-colors">Project / List Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1 transition-colors" placeholder="e.g. Website Redesign" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 transition-colors">Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1 transition-colors">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="KES">KES</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 transition-colors">Client Name</label>
            <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1 transition-colors" placeholder="Client Name" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 transition-colors">Client Email</label>
            <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 mt-1 transition-colors" placeholder="client@example.com" />
          </div>
        </div>

        {/* Line Items */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 transition-colors">
          <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100 transition-colors">Line Items</h3>
          {items.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 mb-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl relative group border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="flex-grow">
                <input type="text" placeholder="Item Name" value={item.name} onChange={e => handleItemChange(index, 'name', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg mb-2 outline-none focus:ring-2 focus:ring-teal-500 transition-colors" />
                <input type="text" placeholder="Short Description (optional)" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500 transition-colors" />
              </div>
              <div className="w-full md:w-32">
                <input type="number" placeholder="Price" value={item.unitPrice || ''} onChange={e => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))} className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 transition-colors" />
              </div>
              <div className="w-full md:w-24">
                <input type="number" placeholder="Qty" value={item.quantity || ''} onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value))} className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 transition-colors" />
              </div>
              <div className="w-full md:w-32 flex items-center font-bold text-gray-700 dark:text-gray-300 transition-colors">
                {currency} {item.total.toFixed(2)}
              </div>
              <button onClick={() => removeItem(index)} className="text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button onClick={addItem} className="text-teal-600 dark:text-teal-400 font-bold flex items-center hover:text-teal-800 dark:hover:text-teal-300 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded p-1">
            <Plus size={18} className="mr-1" /> Add Item
          </button>
        </div>

        {/* Totals */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col items-end transition-colors">
          <div className="w-full md:w-1/2 space-y-2 text-right text-gray-700 dark:text-gray-300 transition-colors">
            <div className="flex justify-between"><span>Subtotal:</span> <span>{currency} {subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between items-center">
              <span>Tax (%):</span>
              <input type="number" value={tax} onChange={e => setTax(parseFloat(e.target.value) || 0)} className="w-20 p-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 rounded text-right outline-none focus:ring-2 focus:ring-teal-500 transition-colors" />
            </div>
            <div className="flex justify-between font-bold text-xl text-gray-900 dark:text-gray-100 pt-2 border-t border-gray-200 dark:border-gray-800 transition-colors">
              <span>Total:</span> <span>{currency} {totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex gap-4 pt-6 transition-colors">
          <button onClick={handleSave} disabled={loading} className="flex-1 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 flex justify-center items-center transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-sm">
            <Save size={18} className="mr-2" />
            {loading ? 'Saving...' : editingId ? 'Update Pricing List' : 'Save Pricing List'}
          </button>
        </div>
      </div>
    </div>
  );
}