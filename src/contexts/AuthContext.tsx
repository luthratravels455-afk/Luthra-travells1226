import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import supabase from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  loginAsAdmin: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  loginAsAdmin: () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminBypass, setAdminBypass] = useState<boolean>(() => {
    return localStorage.getItem('luthra_admin_auth') === 'true';
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginAsAdmin = () => {
    setAdminBypass(true);
    localStorage.setItem('luthra_admin_auth', 'true');
  };

  const logout = async () => {
    setAdminBypass(false);
    localStorage.removeItem('luthra_admin_auth');
    await supabase.auth.signOut();
  };

  const isAdmin = adminBypass || (user !== null && user.email === 'admin@luthratravels.com');

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
