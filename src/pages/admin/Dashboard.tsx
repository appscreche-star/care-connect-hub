import { useData } from '@/contexts/DataProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, Activity, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { alunos, turmas, registros, loading } = useData();

  const stats = [
    { label: 'Total de Alunos', value: alunos.length, icon: Users, color: 'text-blue-500 bg-blue-50' },
    { label: 'Turmas Ativas', value: turmas.length, icon: BookOpen, color: 'text-emerald-500 bg-emerald-50' },
    { label: 'Educadores', value: turmas.length, icon: GraduationCap, color: 'text-purple-500 bg-purple-50' }, // Approximation
    { label: 'Registros Hoje', value: registros.length, icon: Activity, color: 'text-amber-500 bg-amber-50' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Visão Geral</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          {registros.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma atividade registrada hoje.</p>
          ) : (
            <div className="space-y-3">
              {registros.slice(0, 5).map(r => (
                <div key={r.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/50 transition-colors">
                  <span className="text-xs text-muted-foreground w-12">{r.hora_registro.slice(0, 5)}</span>
                  <span className="text-sm text-foreground capitalize">
                    {r.tipo_registro}: {JSON.stringify(r.detalhes.status || r.detalhes.mensagem || r.detalhes)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
