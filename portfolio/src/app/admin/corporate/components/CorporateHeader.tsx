import { ArrowLeft, Plus, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  isFormOpen: boolean;
  isReordering: boolean;
  onAddCompany: () => void;
  onCancelForm: () => void;
  onStartReorder: () => void;
  onCancelReorder: () => void;
  onSaveOrder: () => void;
  fetchCompanies: () => void;
};

export default function CorporateHeader({
  isFormOpen,
  isReordering,
  onAddCompany,
  onCancelForm,
  onStartReorder,
  onCancelReorder,
  onSaveOrder,
  fetchCompanies,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mb-8 transition-colors duration-300">
      <button
        onClick={() => router.push("/admin")}
        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md p-1 -ml-1"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to Hub
      </button>

      <div className="flex flex-wrap gap-2">
        {!isFormOpen && !isReordering && (
          <button
            onClick={onStartReorder}
            className="flex items-center border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reorder
          </button>
        )}

        {isReordering && (
          <>
            <button
              onClick={() => { onCancelReorder(); fetchCompanies(); }}
              className="flex items-center border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={onSaveOrder}
              className="flex items-center bg-violet-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-violet-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <Save size={18} className="mr-2" /> Save Order
            </button>
          </>
        )}

        {!isReordering && (
          <>
            {isFormOpen ? (
              <button
                onClick={onCancelForm}
                className="flex items-center border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <X size={16} className="mr-1" /> Cancel
              </button>
            ) : (
              <button
                onClick={onAddCompany}
                className="flex items-center bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                <Plus size={18} className="mr-2" /> Add Company
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}