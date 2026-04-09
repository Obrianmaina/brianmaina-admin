"use client";

import { Building2 } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import { useCorporateCMS } from "./hooks/useCorporateCMS";
import CorporateHeader from "./components/CorporateHeader";
import CorporateForm from "./components/CorporateForm";
import CompanyCard from "./components/CompanyCard";

export default function CorporateCMS() {
  const cms = useCorporateCMS();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-none border border-gray-100 dark:border-gray-800 fade-in transition-colors duration-300">

        <CorporateHeader
          isFormOpen={cms.isFormOpen}
          isReordering={cms.isReordering}
          onAddCompany={cms.handleOpenAddCompany}
          onCancelForm={cms.handleCancelForm}
          onStartReorder={() => cms.setIsReordering(true)}
          onCancelReorder={() => cms.setIsReordering(false)}
          onSaveOrder={cms.handleSaveOrder}
          fetchCompanies={cms.fetchCompanies}
        />

        <div className="flex items-center mb-8 border-l-4 border-violet-500 pl-4 transition-colors">
          <Building2 size={28} className="text-violet-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Corporate Manager</h2>
        </div>

        {cms.isFormOpen && (
          <CorporateForm
            formMode={cms.formMode}
            formData={cms.formData}
            setFormData={cms.setFormData}
            showCompanyFields={cms.showCompanyFields}
            showProjectFields={cms.showProjectFields}
            onSubmit={cms.handleSubmit}
          />
        )}

        {cms.loading ? (
          <p className="text-gray-500 dark:text-gray-400 transition-colors">Loading corporate profiles...</p>
        ) : (
          <div className="space-y-6">
            {cms.companies.map((company, idx) => (
              <CompanyCard
                key={company._id}
                company={company}
                idx={idx}
                isReordering={cms.isReordering}
                draggedIndex={cms.draggedIndex}
                dragOverIndex={cms.dragOverIndex}
                onDragStart={cms.handleDragStart}
                onDragEnter={cms.handleDragEnter}
                onDragEnd={cms.handleDragEnd}
                onDrop={cms.handleDrop}
                onEditCompany={cms.handleOpenEditCompany}
                onAddProject={cms.handleOpenAddProject}
                onEditProject={cms.handleOpenEditProject}
                onDeleteCompany={cms.handleDeleteCompany}
                onDeleteProject={cms.handleDeleteProject}
              />
            ))}

            {cms.companies.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
                No corporate profiles found. Add one to get started.
              </div>
            )}
          </div>
        )}
      </div>

      <AdminModal modal={cms.modal} close={cms.closeModal} />
    </main>
  );
}