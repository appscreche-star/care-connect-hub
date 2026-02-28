import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, GraduationCap, Heart } from 'lucide-react';

const Login = () => {
  const { login, instituicao } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = (role: 'Admin' | 'Coordenador' | 'Professor' | 'Responsavel') => {
    login(role);
    const routes: Record<string, string> = {
      'Admin': '/admin/dashboard',
      'Coordenador': '/admin/dashboard',
      'Professor': '/educador/turma',
      'Responsavel': '/pais/hoje'
    };
    navigate(routes[role]);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        <CardHeader className="items-center text-center space-y-3 pb-2">
          <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
            <img src={instituicao.logo_url} alt="Logo" className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">{instituicao.nome}</CardTitle>
          <CardDescription>Faça login para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="••••••••" className="rounded-xl" />
            </div>
            <Button className="w-full rounded-xl h-12 text-base" disabled>
              Entrar
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Acesso rápido (teste)</span>
            </div>
          </div>

          <div className="grid gap-3">
            <Button variant="outline" className="h-12 rounded-xl gap-3 justify-start text-base" onClick={() => handleQuickLogin('Admin')}>
              <Shield className="h-5 w-5 text-primary" /> Entrar como Admin
            </Button>
            <Button variant="outline" className="h-12 rounded-xl gap-3 justify-start text-base" onClick={() => handleQuickLogin('Professor')}>
              <GraduationCap className="h-5 w-5 text-primary" /> Entrar como Educador
            </Button>
            <Button variant="outline" className="h-12 rounded-xl gap-3 justify-start text-base" onClick={() => handleQuickLogin('Responsavel')}>
              <Heart className="h-5 w-5 text-primary" /> Entrar como Pai
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
