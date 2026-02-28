import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataProvider';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const HomeTurma = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { alunos, loading, turmas, addRegistro } = useData();

  // Find the first turma or use a mock logic for demo
  const currentTurma = turmas[0];
  const turmaAlunos = currentTurma ? alunos.filter(a => a.turma_id === currentTurma.id) : [];

  const handleBatchAlimentacao = async () => {
    if (turmaAlunos.length === 0) return;

    // In a real flow, this would open a dialog to select type
    // For now, let's register "Aceitou tudo" for everyone in the class
    const promises = turmaAlunos.map(a =>
      addRegistro({
        aluno_id: a.id,
        tipo_registro: 'alimentacao',
        detalhes: { status: 'Aceitou tudo (em lote)' }
      })
    );

    await Promise.all(promises);
    toast({ title: `✅ Alimentação registrada para ${turmaAlunos.length} alunos!` });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-foreground">
        Turma {currentTurma?.nome_turma || 'Geral'}
      </h1>

      {turmaAlunos.length === 0 ? (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum aluno vinculado a esta turma.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {turmaAlunos.map(a => (
            <Card
              key={a.id}
              className="rounded-2xl cursor-pointer hover:shadow-md transition-all active:scale-95"
              onClick={() => navigate(`/educador/aluno/${a.id}`)}
            >
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {a.nome[0]}
                </div>
                <p className="text-sm font-semibold text-foreground">{a.nome}</p>
                <p className="text-xs text-muted-foreground">{a.idade || '-'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* FAB for Batch Action */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg p-0"
        onClick={handleBatchAlimentacao}
        disabled={turmaAlunos.length === 0}
      >
        <UtensilsCrossed className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default HomeTurma;
