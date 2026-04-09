'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, UserCog } from 'lucide-react';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    name: '',
    email: '', 
    bio: '', 
    avatarUrl: '',
    oldPassword: '', 
    newPassword: '', 
    authenticatorCode: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      
      if (res.ok) {
        alert("Settings updated successfully!");
        setForm({ ...form, oldPassword: '', newPassword: '', authenticatorCode: '' });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans transition-colors duration-300">
      <button 
        onClick={() => router.push('/admin')} 
        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-medium mb-6 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md p-1 -ml-1"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to Hub
      </button>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8 transition-colors">Admin Settings</h1>
      
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4 text-teal-600 dark:text-teal-400 transition-colors">
          <UserCog size={20} />
          <h2 className="font-bold">Profile Settings</h2>
        </div>
        <div className="space-y-4">
          <input 
            type="text" placeholder="Display Name" 
            className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Contact Email" 
            className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
          />
          <input 
            type="text" placeholder="Cloudinary Avatar URL" 
            className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            value={form.avatarUrl}
            onChange={(e) => setForm({...form, avatarUrl: e.target.value})}
          />
          <textarea 
            placeholder="Admin Bio" 
            className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl h-24 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors resize-y"
            value={form.bio}
            onChange={(e) => setForm({...form, bio: e.target.value})}
          />
        </div>
      </Card>

      <Card className="p-6 mb-8 border-orange-100 dark:border-orange-900/30 bg-orange-50/30 dark:bg-orange-900/10 transition-colors">
        <div className="flex items-center gap-2 mb-4 text-orange-600 dark:text-orange-400 transition-colors">
          <ShieldCheck size={20} />
          <h2 className="font-bold">Security</h2>
        </div>
        <div className="space-y-4">
          <input 
            type="password" placeholder="Current Password" 
            className="w-full p-3 border border-orange-200 dark:border-orange-900/50 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
            value={form.oldPassword}
            onChange={(e) => setForm({...form, oldPassword: e.target.value})}
          />
          <input 
            type="text" placeholder="6-Digit Authenticator Code" maxLength={6}
            className="w-full p-3 border border-orange-200 dark:border-orange-900/50 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
            value={form.authenticatorCode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
              setForm({...form, authenticatorCode: val})
            }}
          />
          <input 
            type="password" placeholder="New Admin Password" 
            className="w-full p-3 border border-orange-200 dark:border-orange-900/50 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
            value={form.newPassword}
            onChange={(e) => setForm({...form, newPassword: e.target.value})}
          />
        </div>
      </Card>

      <Button onClick={handleSave} disabled={loading} className="w-full py-4">
        {loading ? "Saving..." : "Update Portal Settings"}
      </Button>
    </div>
  );
}