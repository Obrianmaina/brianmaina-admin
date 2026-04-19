"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from "lucide-react";
import AdminModal from "@/components/AdminModal";

interface AppItem {
  _id?: string;
  name: string;
  description: string;
  image: string;
  link: string;
  isVisible: boolean;
}

export default function ManageAppsPage() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState<AppItem | null>(null);
  
  const [modal, setModal] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ show: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/apps");
      const data = await res.json();
      if (data.success) {
        setApps(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch apps", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showModal = (type: 'success' | 'error' | 'confirm', title: string, message: string, onConfirm?: () => void) => {
    setModal({ show: true, type, title, message, onConfirm });
  };

  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentApp) return;

    const method = currentApp._id ? "PUT" : "POST";
    
    try {
      const res = await fetch("/api/admin/apps", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentApp),
      });
      const data = await res.json();
      
      if (data.success) {
        showModal("success", "Success", currentApp._id ? "App updated successfully." : "App added successfully.");
        setIsFormOpen(false);
        setCurrentApp(null);
        fetchApps();
      } else {
        showModal("error", "Error", data.message || "Something went wrong");
      }
    } catch (error) {
      showModal("error", "Error", "Failed to save app.");
    }
  };

  const handleDelete = (id: string) => {
    showModal("confirm", "Delete App", "Are you sure you want to delete this app? This action cannot be undone.", async () => {
      try {
        const res = await fetch(`/api/admin/apps?id=${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          fetchApps();
          closeModal();
        } else {
          showModal("error", "Error", data.message || "Failed to delete");
        }
      } catch (error) {
        showModal("error", "Error", "Failed to delete app.");
      }
    });
  };

  const toggleVisibility = async (app: AppItem) => {
    try {
      const updatedApp = { ...app, isVisible: !app.isVisible };
      const res = await fetch("/api/admin/apps", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedApp),
      });
      if (res.ok) {
        fetchApps();
      }
    } catch (error) {
      console.error("Failed to toggle visibility");
    }
  };

  const openNewForm = () => {
    setCurrentApp({ name: "", description: "", image: "", link: "", isVisible: true });
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Apps</h1>
          <button
            onClick={openNewForm}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>Add New App</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {apps.map((app) => (
              <div key={app._id} className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col ${!app.isVisible ? 'opacity-60' : ''}`}>
                <div className="h-48 w-full relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={app.image} alt={app.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => toggleVisibility(app)}
                      className="p-2 bg-white/90 dark:bg-gray-900/90 rounded-full text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors shadow-sm"
                      title={app.isVisible ? "Hide from public" : "Show to public"}
                    >
                      {app.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{app.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">{app.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                    <a href={app.link} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 text-sm font-medium hover:underline">
                      Test Link
                    </a>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => { setCurrentApp(app); setIsFormOpen(true); }}
                        className="text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => app._id && handleDelete(app._id)}
                        className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {apps.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                No apps found. Click &quot;Add New App&quot; to get started.
              </div>
            )}
          </div>
        )}
      </div>

      {isFormOpen && currentApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentApp._id ? "Edit App" : "Add New App"}
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">App Name</label>
                <input 
                  type="text" 
                  required 
                  value={currentApp.name}
                  onChange={(e) => setCurrentApp({...currentApp, name: e.target.value})}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL (Cloudinary Link)</label>
                <input 
                  type="url" 
                  required 
                  value={currentApp.image}
                  onChange={(e) => setCurrentApp({...currentApp, image: e.target.value})}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea 
                  required 
                  rows={4}
                  value={currentApp.description}
                  onChange={(e) => setCurrentApp({...currentApp, description: e.target.value})}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live App URL</label>
                <input 
                  type="url" 
                  required 
                  value={currentApp.link}
                  onChange={(e) => setCurrentApp({...currentApp, link: e.target.value})}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  placeholder="https://myapp.com"
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="isVisible"
                  checked={currentApp.isVisible}
                  onChange={(e) => setCurrentApp({...currentApp, isVisible: e.target.checked})}
                  className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 border-gray-300"
                />
                <label htmlFor="isVisible" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Visible to public
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 rounded-lg font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors flex items-center gap-2"
                >
                  <Save size={18} />
                  Save App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <AdminModal modal={modal} close={closeModal} />
    </div>
  );
}