"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Mail, UserMinus, CheckCircle, Clock, XCircle } from "lucide-react";
import AdminModal from "@/components/AdminModal";

type Subscriber = {
  _id: string;
  email: string;
  nickname: string;
  subscribed: boolean;
  verified: boolean;
  createdAt: string;
};

export default function SubscribersPage() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ show: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch("/api/admin/subscribers");
      if (res.ok) {
        setSubscribers(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch subscribers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    setModal({
      show: true,
      type: 'confirm',
      title: 'Remove Subscriber',
      message: `Are you sure you want to remove ${email} from your audience?`,
      onConfirm: async () => {
        try {
          const res = await fetch("/api/admin/subscribers", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });

          if (res.ok) {
            setSubscribers(subscribers.filter(s => s._id !== id));
            setModal({ show: false, type: 'success', title: '', message: '' });
          } else {
            setModal({ show: true, type: 'error', title: 'Error', message: 'Failed to delete subscriber.' });
          }
        } catch (error) {
          setModal({ show: true, type: 'error', title: 'Error', message: 'An unexpected error occurred.' });
        }
      }
    });
  };

  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

  // Calculate statistics
  const stats = useMemo(() => {
    const total = subscribers.length;
    const verified = subscribers.filter(s => s.verified && s.subscribed).length;
    const pending = subscribers.filter(s => !s.verified && !s.subscribed).length;
    const unsubscribed = subscribers.filter(s => s.verified && !s.subscribed).length;
    return { total, verified, pending, unsubscribed };
  }, [subscribers]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-none border border-gray-100 dark:border-gray-800 fade-in transition-colors duration-300">
        <button onClick={() => router.push('/admin')} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md p-1 -ml-1">
          <ArrowLeft size={20} className="mr-2" /> Back to Hub
        </button>
        
        <div className="flex items-center mb-8 border-l-4 border-indigo-500 pl-4">
          <Users size={28} className="text-indigo-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-50 transition-colors">Audience Management</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl text-center transition-colors">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mb-1 transition-colors">Total Audience</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{stats.total}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 p-5 rounded-2xl text-center transition-colors">
            <p className="text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-1 transition-colors">Active & Verified</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-500 transition-colors">{stats.verified}</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 p-5 rounded-2xl text-center transition-colors">
            <p className="text-amber-700 dark:text-amber-400 text-sm font-semibold mb-1 transition-colors">Pending Verification</p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-500 transition-colors">{stats.pending}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 p-5 rounded-2xl text-center transition-colors">
            <p className="text-red-700 dark:text-red-400 text-sm font-semibold mb-1 transition-colors">Unsubscribed</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-500 transition-colors">{stats.unsubscribed}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 transition-colors">Loading audience data...</div>
        ) : subscribers.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-12 rounded-2xl border border-gray-200 dark:border-gray-700 text-center transition-colors">
            <Users size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600 transition-colors" />
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2 transition-colors">No subscribers yet</h3>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">When users sign up for your newsletter, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl transition-colors">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 uppercase text-xs transition-colors">
                <tr>
                  <th className="px-6 py-4">Subscriber</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 transition-colors">
                {subscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 align-middle">
                      <p className="font-bold text-gray-900 dark:text-gray-100 text-base transition-colors">{sub.nickname || 'Unknown'}</p>
                      <a href={`mailto:${sub.email}`} className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center mt-1 transition-colors">
                        <Mail size={14} className="mr-1.5" /> {sub.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      {sub.verified && sub.subscribed ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 transition-colors">
                          <CheckCircle size={12} className="mr-1" /> Active
                        </span>
                      ) : sub.verified && !sub.subscribed ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 transition-colors">
                          <XCircle size={12} className="mr-1" /> Unsubscribed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 transition-colors">
                          <Clock size={12} className="mr-1" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-middle text-gray-500 dark:text-gray-400 font-medium transition-colors">
                      {new Date(sub.createdAt || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 align-middle text-right">
                      <button 
                        onClick={() => handleDelete(sub._id, sub.email)}
                        className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-xs font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <UserMinus size={14} className="mr-1.5" /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}