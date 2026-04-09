'use client';

import { useState, useMemo } from 'react';
import { CatalogService, CatalogBundle, CatalogPrices } from '@/types';

const defaultPrices: CatalogPrices = { KES: 0, USD: 0, EUR: 0, GBP: 0 };

type ModalState = {
  show: boolean;
  type: 'success' | 'error' | 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;
};

export function useCatalog(
  showModal: (type: ModalState['type'], title: string, message: string, onConfirm?: () => void) => void,
  closeModal: () => void
) {
  const [loading, setLoading] = useState(false);
  const [activeCatalogTab, setActiveCatalogTab] = useState<'kenyan' | 'international' | 'bundles'>('kenyan');
  const [intlCurrency, setIntlCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const [catalogServices, setCatalogServices] = useState<CatalogService[]>([]);
  const [catalogBundles, setCatalogBundles] = useState<CatalogBundle[]>([]);

  // Service modal state
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<CatalogService>({ name: '', category: '', prices: { ...defaultPrices } });

  // Bundle modal state
  const [showBundleModal, setShowBundleModal] = useState(false);
  const [editingBundleId, setEditingBundleId] = useState<string | null>(null);
  const [bundleForm, setBundleForm] = useState<CatalogBundle>({ name: '', description: '', includedServices: [], prices: { ...defaultPrices } });
  const [bundleServiceInput, setBundleServiceInput] = useState('');

  const fetchCatalog = async () => {
    try {
      const res = await fetch('/api/admin/catalog');
      if (res.ok) {
        const data = await res.json();
        setCatalogServices(data.services || []);
        setCatalogBundles(data.bundles || []);
        const uniqueCategories = Array.from(new Set(data.services.map((s: CatalogService) => s.category)));
        setExpandedCategories(uniqueCategories as string[]);
      }
    } catch (error) {
      console.error('Failed to fetch catalog', error);
    }
  };

  const groupedCategories = useMemo(() => {
    const groups: { [key: string]: CatalogService[] } = {};
    catalogServices.forEach(service => {
      if (!groups[service.category]) groups[service.category] = [];
      groups[service.category].push(service);
    });
    return Object.keys(groups).map(category => ({ category, items: groups[category] }));
  }, [catalogServices]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName) ? prev.filter(c => c !== categoryName) : [...prev, categoryName]
    );
  };

  const getCurrencySymbol = () => {
    if (activeCatalogTab === 'kenyan') return 'KES';
    if (intlCurrency === 'USD') return '$';
    if (intlCurrency === 'EUR') return '€';
    return '£';
  };

  const getDisplayPrice = (prices: CatalogPrices) => {
    if (activeCatalogTab === 'kenyan') return prices.KES.toLocaleString();
    return prices[intlCurrency].toLocaleString();
  };

  // Service modal actions
  const openNewServiceModal = () => {
    setEditingServiceId(null);
    setServiceForm({ name: '', category: '', prices: { ...defaultPrices } });
    setShowServiceModal(true);
  };

  const openEditServiceModal = (service: CatalogService) => {
    setEditingServiceId(service._id || null);
    setServiceForm(service);
    setShowServiceModal(true);
  };

  // Bundle modal actions
  const openNewBundleModal = () => {
    setEditingBundleId(null);
    setBundleForm({ name: '', description: '', includedServices: [], prices: { ...defaultPrices } });
    setBundleServiceInput('');
    setShowBundleModal(true);
  };

  const openEditBundleModal = (bundle: CatalogBundle) => {
    setEditingBundleId(bundle._id || null);
    setBundleForm(bundle);
    setBundleServiceInput('');
    setShowBundleModal(true);
  };

  const saveCatalogItem = async (type: 'service' | 'bundle') => {
    setLoading(true);
    const isService = type === 'service';
    const payload = isService ? { itemType: 'service', ...serviceForm } : { itemType: 'bundle', ...bundleForm };
    const editingId = isService ? editingServiceId : editingBundleId;

    try {
      const res = await fetch('/api/admin/catalog', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: editingId ? JSON.stringify({ id: editingId, ...payload }) : JSON.stringify(payload),
      });
      if (res.ok) {
        showModal('success', 'Success', `${isService ? 'Service' : 'Bundle'} saved successfully.`);
        if (isService) setShowServiceModal(false);
        else setShowBundleModal(false);
        fetchCatalog();
      } else {
        showModal('error', 'Error', 'Failed to save item.');
      }
    } catch {
      showModal('error', 'Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const deleteCatalogItem = (id: string, type: 'service' | 'bundle') => {
    showModal('confirm', 'Confirm Delete', `Are you sure you want to delete this ${type}?`, async () => {
      closeModal();
      setLoading(true);
      try {
        const res = await fetch('/api/admin/catalog', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, itemType: type }),
        });
        if (res.ok) {
          showModal('success', 'Deleted', 'Item deleted successfully.');
          fetchCatalog();
        } else {
          showModal('error', 'Error', 'Failed to delete item.');
        }
      } catch {
        showModal('error', 'Error', 'An error occurred.');
      } finally {
        setLoading(false);
      }
    });
  };

  return {
    // state
    loading,
    activeCatalogTab, setActiveCatalogTab,
    intlCurrency, setIntlCurrency,
    expandedCategories,
    catalogServices,
    catalogBundles,
    groupedCategories,
    showServiceModal, setShowServiceModal,
    editingServiceId,
    serviceForm, setServiceForm,
    showBundleModal, setShowBundleModal,
    editingBundleId,
    bundleForm, setBundleForm,
    bundleServiceInput, setBundleServiceInput,
    // actions
    fetchCatalog,
    toggleCategory,
    getCurrencySymbol,
    getDisplayPrice,
    openNewServiceModal,
    openEditServiceModal,
    openNewBundleModal,
    openEditBundleModal,
    saveCatalogItem,
    deleteCatalogItem,
  };
}
