import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, Phone, ShieldCheck, Activity } from 'lucide-react';

export default function AdminOverview({ leads = [], agents = [], policies = [], claims = [] }) {
  const convertedLeads = leads.filter(l => l.status === 'converted').length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const conversionRate = leads.length ? Math.round((convertedLeads / leads.length) * 100) : 0;

  // Compute real chart data by bucketing leads and policies by month
  const chartData = useMemo(() => {
    const dataMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months
    const d = new Date();
    for (let i = 5; i >= 0; i--) {
      const targetMonth = new Date(d.getFullYear(), d.getMonth() - i, 1);
      const name = `${months[targetMonth.getMonth()]} '${String(targetMonth.getFullYear()).slice(-2)}`;
      dataMap[name] = { name, leads: 0, converted: 0 };
    }

    leads.forEach(l => {
      if (!l.created_at) return;
      const date = new Date(l.created_at);
      const m = `${months[date.getMonth()]} '${String(date.getFullYear()).slice(-2)}`;
      if (dataMap[m]) {
        dataMap[m].leads += 1;
        if (l.status === 'converted') {
          dataMap[m].converted += 1;
        }
      }
    });

    return Object.values(dataMap);
  }, [leads]);

  const agentPerformance = useMemo(() => {
    // Sort agents by policies sold (descending)
    return [...agents].sort((a, b) => (b.policies || 0) - (a.policies || 0)).slice(0, 5).map(a => ({
      name: (a.name || 'Agent').split(' ')[0],
      gwp: parseInt(String(a.gwp || '0').replace(/[^0-9]/g, '')),
      policies: a.policies || 0
    }));
  }, [agents]);

  return (
    <div className="space-y-6">
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Leads</p>
              <h3 className="text-3xl font-bold text-white">{leads.length}</h3>
            </div>
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
              <Phone className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Agents</p>
              <h3 className="text-3xl font-bold text-white">{agents.length}</h3>
            </div>
            <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>+2 new this week</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Conversion Rate</p>
              <h3 className="text-3xl font-bold text-white">{conversionRate}%</h3>
            </div>
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-red-400">
            <ArrowDownRight className="w-4 h-4" />
            <span>-2% from last month</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Active Policies</p>
              <h3 className="text-3xl font-bold text-white">{policies.filter(p => p.status === 'active').length}</h3>
            </div>
            <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>Stable growth</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Leads Trend Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-700/50">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Lead Generation & Conversion</h3>
            <p className="text-sm text-gray-400">Monthly trend of incoming leads versus actual converted policies.</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Area type="monotone" dataKey="leads" name="Total Leads" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="converted" name="Converted" stroke="#10b981" fillOpacity={1} fill="url(#colorConverted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Agents Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-700/50">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Top Agents Performance</h3>
            <p className="text-sm text-gray-400">Total policies sold by top 5 agents.</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  cursor={{fill: '#334155', opacity: 0.4}}
                />
                <Bar dataKey="policies" name="Policies Sold" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
