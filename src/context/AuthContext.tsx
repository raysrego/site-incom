import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { Profile } from '../lib/database.types';
import { supabase } from '../lib/supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, fullName: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  claimInitialAdmin: () => Promise<string | null>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function readProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) {
    console.error('profile lookup failed', error);
    return null;
  }
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = async (nextSession: Session | null) => {
    setSession(nextSession);
    setProfile(nextSession?.user ? await readProfile(nextSession.user.id) : null);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) void loadSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        void loadSession(nextSession);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    profile,
    loading,
    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('sign in failed', error);
        return 'Não foi possível entrar. Confira seu e-mail e senha.';
      }
      return null;
    },
    signUp: async (email, password, fullName) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) {
        console.error('sign up failed', error);
        return 'Não foi possível criar o acesso. Verifique os dados informados.';
      }
      return null;
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
    claimInitialAdmin: async () => {
      const { error } = await supabase.rpc('claim_initial_admin');
      if (error) {
        console.error('initial admin claim failed', error);
        return 'O acesso administrativo inicial já foi configurado.';
      }
      if (session?.user) {
        setProfile(await readProfile(session.user.id));
      }
      return null;
    },
    refreshProfile: async () => {
      if (session?.user) {
        setProfile(await readProfile(session.user.id));
      }
    },
  }), [loading, profile, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
