"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, Megaphone, Receipt, Inbox, Users, Briefcase, 
  Building2, LogOut, GraduationCap, MessageSquare, Settings, 
  BarChart3, BadgeDollarSign
} from "lucide-react";
import AdminModal from "@/components/AdminModal";

export default function AdminDashboard() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(""); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // New state for the profile
  const [profile, setProfile] = useState<{name?: string, email?: string, bio?: string, avatarUrl?: string} | null>(null);

  const [modal, setModal] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ show: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch("/api/admin/check-auth");
        if (res.ok) {
          setIsAuthenticated(true);
          fetchProfile(); // Fetch profile if authenticated
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    verifySession();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.data) {
        setProfile(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  const showModal = (type: 'success' | 'error' | 'confirm', title: string, message: string, onConfirm?: () => void) => {
    setModal({ show: true, type, title, message, onConfirm });
  };

  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, token }), 
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        fetchProfile(); // Fetch profile immediately after login
      } else {
        showModal('error', 'Access Denied', data.message || "Incorrect credentials");
      }
    } catch {
      showModal('error', 'Error', "Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setIsAuthenticated(false);
      setPassword("");
      setToken("");
      setProfile(null); // Clear profile on logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-teal-600 dark:border-teal-500 border-t-transparent rounded-full animate-spin mb-4 transition-colors"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse transition-colors">Verifying secure session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300 px-4">
        <form onSubmit={handleLogin} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg dark:shadow-none border border-transparent dark:border-gray-800 w-full max-w-sm transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-50 transition-colors">Admin Access</h2>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="6-Digit Auth Code"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl mb-6 tracking-widest text-center font-mono text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            value={token}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
              setToken(val);
            }}
            maxLength={6}
            required
          />
          <button
            type="submit"
            disabled={loading || token.length !== 6}
            className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            {loading ? "Verifying..." : "Access Portal"}
          </button>
        </form>
        <AdminModal modal={modal} close={closeModal} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center md:text-left transition-colors">Command Center</h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </div>

        {/* Profile Display Section */}
        {profile && (profile.name || profile.email || profile.bio) && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 mb-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left transition-colors duration-300">
            <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 overflow-hidden transition-colors">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Admin Avatar" className="w-full h-full object-cover" />
              ) : (
                profile.name ? profile.name.charAt(0).toUpperCase() : (profile.email ? profile.email.charAt(0).toUpperCase() : 'A')
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{profile.name || profile.email || "Admin Profile"}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl leading-relaxed transition-colors">{profile.bio}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-4">
          <div onClick={() => router.push('/admin/blogs')} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-teal-900/5 hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><FileText size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Manage Blogs</h2>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">Write, edit, publish, and manage your articles.</p>
          </div>

          <div onClick={() => router.push('/admin/comments')} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-cyan-900/5 hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><MessageSquare size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Moderation</h2>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">Review, approve, or delete blog comments and replies.</p>
          </div>

          <div onClick={() => router.push('/admin/broadcast')} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-indigo-900/5 hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Megaphone size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Broadcast</h2>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">Target audiences and send your newsletters.</p>
          </div>

          <div onClick={() => router.push('/admin/accounts')} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-amber-900/5 hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Receipt size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Manage Books</h2>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">Handle receipts, invoices, and financials.</p>
          </div>

          <div onClick={() => router.push('/admin/quotes')} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-blue-900/5 hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Inbox size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Lead Management</h2>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">Review quote requests, manage your CRM, and convert leads.</p>
          </div>

          <div onClick={() => router.push('/admin/subscribers')} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-pink-900/5 hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Users size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Audience</h2>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">Manage your newsletter subscribers and contacts.</p>
          </div>

          <div onClick={() => router.push('/admin/portfolio')} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Briefcase size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Portfolio CMS</h2>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">Manage your personal projects, case studies, and showcase items.</p>
          </div>

          <div onClick={() => router.push('/admin/corporate')} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-violet-900/5 hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Building2 size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Corporate CMS</h2>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">Manage agency/corporate projects and NDAs.</p>
          </div>

          <div onClick={() => router.push('/admin/resume')} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-orange-900/5 hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><GraduationCap size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Resume / CV</h2>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">Update your experience, education, and skills.</p>
          </div>

          <div onClick={() => router.push('/admin/pricing')} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-rose-900/5 hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BadgeDollarSign size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Pricing Lists</h2>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">Create, manage, and send custom pricing lists to clients.</p>
          </div>

          <div onClick={() => router.push('/admin/analytics')} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-blue-900/5 hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><BarChart3 size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Analytics</h2>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">Track page views and resume downloads.</p>
          </div>

          <div onClick={() => router.push('/admin/settings')} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-slate-900/5 hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Settings size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Portal Settings</h2>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">Manage security and admin profile data.</p>
          </div>

        </div>
      </div>
      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}