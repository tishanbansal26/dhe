import React, { useState, useEffect } from 'react';
import { Shield, Clock, User, FileEdit, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminAudit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
      if (data) setLogs(data);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-700/50">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-slate-400" />
        <div>
          <h3 className="text-xl font-bold text-white">System Audit Logs</h3>
          <p className="text-sm text-gray-400">Track all system changes and security events.</p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 border-2 border-dashed border-slate-700 rounded-xl">No audit logs found.</div>
        ) : (
          logs.map(log => (
            <div key={log.id} className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  log.type === 'create' ? 'bg-emerald-500/20 text-emerald-400' :
                  log.type === 'update' ? 'bg-blue-500/20 text-blue-400' :
                  log.type === 'delete' ? 'bg-rose-500/20 text-rose-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  <FileEdit className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{log.action}</p>
                  <p className="text-xs text-gray-400">{log.entity}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-xs text-gray-500 w-full sm:w-auto justify-between sm:justify-end">
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {log.user_name}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(log.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
