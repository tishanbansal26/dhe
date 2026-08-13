import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [agentProfile, setAgentProfile] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (authUser) => {
    if (!authUser) return;
    const userId = authUser.id;
    try {
      const metaRole = authUser?.user_metadata?.role || 'customer';
      const metaName = authUser?.user_metadata?.name || authUser?.email || 'User';

      // 1. Fetch user role from public.users
      let { data: userData, error: userError } = await supabase.from('users').select('*').eq('id', userId).single();
      
      if (userError || !userData) {
        // Fallback to metadata
        userData = { id: userId, role: metaRole, name: metaName };
      }
      setUserProfile(userData);

      // 2. Fetch specific profile based on role
      if (['agent', 'admin', 'staff', 'super_admin'].includes(userData.role)) {
        let { data, error } = await supabase.from('agents').select('*').eq('user_id', userId).single();
        if (!data || error) {
           data = { id: 'AGT-' + userId.substring(0,6), user_id: userId, name: metaName, role: userData.role, email: authUser?.email, status: 'active', type: 'sub' };
        } else {
           // Ensure role is set from userData if missing in agents table
           data.role = data.role || userData.role;
        }
        setAgentProfile(data);
      } else {
        let { data, error } = await supabase.from('customers').select('*').eq('user_id', userId).single();
        if (!data || error) {
           data = { id: userId, user_id: userId, name: metaName, email: authUser?.email, phone: '' };
        }
        setCustomerProfile(data);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser);
      } else {
        setUserProfile(null);
        setAgentProfile(null);
        setCustomerProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };
  
  const signup = async (email, password, name, role = 'customer', extraData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          name,
          role,
          ...extraData
        }
      }
    });
    if (error) throw error;
    return data;
  };

  const loginWithOtp = async (email) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  };

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      agentProfile, 
      customerProfile, 
      login, 
      loginWithOtp,
      signup,
      resetPassword,
      logout, 
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
