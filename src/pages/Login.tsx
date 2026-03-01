import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, GraduationCap, Heart, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { login, instituicao } = useAuth();
  const { perfis } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    // Find profile by username and password
    const perfil = perfis.find(p => p.username === username && p.password === password);

    if (perfil) {
      login(perfil.role as any, { id: perfil.id, nome: perfil.nome, email: perfil.email });

      const routes: Record<string, string> = {
        'Admin': '/admin/dashboard',
        'Coordenador': '/admin/dashboard',
        'Professor': '/educador/home',
        'Responsavel': '/pais/hoje'
      };

      toast({
        title: `Bem-vindo, ${perfil.nome}! 👋`,
        description: 'Login realizado com sucesso.',
      });

      navigate(routes[perfil.role] || '/');
    } else {
      toast({
        title: '❌ Acesso Negado',
        description: 'Usuário ou senha incorretos. Tente novamente.',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const handleQuickLogin = (role: 'Admin' | 'Coordenador' | 'Professor' | 'Responsavel') => {
    const perfil = perfis.find(p => p.role === role);

    if (perfil) {
      login(role, { id: perfil.id, nome: perfil.nome, email: perfil.email });
    } else {
      login(role);
    }

    const routes: Record<string, string> = {
      'Admin': '/admin/dashboard',
      'Coordenador': '/admin/dashboard',
      'Professor': '/educador/home',
      'Responsavel': '/pais/hoje'
    };
    navigate(routes[role]);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
      <Card className="w-full max-w-md rounded-[2.5rem] shadow-2xl border-none overflow-hidden bg-card/80 backdrop-blur-xl">
        <div className="h-2 w-full bg-gradient-to-r from-primary via-indigo-400 to-purple-500" />
        <CardHeader className="items-center text-center space-y-3 pt-8 pb-4">
          <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-2 shadow-inner group">
            <img src={instituicao.logo_url} alt="Logo" className="h-14 w-14 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <CardTitle className="text-3xl font-black text-foreground tracking-tight">{instituicao.nome}</CardTitle>
          <CardDescription className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest leading-none mt-1">Portal de Acesso Unificado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-[10px] uppercase font-black text-muted-foreground ml-1 font-mono">Usuário</Label>
              <Input
                id="username"
                placeholder="Seu login personalizado"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="rounded-2xl h-14 font-bold border-muted-foreground/10 bg-muted/20 focus:ring-primary/20 text-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[10px] uppercase font-black text-muted-foreground ml-1 font-mono">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="rounded-2xl h-14 font-bold border-muted-foreground/10 bg-muted/20 focus:ring-primary/20 text-lg"
              />
            </div>
            <Button type="submit" className="w-full rounded-2xl h-14 text-lg font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]" disabled={loading}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Acessar Sistema'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted" /></div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="bg-card px-3 text-muted-foreground/60">Modo de Homologação</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="h-20 rounded-2xl flex-col gap-1.5 border-muted-foreground/10 hover:bg-primary/5 hover:text-primary transition-all active:scale-95" onClick={() => handleQuickLogin('Admin')}>
              <Shield className="h-5 w-5" />
              <span className="text-[10px] font-black uppercase tracking-tighter">Admin</span>
            </Button>
            <Button variant="outline" className="h-20 rounded-2xl flex-col gap-1.5 border-muted-foreground/10 hover:bg-primary/5 hover:text-primary transition-all active:scale-95" onClick={() => handleQuickLogin('Professor')}>
              <GraduationCap className="h-5 w-5" />
              <span className="text-[10px] font-black uppercase tracking-tighter">Educador</span>
            </Button>
            <Button variant="outline" className="h-20 rounded-2xl flex-col gap-1.5 border-muted-foreground/10 hover:bg-primary/5 hover:text-primary transition-all active:scale-95" onClick={() => handleQuickLogin('Responsavel')}>
              <Heart className="h-5 w-5" />
              <span className="text-[10px] font-black uppercase tracking-tighter">Pai</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
