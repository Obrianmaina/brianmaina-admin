'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { 
  BarChart3, Download, ArrowLeft, FileText, 
  Users, Landmark, Target, TrendingUp 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, AreaChart, Area, Legend, Cell 
} from 'recharts';

// --- Types ---
interface AccessLog { _id: string; clientEmail: string; accessedAt: string; }
interface TrafficStat { target: string; type: 'page_view' | 'download'; hits: number; }

interface AnalyticsData {
  traffic: { stats: TrafficStat[]; accessLogs: AccessLog[] };
  crm: { new: number; contacted: number; inProgress: number; won: number; lost: number; };
  audience: { total: number; active: number; };
  financials: {
    chartData: { name: string; Revenue: number; Expenses: number; Profit: number; }[];
    totalRevenue: number;
    totalExpenses: number;
  };
}

// Matching colors from KanbanColumn STATUS_STYLES
const PIPELINE_COLORS = {
  'New': '#3b82f6',         // blue-500
  'Contacted': '#f59e0b',   // amber-500
  'In Progress': '#a855f7', // purple-500
  'Won': '#10b981',         // emerald-500
  'Lost': '#f87171'         // red-400
};

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics', { cache: 'no-store' })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8 text-gray-500 dark:text-gray-400 transition-colors">Loading command center...</div>;
  }

  // Calculate top level stats
  const totalViews = data.traffic.stats.filter(s => s.type === 'page_view').reduce((acc, curr) => acc + curr.hits, 0);
  const totalDownloads = data.traffic.stats.find(s => s.target === 'resume-pdf')?.hits || 0;
  
  const totalLeads = data.crm.new + data.crm.contacted + data.crm.inProgress + data.crm.won + data.crm.lost;
  const winRate = totalLeads > 0 ? Math.round((data.crm.won / (data.crm.won + data.crm.lost)) * 100) || 0 : 0;

  // Format CRM data for the Bar Chart
  const crmChartData = [
    { name: 'New', Leads: data.crm.new },
    { name: 'Contacted', Leads: data.crm.contacted },
    { name: 'In Progress', Leads: data.crm.inProgress },
    { name: 'Won', Leads: data.crm.won },
    { name: 'Lost', Leads: data.crm.lost },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => router.push('/admin')} 
          className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-medium mb-6 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded p-1 -ml-1"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Hub
        </button>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-50 transition-colors">Command Center</h1>
        
        {/* --- Top Level Stats Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 flex items-center gap-4 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 transition-colors shadow-sm">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl transition-colors"><Landmark /></div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">Net Profit (All Time)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
                {(data.financials.totalRevenue - data.financials.totalExpenses).toLocaleString()}
              </p>
            </div>
          </Card>
          
          <Card className="p-6 flex items-center gap-4 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 transition-colors shadow-sm">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl transition-colors"><Target /></div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">Lead Win Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">{winRate}%</p>
            </div>
          </Card>

          <Card className="p-6 flex items-center gap-4 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 transition-colors shadow-sm">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl transition-colors"><Users /></div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">Active Subscribers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">{data.audience.active}</p>
            </div>
          </Card>

          <Card className="p-6 flex items-center gap-4 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 transition-colors shadow-sm">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl transition-colors"><Download /></div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">CV Downloads</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">{totalDownloads}</p>
            </div>
          </Card>
        </div>

        {/* --- Charts Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Financials Chart */}
          <Card className="p-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center transition-colors">
              <TrendingUp size={20} className="mr-2 text-emerald-500" /> Cash Flow (Revenue vs Expenses)
            </h3>
            <div className="h-[300px] w-full">
              {data.financials.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.financials.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.2} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#f3f4f6' }} 
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Legend iconType="circle" />
                    <Area type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="Expenses" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">No financial data available yet.</div>
              )}
            </div>
          </Card>

          {/* CRM Pipeline Chart */}
          <Card className="p-6 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center transition-colors">
              <Target size={20} className="mr-2 text-blue-500" /> Lead Pipeline Velocity
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={crmChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <RechartsTooltip 
                    cursor={{ fill: '#374151', opacity: 0.1 }}
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#f3f4f6' }} 
                  />
                  <Bar dataKey="Leads" radius={[4, 4, 0, 0]}>
                    {crmChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIPELINE_COLORS[entry.name as keyof typeof PIPELINE_COLORS] || '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>

        {/* --- Bottom Tables --- */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-50 transition-colors">
          <FileText size={24} className="text-teal-600 dark:text-teal-400 transition-colors" /> Recent References Access
        </h2>
        
        <Card className="overflow-hidden bg-white dark:bg-gray-900 shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 transition-colors">
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm transition-colors">Email Address</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm transition-colors">Accessed At</th>
                </tr>
              </thead>
              <tbody>
                {data.traffic.accessLogs.length > 0 ? (
                  data.traffic.accessLogs.map((log, i) => (
                    <tr key={log._id || i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="p-4 text-gray-600 dark:text-gray-300 transition-colors">{log.clientEmail || 'N/A'}</td>
                      <td className="p-4 text-gray-500 dark:text-gray-400 text-sm transition-colors">
                        {new Date(log.accessedAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-gray-500 dark:text-gray-400 transition-colors">
                      No references accessed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}