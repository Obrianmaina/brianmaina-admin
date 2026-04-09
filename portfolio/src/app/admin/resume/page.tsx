"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, GraduationCap, Plus, Trash2, Pencil } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import { TimelineSection, TimelineEntry } from "@/types";

type AdminTimelineSection = TimelineSection & { _id: string };

export default function ResumeCMS() {
  const router = useRouter();
  
  const [experience, setExperience] = useState<AdminTimelineSection[]>([]);
  const [education, setEducation] = useState<AdminTimelineSection[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for forms
  const [activeTab, setActiveTab] = useState<'experience' | 'education' | 'skills'>('experience');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Timeline Section Form
  const [heading, setHeading] = useState("");
  // Now handles multiple roles/entries under one company/school
  const [entries, setEntries] = useState<{title: string; date: string; description: string}[]>([
    { title: "", date: "", description: "" }
  ]);
  
  // Skills Form
  const [newSkill, setNewSkill] = useState("");

  const [modal, setModal] = useState<{ show: boolean; type: 'success' | 'error' | 'confirm'; title: string; message: string; onConfirm?: () => void; }>({ show: false, type: 'success', title: '', message: '' });

  useEffect(() => { fetchResumeData(); }, []);

  const fetchResumeData = async () => {
    try {
      const res = await fetch("/api/admin/resume");
      if (res.ok) {
        const data = await res.json();
        setExperience(data.experience || []);
        setEducation(data.education || []);
        setSkills(data.skills || []);
      }
    } catch (error) {
      console.error("Failed to fetch resume data");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

  // Helper to reset the form state entirely
  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setHeading("");
    setEntries([{ title: "", date: "", description: "" }]);
  };

  const handleTimelineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Process all entries to handle bullet points
      const parsedEntries = entries.map(entry => {
        const descArray = entry.description.split('\n').map(s => s.trim()).filter(Boolean);
        const finalDescription = descArray.length === 1 ? descArray[0] : descArray;
        return {
          title: entry.title,
          date: entry.date,
          description: finalDescription
        };
      });

      const payload = {
        id: editingId, // Include ID if we are updating
        section: activeTab, 
        heading: heading,
        entries: parsedEntries,
        order: activeTab === 'experience' ? experience.length : education.length
      };

      const method = editingId ? "PUT" : "POST";

      const res = await fetch("/api/admin/resume", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModal({ show: true, type: 'success', title: 'Success', message: `Successfully ${editingId ? 'updated' : 'added to'} ${activeTab}!` });
        resetForm();
        fetchResumeData();
      } else {
        setModal({ show: true, type: 'error', title: 'Error', message: `Failed to ${editingId ? 'update' : 'add'} entry.` });
      }
    } catch (error) {
      setModal({ show: true, type: 'error', title: 'Error', message: 'An unexpected error occurred.' });
    }
  };

  const handleEditTimeline = (section: AdminTimelineSection) => {
    setEditingId(section._id);
    setHeading(section.heading);
    
    // Populate form with all entries for this section
    if (section.entries && section.entries.length > 0) {
      setEntries(section.entries.map((entry) => ({
        title: entry.title,
        date: entry.date,
        description: Array.isArray(entry.description) ? entry.description.join('\n') : entry.description
      })));
    } else {
      setEntries([{ title: "", date: "", description: "" }]);
    }
    
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddEntryField = () => {
    setEntries([...entries, { title: "", date: "", description: "" }]);
  };

  const handleRemoveEntryField = (indexToRemove: number) => {
    setEntries(entries.filter((_, idx) => idx !== indexToRemove));
  };

  const updateEntryField = (index: number, field: 'title' | 'date' | 'description', value: string) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/resume", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: 'skills', name: newSkill.trim() }),
      });
      if (res.ok) {
        setNewSkill("");
        fetchResumeData();
      }
    } catch (error) {
      setModal({ show: true, type: 'error', title: 'Error', message: 'Failed to add skill.' });
    }
  };

  const handleDelete = async (id: string, section: string, titleName: string) => {
    setModal({
      show: true, type: 'confirm', title: 'Delete Entry', message: `Are you sure you want to delete "${titleName}"?`,
      onConfirm: async () => {
        const payload = section === 'skills' ? { section, name: titleName } : { section, id };
        const res = await fetch("/api/admin/resume", {
          method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchResumeData();
          setModal({ show: false, type: 'success', title: '', message: '' });
        }
      }
    });
  };

  const inputClasses = "w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-colors";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-none border border-gray-100 dark:border-gray-800 fade-in transition-colors duration-300">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => router.push('/admin')} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md p-1 -ml-1">
            <ArrowLeft size={20} className="mr-2" /> Back to Hub
          </button>
          {activeTab !== 'skills' && (
            <button onClick={() => isAdding ? resetForm() : setIsAdding(true)} className="flex items-center bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-sm">
              {isAdding ? (editingId ? "Cancel Edit" : "Cancel") : <><Plus size={18} className="mr-2" /> Add Entry</>}
            </button>
          )}
        </div>

        <div className="flex items-center mb-8 border-l-4 border-orange-500 pl-4 transition-colors">
          <GraduationCap size={28} className="text-orange-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Resume Manager</h2>
        </div>

        <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-800 transition-colors">
          <button onClick={() => { setActiveTab('experience'); resetForm(); }} className={`pb-3 font-semibold px-2 transition-colors focus:outline-none ${activeTab === 'experience' ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}>Experience</button>
          <button onClick={() => { setActiveTab('education'); resetForm(); }} className={`pb-3 font-semibold px-2 transition-colors focus:outline-none ${activeTab === 'education' ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}>Education</button>
          <button onClick={() => { setActiveTab('skills'); resetForm(); }} className={`pb-3 font-semibold px-2 transition-colors focus:outline-none ${activeTab === 'skills' ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}>Skills</button>
        </div>

        {isAdding && activeTab !== 'skills' && (
          <div className="bg-orange-50/50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-900/30 mb-8 fade-in transition-colors">
            <h3 className="text-xl font-bold text-orange-900 dark:text-orange-400 mb-4 flex items-center capitalize transition-colors">
              {editingId ? "Edit" : "Add New"} {activeTab} 
            </h3>
            <p className="text-sm text-orange-600 dark:text-orange-500 mb-6 transition-colors">Tip: To create bullet points in the description, press Enter for a new line.</p>
            
            <form onSubmit={handleTimelineSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors">Organization / Heading</label>
                <input required type="text" placeholder="e.g. SAP SE or Moi University" className={inputClasses} value={heading} onChange={e => setHeading(e.target.value)} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-orange-200 dark:border-orange-900/50 pb-2 transition-colors">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors">Roles / Degrees</label>
                  <button type="button" onClick={handleAddEntryField} className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 font-bold flex items-center bg-orange-100 dark:bg-orange-900/30 px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <Plus size={16} className="mr-1" /> Add Another Role
                  </button>
                </div>

                {entries.map((entry, idx) => (
                  <div key={idx} className="p-4 bg-white dark:bg-gray-900 border border-orange-100 dark:border-orange-900/50 rounded-xl relative shadow-sm dark:shadow-none transition-colors">
                    {entries.length > 1 && (
                      <button type="button" onClick={() => handleRemoveEntryField(idx)} className="absolute -top-3 -right-3 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-2 rounded-full hover:bg-red-200 dark:hover:bg-red-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500" title="Remove this role">
                        <Trash2 size={16} />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input required type="text" placeholder="Job Title / Degree (e.g. Visual Designer)" className={inputClasses} value={entry.title} onChange={e => updateEntryField(idx, 'title', e.target.value)} />
                      <input type="text" placeholder="Date (e.g. February 2024 - September 2024)" className={inputClasses} value={entry.date} onChange={e => updateEntryField(idx, 'date', e.target.value)} />
                    </div>
                    <textarea required placeholder="Description... (Press Enter for bullet points)" className={`${inputClasses} h-32 resize-y`} value={entry.description} onChange={e => updateEntryField(idx, 'description', e.target.value)} />
                  </div>
                ))}
              </div>

              <button type="submit" className="w-full bg-orange-600 text-white font-bold py-4 mt-6 rounded-xl hover:bg-orange-700 shadow-md dark:shadow-none transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                {editingId ? "Update Entry" : "Save Entry"}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 animate-pulse transition-colors">Loading {activeTab}...</p>
        ) : (
          <div>
            {(activeTab === 'experience' || activeTab === 'education') && (
              <div className="space-y-6">
                {(activeTab === 'experience' ? experience : education).map((section) => (
                  <div key={section._id} className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-gray-900 flex justify-between group hover:border-orange-200 dark:hover:border-orange-500/50 transition-colors shadow-sm dark:shadow-none">
                    <div className="w-full">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 border-b border-gray-100 dark:border-gray-800 pb-2 inline-block transition-colors">{section.heading}</h4>
                      {section.entries.map((entry: TimelineEntry, idx: number) => (
                        <div key={idx} className="mb-6 last:mb-0">
                          <h5 className="font-semibold text-gray-800 dark:text-gray-200 text-lg transition-colors">{entry.title}</h5>
                          <p className="text-sm text-orange-600 dark:text-orange-400 mb-3 font-medium transition-colors">{entry.date}</p>
                          {Array.isArray(entry.description) ? (
                            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                              {entry.description.map((item: string, i: number) => <li key={i}>{item}</li>)}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{entry.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 self-start ml-4 shrink-0">
                      <button onClick={() => handleEditTimeline(section)} className="text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500" title="Edit Entry">
                        <Pencil size={20} />
                      </button>
                      <button onClick={() => handleDelete(section._id, activeTab, section.heading)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500" title="Delete Entry">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                {(activeTab === 'experience' ? experience : education).length === 0 && (
                   <p className="text-gray-500 dark:text-gray-400 italic text-center py-8 transition-colors">No {activeTab} data found.</p>
                )}
              </div>
            )}

            {activeTab === 'skills' && (
              <div>
                <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-4 mb-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
                  <input required type="text" placeholder="Add a new skill (e.g. Next.js, Figma)..." className={inputClasses} value={newSkill} onChange={e => setNewSkill(e.target.value)} />
                  <button type="submit" className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 shadow-sm whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                    <Plus size={20} className="inline mr-1" /> Add Skill
                  </button>
                </form>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full pl-4 pr-1 py-1 shadow-sm dark:shadow-none group transition-colors">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2 transition-colors">{skill}</span>
                      <button onClick={() => handleDelete('', 'skills', skill)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500" title="Remove Skill">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}