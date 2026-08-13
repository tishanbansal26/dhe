import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Settings, Phone, Mail, Type, Image } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('site_settings').select('*').order('setting_key');
      if (error) throw error;
      setSettings(data || []);
    } catch (err) {
      console.error('Error fetching settings:', err);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id, newValue) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, setting_value: newValue } : s));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const updates = settings.map(s => ({
        id: s.id,
        setting_key: s.setting_key,
        setting_value: s.setting_value,
        description: s.description,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase.from('site_settings').upsert(updates);
      if (error) throw error;
      
      toast.success('Site settings saved successfully!');
      
      // We might need to refresh the page to reload the frontend context, or just let them know
      toast('Refresh the main website to see changes.', { icon: '🔄' });
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-400 p-8">Loading site settings...</div>;
  }

  return (
    <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <Settings className="w-6 h-6 text-teal-400" />
            Website Content Settings
          </h2>
          <p className="text-gray-400 text-sm">Update the global text, contact numbers, and banners on your website.</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="p-6 md:p-8 space-y-8 max-w-4xl">
        {settings.map((setting) => {
          
          let Icon = Type;
          if (setting.setting_key.includes('phone')) Icon = Phone;
          if (setting.setting_key.includes('email')) Icon = Mail;
          if (setting.setting_key.includes('image') || setting.setting_key.includes('banner')) Icon = Image;

          // Determine input type (textarea for long text like subheadlines)
          const isLongText = setting.setting_value && setting.setting_value.length > 60;
          
          // Parse JSON if it's stored as a JSON string (for simple strings it will have quotes, we strip them for editing)
          let editValue = setting.setting_value;
          if (typeof editValue === 'string') {
            try {
              editValue = JSON.parse(editValue);
            } catch (e) {
              // Ignore if it's just raw string
            }
          }

          return (
            <div key={setting.id} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 relative">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <label className="block text-white font-medium mb-1">
                    {setting.setting_key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </label>
                  <p className="text-gray-400 text-xs mb-4">{setting.description}</p>
                  
                  {isLongText ? (
                    <textarea 
                      value={editValue}
                      onChange={(e) => handleUpdate(setting.id, JSON.stringify(e.target.value))}
                      rows={3}
                      className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors resize-none"
                    />
                  ) : (
                    <input 
                      type="text"
                      value={editValue}
                      onChange={(e) => handleUpdate(setting.id, JSON.stringify(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
