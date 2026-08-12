import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, Clock, CheckCircle, ShieldAlert, BellOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export default function NotificationBell() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchNotifications = async () => {
      try {
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (data) {
          const notifs = data.map(n => ({
            id: n.id,
            type: n.type,
            title: n.title,
            message: n.message,
            time: new Date(n.created_at).toLocaleString(),
            read: n.read
          }));
          
          setNotifications(notifs);
          setUnreadCount(notifs.filter(n => !n.read).length);
        }
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };
    
    fetchNotifications();
    
    // Close dropdown on outside click
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [user]);

  const markAllRead = async () => {
    // Optimistic UI update
    setNotifications(notifications.map(n => ({...n, read: true})));
    setUnreadCount(0);
    
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-slate-800 transition-colors relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse border border-slate-900"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden z-50">
          <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50">
            <h3 className="font-bold text-white text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-teal-400 hover:text-teal-300 font-medium">
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500 flex flex-col items-center justify-center">
                <BellOff className="w-8 h-8 text-slate-600 mb-2" />
                You're all caught up!
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {notifications.map(n => (
                  <div key={n.id} className={`p-4 flex gap-3 hover:bg-slate-700/30 transition-colors cursor-pointer ${!n.read ? 'bg-slate-700/10' : ''}`}>
                    <div className="flex-shrink-0 mt-1">
                      {n.type === 'alert' ? (
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm ${!n.read ? 'text-white font-medium' : 'text-gray-300'}`}>{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {n.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
