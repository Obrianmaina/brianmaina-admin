'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import AdminModal from '@/components/AdminModal';
import ServiceModal from './components/ServiceModal';
import BundleModal from './components/BundleModal';
import CatalogView from './components/CatalogView';
import PricingListView from './components/PricingListView';

import { usePricingLists } from './hooks/usePricingLists';
import { useCatalog } from './hooks/useCatalog';

type ModalState = {
  show: boolean;
  type: 'success' | 'error' | 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;
};

export default function PricingPage() {
  const router = useRouter();
  const [activeDashboardTab, setActiveDashboardTab] = useState<'client-lists' | 'base-catalog'>('client-lists');
  const [modal, setModal] = useState<ModalState>({ show: false, type: 'success', title: '', message: '' });

  const showModal = (type: ModalState['type'], title: string, message: string, onConfirm?: () => void) => {
    setModal({ show: true, type, title, message, onConfirm });
  };
  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

  const pricingLists = usePricingLists(showModal, closeModal);
  const catalog = useCatalog(showModal, closeModal);

  useEffect(() => {
    pricingLists.fetchPricingLists();
    catalog.fetchCatalog();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6 relative transition-colors duration-300">
      <div className="max-w-6xl mx-auto">

        {/* Header & Top-level Tab Navigation */}
        <div className="mb-8">
          <button onClick={() => router.push('/admin')} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md p-1 -ml-1">
            <ArrowLeft size={20} className="mr-2" /> Back to Hub
          </button>

          <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800 transition-colors">
            {(['client-lists', 'base-catalog'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveDashboardTab(tab)}
                className={`pb-3 px-2 font-medium text-lg transition-colors focus:outline-none ${
                  activeDashboardTab === tab 
                    ? 'border-b-2 border-teal-500 text-teal-700 dark:text-teal-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {tab === 'client-lists' ? 'Client Quotes & Invoices' : 'Base Price Catalog'}
              </button>
            ))}
          </div>
        </div>

        {/* Client Pricing Lists */}
        {activeDashboardTab === 'client-lists' && (
          <PricingListView
            pricingLists={pricingLists.pricingLists}
            view={pricingLists.view}
            setView={pricingLists.setView}
            editingId={pricingLists.editingId}
            title={pricingLists.title}
            setTitle={pricingLists.setTitle}
            clientName={pricingLists.clientName}
            setClientName={pricingLists.setClientName}
            clientEmail={pricingLists.clientEmail}
            setClientEmail={pricingLists.setClientEmail}
            currency={pricingLists.currency}
            setCurrency={pricingLists.setCurrency}
            tax={pricingLists.tax}
            setTax={pricingLists.setTax}
            items={pricingLists.items}
            subtotal={pricingLists.subtotal}
            totalAmount={pricingLists.totalAmount}
            loading={pricingLists.loading}
            resetEditor={pricingLists.resetEditor}
            handleEdit={pricingLists.handleEdit}
            handleItemChange={pricingLists.handleItemChange}
            addItem={pricingLists.addItem}
            removeItem={pricingLists.removeItem}
            handleSave={pricingLists.handleSave}
            handleDelete={pricingLists.handleDelete}
            handleSendEmail={pricingLists.handleSendEmail}
          />
        )}

        {/* Base Catalog */}
        {activeDashboardTab === 'base-catalog' && (
          <CatalogView
            activeCatalogTab={catalog.activeCatalogTab}
            setActiveCatalogTab={catalog.setActiveCatalogTab}
            intlCurrency={catalog.intlCurrency}
            setIntlCurrency={catalog.setIntlCurrency}
            expandedCategories={catalog.expandedCategories}
            groupedCategories={catalog.groupedCategories}
            catalogBundles={catalog.catalogBundles}
            getCurrencySymbol={catalog.getCurrencySymbol}
            getDisplayPrice={catalog.getDisplayPrice}
            toggleCategory={catalog.toggleCategory}
            openNewServiceModal={catalog.openNewServiceModal}
            openEditServiceModal={catalog.openEditServiceModal}
            openNewBundleModal={catalog.openNewBundleModal}
            openEditBundleModal={catalog.openEditBundleModal}
            deleteCatalogItem={catalog.deleteCatalogItem}
          />
        )}

      </div>

      {/* Global Modal */}
      <AdminModal modal={modal} close={closeModal} />

      {/* Service Modal */}
      {catalog.showServiceModal && (
        <ServiceModal
          editingServiceId={catalog.editingServiceId}
          serviceForm={catalog.serviceForm}
          setServiceForm={catalog.setServiceForm}
          loading={catalog.loading}
          onSave={() => catalog.saveCatalogItem('service')}
          onClose={() => catalog.setShowServiceModal(false)}
        />
      )}

      {/* Bundle Modal */}
      {catalog.showBundleModal && (
        <BundleModal
          editingBundleId={catalog.editingBundleId}
          bundleForm={catalog.bundleForm}
          setBundleForm={catalog.setBundleForm}
          bundleServiceInput={catalog.bundleServiceInput}
          setBundleServiceInput={catalog.setBundleServiceInput}
          loading={catalog.loading}
          onSave={() => catalog.saveCatalogItem('bundle')}
          onClose={() => catalog.setShowBundleModal(false)}
        />
      )}
    </main>
  );
}