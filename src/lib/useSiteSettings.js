import { useState, useEffect } from 'react';
import { supabase } from './supabase';

// Cache to prevent multiple fetches during the same session if possible,
// but for now simple state is fine.
let cachedSettings = null;

export function useSiteSettings() {
  const [settings, setSettings] = useState(cachedSettings || {
    contact_phone: '+91 96036 10000',
    contact_email: 'ertishanbansal@gmail.com',
    hero_headline: 'Insurance & Financial Protection, Built Around You',
    hero_subheadline: 'Protect your health, family and financial future with trusted, personalized guidance from Radhe Investments.'
  });
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    async function fetchSettings() {
      if (cachedSettings) return;
      try {
        const { data, error } = await supabase.from('site_settings').select('setting_key, setting_value');
        if (error) throw error;
        
        const settingsMap = {};
        data.forEach(item => {
          settingsMap[item.setting_key] = item.setting_value;
        });
        
        // Merge with defaults
        const merged = { ...settings, ...settingsMap };
        cachedSettings = merged;
        setSettings(merged);
      } catch (err) {
        console.error('Error fetching site settings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [settings]);

  return { settings, loading };
}
