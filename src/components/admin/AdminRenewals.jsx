import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, Bell, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminRenewals() {
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRenewals();
  }, []);

  const fetchRenewals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('renewals')
      .select('*, policies(policy_number, end_date, customers(name, email), insurance_plans(name))')
      .order('due_date', { ascending: true });
    
    if (!error) setRenewals(data || []);
    setLoading(false);
  };

  const sendReminder = async (id) => {
    // In a real app, this would trigger an email/SMS via Edge Function.
    // For now, we just update the status to 'notified'.
    const { error } = await supabase.from('renewals').update({ status: 'notified' }).eq('id', id);
    if (!error) {
      toast.success('Reminder sent to customer successfully.');
      fetchRenewals();
    } else {
      toast.error('Failed to send reminder: ' + error.message);
    }
  };

  const markCompleted = async (id) => {
    const { error } = await supabase.from('renewals').update({ status: 'completed' }).eq('id', id);
    if (!error) {
      fetchRenewals();
    } else {
      toast.error('Failed to mark as completed: ' + error.message);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-700/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-400" /> Upcoming Renewals
        </h3>
      </div>

      {loading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-gray-300">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Customer</th>
                <th className="px-4 py-3">Policy / Plan</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Premium Due</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4 space-y-2"><div className="h-4 bg-slate-700/50 rounded w-24"></div><div className="h-3 bg-slate-700/50 rounded w-32"></div></td>
                  <td className="px-4 py-4 space-y-2"><div className="h-4 bg-slate-700/50 rounded w-24"></div><div className="h-3 bg-slate-700/50 rounded w-32"></div></td>
                  <td className="px-4 py-4 space-y-2"><div className="h-4 bg-slate-700/50 rounded w-20"></div><div className="h-3 bg-slate-700/50 rounded w-16"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-slate-700/50 rounded w-16"></div></td>
                  <td className="px-4 py-4"><div className="h-6 bg-slate-700/50 rounded w-16"></div></td>
                  <td className="px-4 py-4 space-y-2"><div className="h-6 bg-slate-700/50 rounded w-20"></div><div className="h-6 bg-slate-700/50 rounded w-20"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-gray-300">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Customer</th>
                <th className="px-4 py-3">Policy / Plan</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Premium Due</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {renewals.map(r => {
                const daysUntilDue = Math.ceil((new Date(r.due_date) - new Date()) / (1000 * 60 * 60 * 24));
                const isOverdue = daysUntilDue < 0 && r.status !== 'completed';
                
                return (
                  <tr key={r.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-4 text-white font-medium">
                      {r.policies?.customers?.name}
                      <br/><span className="text-xs text-gray-400">{r.policies?.customers?.email}</span>
                    </td>
                    <td className="px-4 py-4 text-teal-400">
                      {r.policies?.policy_number}
                      <br/><span className="text-xs text-gray-500">{r.policies?.insurance_plans?.name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`font-medium ${isOverdue ? 'text-red-400' : daysUntilDue <= 30 ? 'text-yellow-400' : 'text-gray-300'}`}>
                        {new Date(r.due_date).toLocaleDateString()}
                      </span>
                      <br/>
                      <span className="text-xs text-gray-500">
                        {isOverdue ? 'Overdue!' : `${daysUntilDue} days left`}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white font-bold">₹{r.premium_amount}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        r.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 
                        r.status === 'notified' ? 'bg-blue-500/20 text-blue-400' :
                        r.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4 flex flex-col gap-2">
                      {r.status !== 'completed' && (
                        <>
                          <button 
                            onClick={() => sendReminder(r.id)} 
                            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 text-xs flex items-center justify-center gap-1"
                          >
                            <Bell className="w-3 h-3" /> Remind
                          </button>
                          <button 
                            onClick={() => markCompleted(r.id)} 
                            className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 text-xs"
                          >
                            Mark Paid
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
              {renewals.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-400">No upcoming renewals found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
