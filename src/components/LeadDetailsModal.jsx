import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, Calendar, User, FileText, CheckSquare, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LeadDetailsModal({ lead, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, followups, notes
  const [newNote, setNewNote] = useState('');
  const [followupDate, setFollowupDate] = useState('');
  const [followups, setFollowups] = useState([]);
  const [notes, setNotes] = useState([]);
  
  if (!lead) return null;

  // Fetch follow-ups and notes when lead changes
  useEffect(() => {
    if (lead?.id) {
      fetchFollowups();
      fetchNotes();
    }
  }, [lead?.id]);

  const fetchFollowups = async () => {
    const { data } = await supabase.from('followups').select('*').eq('lead_id', lead.id).order('scheduled_at', { ascending: true });
    if (data) setFollowups(data);
  };

  const fetchNotes = async () => {
    const { data } = await supabase.from('notes').select('*').eq('lead_id', lead.id).order('created_at', { ascending: false });
    if (data) setNotes(data);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', lead.id);
      if (!error && onUpdate) onUpdate(lead.id, { status: newStatus });
    } catch (e) {
      console.error(e);
    }
  };

  const addFollowup = async () => {
    if (!followupDate) return;
    try {
      const { data, error } = await supabase.from('followups').insert([
        { lead_id: lead.id, scheduled_at: followupDate, status: 'pending' }
      ]).select();
      if (!error && data) {
        setFollowups([...followups, ...data]);
      }
    } catch (e) {
      console.error('Failed to add follow-up:', e);
    }
    setFollowupDate('');
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      const { data, error } = await supabase.from('notes').insert([
        { lead_id: lead.id, content: newNote.trim() }
      ]).select();
      if (!error && data) {
        setNotes([...data, ...notes]);
      }
    } catch (e) {
      console.error('Failed to add note:', e);
    }
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-3xl h-[80vh] flex flex-col glass-panel rounded-3xl border border-slate-700/50 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xl font-bold">
              {lead.name ? lead.name.charAt(0) : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{lead.name || 'Anonymous Lead'}</h2>
              <p className="text-sm text-gray-400">ID: {lead.id.substring(0, 8)} • Added on {new Date(lead.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-teal-500"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
            <button onClick={onClose} className="text-gray-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 border-r border-slate-700/50 bg-slate-900/30 p-4 space-y-2">
            <button onClick={() => setActiveTab('overview')} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'overview' ? 'bg-teal-500/10 text-teal-400' : 'text-gray-400 hover:bg-slate-800/50 hover:text-white'}`}>
              <User className="w-4 h-4" /> Overview
            </button>
            <button onClick={() => setActiveTab('followups')} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'followups' ? 'bg-teal-500/10 text-teal-400' : 'text-gray-400 hover:bg-slate-800/50 hover:text-white'}`}>
              <Calendar className="w-4 h-4" /> Follow-ups
            </button>
            <button onClick={() => setActiveTab('notes')} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === 'notes' ? 'bg-teal-500/10 text-teal-400' : 'text-gray-400 hover:bg-slate-800/50 hover:text-white'}`}>
              <FileText className="w-4 h-4" /> Notes
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</p>
                      <p className="text-white font-medium">{lead.phone}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</p>
                      <p className="text-white font-medium">{lead.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Profile Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <p className="text-sm text-gray-500 mb-1">Age</p>
                      <p className="text-white font-medium">{lead.age || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <p className="text-sm text-gray-500 mb-1">Gender</p>
                      <p className="text-white font-medium capitalize">{lead.gender || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <p className="text-sm text-gray-500 mb-1">Pincode</p>
                      <p className="text-white font-medium">{lead.pincode || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Plan Interest</h3>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                      <CheckSquare className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold">{lead.plan_interest}</p>
                      <p className="text-sm text-gray-400">Customer is looking for quotes on this plan.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'followups' && (
              <div className="space-y-6">
                <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50">
                  <h3 className="text-white font-bold mb-4">Schedule Follow-up</h3>
                  <div className="flex gap-4">
                    <input 
                      type="datetime-local" 
                      value={followupDate}
                      onChange={e => setFollowupDate(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-teal-500" 
                    />
                    <button onClick={addFollowup} className="bg-teal-500 text-slate-900 px-6 py-2 rounded-xl font-bold hover:bg-teal-400 transition-colors">
                      Schedule
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-bold mb-4">Upcoming Follow-ups</h3>
                  {followups.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 border-2 border-dashed border-slate-700 rounded-2xl">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No follow-ups scheduled yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {followups.map(f => (
                        <div key={f.id} className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-teal-400" />
                            <div>
                              <p className="text-white text-sm font-medium">{new Date(f.scheduled_at).toLocaleString()}</p>
                              <p className="text-xs text-gray-400 capitalize">Status: {f.status}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-6 flex flex-col h-full">
                <div className="flex-1 overflow-y-auto space-y-4">
                  <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-sm text-white">System</span>
                      <span className="text-xs text-gray-500">{new Date(lead.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-300">Lead was created in the system via Web form.</p>
                  </div>
                  {notes.map(n => (
                    <div key={n.id} className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm text-white">Agent Note</span>
                        <span className="text-xs text-gray-500">{new Date(n.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-300">{n.content}</p>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-slate-700/50 mt-auto">
                  <div className="flex gap-2">
                    <textarea 
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                      placeholder="Add a note about this lead..."
                      className="flex-1 bg-slate-900 border border-slate-600 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500 text-sm resize-none h-20"
                    />
                    <button onClick={addNote} className="bg-teal-500 text-slate-900 px-4 rounded-xl font-bold hover:bg-teal-400 transition-colors whitespace-nowrap h-20">
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
