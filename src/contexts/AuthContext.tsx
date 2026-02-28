import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { type Usuario, type Instituicao } from '@/data/mockData';

interface AuthContextType {
  user: Usuario | null;
  instituicao: Instituicao;
  isOnline: boolean;
  login: (role: 'Admin' | 'Coordenador' | 'Professor' | 'Responsavel') => void;
  logout: () => void;
  toggleOnline: () => void;
  setPrimaryColor: (hsl: string) => void;
  loading: boolean;
}

export const DEFAULT_INST: Instituicao = {
  id: '00000000-0000-0000-0000-000000000000', // Valid dummy UUID
  nome: 'Elo Creche',
  logo_url: '/placeholder.svg',
  cor_primaria: '234 89% 74%',
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be in AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [inst, setInst] = useState<Instituicao>(DEFAULT_INST);
  const [loading, setLoading] = useState(true);

  const fetchInstituicao = useCallback(async () => {
    const { data, error } = await supabase.from('instituicoes').select('*').limit(1).maybeSingle();
    if (data) {
      setInst(data);
      if (data.cor_primaria) {
        document.documentElement.style.setProperty('--primary', data.cor_primaria);
      }
    } else if (!error) {
      // Create default if none exists
      const { data: newInst } = await supabase.from('instituicoes').insert([
        { nome: 'Elo Creche', cor_primaria: '234 89% 74%', logo_url: '/placeholder.svg' }
      ]).select().single();
      if (newInst) setInst(newInst);
    }
  }, []);

  useEffect(() => {
    fetchInstituicao().finally(() => setLoading(false));
  }, [fetchInstituicao]);

  const login = useCallback((role: 'Admin' | 'Coordenador' | 'Professor' | 'Responsavel') => {
    // For now, allow quick login with a dummy user if Supabase Auth is not used
    setUser({
      id: role === 'Admin' ? '1' : '2',
      role,
      nome: role,
      email: `${role.toLowerCase()}@creche.com`,
      instituicao_id: inst.id || DEFAULT_INST.id
    });
  }, [inst.id]);

  const logout = useCallback(() => setUser(null), []);
  const toggleOnline = useCallback(() => setIsOnline(p => !p), []);

  const setPrimaryColor = useCallback(async (hsl: string) => {
    document.documentElement.style.setProperty('--primary', hsl);
    setInst(prev => ({ ...prev, cor_primaria: hsl }));
    if (inst.id !== DEFAULT_INST.id) {
      await supabase.from('instituicoes').update({ cor_primaria: hsl }).eq('id', inst.id);
    }
  }, [inst.id]);

  return (
    <AuthContext.Provider value={{
      user, instituicao: inst, isOnline, login, logout, toggleOnline, setPrimaryColor, loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
