import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

type Role = 'admin' | 'manager' | 'receptionist' | 'housekeeping' | 'staff' | 'guest';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: Role | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function loadProfile(u: User | null) {
    if (!u) {
      setRole(null);
      return;
    }
    const { data } = await supabase.from('profiles').select('role').eq('id', u.id).single();
    setRole((data?.role as Role) ?? 'staff');
  }

  useEffect(() => {
    // auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        const u = session?.user ?? null;
        setUser(u);
        await loadProfile(u);
        setLoading(false);
      }
    );
    // initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      const u = session?.user ?? null;
      setUser(u);
      await loadProfile(u);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/');
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { full_name: fullName, role: 'staff' }
        }
      });
      if (error) throw error;
      navigate('/');
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const hasRole = (...roles: Role[]) => {
    return !!role && roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, signIn, signUp, signOut, loading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
