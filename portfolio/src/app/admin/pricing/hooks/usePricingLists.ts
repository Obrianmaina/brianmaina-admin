'use client';

import { useState } from 'react';
import { PricingList, PricingItem } from '@/types';

type ModalState = {
  show: boolean;
  type: 'success' | 'error' | 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;
};

export function usePricingLists(
  showModal: (type: ModalState['type'], title: string, message: string, onConfirm?: () => void) => void,
  closeModal: () => void
) {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [pricingLists, setPricingLists] = useState<PricingList[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [tax, setTax] = useState(0);
  const [items, setItems] = useState<PricingItem[]>([{ name: '', description: '', unitPrice: 0, quantity: 1, total: 0 }]);

  const fetchPricingLists = async () => {
    try {
      const res = await fetch('/api/admin/pricing');
      if (res.ok) {
        const data = await res.json();
        setPricingLists(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch', error);
    }
  };

  const resetEditor = () => {
    setEditingId(null);
    setTitle('');
    setClientName('');
    setClientEmail('');
    setCurrency('USD');
    setTax(0);
    setItems([{ name: '', description: '', unitPrice: 0, quantity: 1, total: 0 }]);
  };

  const handleEdit = (list: PricingList) => {
    setEditingId(list._id ?? null);
    setTitle(list.title);
    setClientName(list.clientName);
    setClientEmail(list.clientEmail);
    setCurrency(list.currency);
    setTax(list.tax);
    setItems(list.items);
    setView('editor');
  };

  const handleItemChange = (index: number, field: keyof PricingItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    newItems[index].total = newItems[index].unitPrice * newItems[index].quantity;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { name: '', description: '', unitPrice: 0, quantity: 1, total: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const totalAmount = subtotal + subtotal * (tax / 100);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = { title, clientName, clientEmail, currency, tax, items, subtotal, totalAmount };
      const res = await fetch('/api/admin/pricing', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });
      if (res.ok) {
        showModal('success', 'Saved', editingId ? 'Pricing list updated successfully.' : 'Pricing list saved successfully.');
        resetEditor();
        setView('list');
        fetchPricingLists();
      } else {
        showModal('error', 'Error', 'Failed to save pricing list.');
      }
    } catch {
      showModal('error', 'Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (list: PricingList) => {
    showModal('confirm', 'Delete Pricing List', `Are you sure you want to delete "${list.title}"? This cannot be undone.`, async () => {
      closeModal();
      setLoading(true);
      try {
        const res = await fetch('/api/admin/pricing', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: list._id }),
        });
        if (res.ok) {
          setPricingLists(prev => prev.filter(p => p._id !== list._id));
          showModal('success', 'Deleted', 'Pricing list deleted successfully.');
        } else {
          showModal('error', 'Error', 'Failed to delete pricing list.');
        }
      } catch {
        showModal('error', 'Error', 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    });
  };

  const handleSendEmail = async (list: PricingList) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pricing/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId: list._id }),
      });
      if (res.ok) {
        setPricingLists(prev =>
          prev.map(p => p._id === list._id ? { ...p, status: 'sent' as const } : p)
        );
        showModal('success', 'Sent', `Pricing list sent to ${list.clientEmail}`);
      } else {
        showModal('error', 'Error', 'Failed to send email.');
      }
    } catch {
      showModal('error', 'Error', 'Failed to send email.');
    } finally {
      setLoading(false);
    }
  };

  return {
    // state
    view, setView,
    pricingLists,
    loading,
    editingId,
    title, setTitle,
    clientName, setClientName,
    clientEmail, setClientEmail,
    currency, setCurrency,
    tax, setTax,
    items,
    subtotal,
    totalAmount,
    // actions
    fetchPricingLists,
    resetEditor,
    handleEdit,
    handleItemChange,
    addItem,
    removeItem,
    handleSave,
    handleDelete,
    handleSendEmail,
  };
}
