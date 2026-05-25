import React, { createContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

export interface Profile {
  id: string;
  email: string;
  nome: string | null;
  avatar_url: string | null;
  plano: 'free' | 'pro' | 'admin';
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, nome?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Buscar perfil do usuario
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
    return data as Profile;
  };

  // Inicializar sessao
  useEffect(() => {
    // Timeout curto — getSession do Supabase pode ficar pendente
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(timeout);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          const p = await fetchProfile(session.user.id);
          setProfile(p);
        } catch (e) {
          console.error('Erro ao buscar perfil (ignorado):', e);
        }
      }

      setLoading(false);
    }).catch(() => {
      clearTimeout(timeout);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const p = await fetchProfile(session.user.id);
          setProfile(p);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, nome?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome: nome || email.split('@')[0] },
      },
    });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
