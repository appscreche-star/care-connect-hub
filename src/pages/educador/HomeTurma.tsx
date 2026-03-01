import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useData } from '@/contexts/DataProvider';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Check, Moon, ShieldAlert, Users, ChevronLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const HomeTurma = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { alunos, loading, turmas, addRegistro, registros } = useData();

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedAlunos, setSelectedAlunos] = useState<string[]>([]);

  const currentTurma = turmas.find(t => t.id === id);
  const turmaAlunos = currentTurma ? alunos.filter(a => a.turma_id === currentTurma.id) : [];

  const toggleAlunoSelection = (alunoId: string) => {
    setSelectedAlunos(prev => {
      if (prev.includes(alunoId)) {
        return prev.filter(id => id !== alunoId);
      }
      if (prev.length >= 5) {
        toast({
          title: '⚠️ Limite atingido',
          description: 'Você pode selecionar no máximo 5 alunos por vez.',
          variant: 'destructive'
        });
        return prev;
      }
      return [...prev, alunoId];
    });
  };

  const handleBatchAction = async (tipo: string, detalhes: any, label: string) => {
    const list = selectionMode ? selectedAlunos : [];
    if (list.length === 0) return;

    const promises = list.map(alunoId =>
      addRegistro({
        aluno_id: alunoId,
        tipo_registro: tipo,
        detalhes
      })
    );

    await Promise.all(promises);
    toast({ title: `✅ ${label} registrado para ${list.length} alunos!` });
    setSelectedAlunos([]);
    setSelectionMode(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/educador/home')}
              className="rounded-2xl h-12 w-12 bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-black text-foreground tracking-tight">
                {currentTurma?.nome_turma || 'Turma'}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{turmaAlunos.length} Alunos</p>
              </div>
            </div>
          </div>
          <Button
            variant={selectionMode ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-[1.25rem] h-11 px-5 gap-2 font-bold transition-all duration-300 shadow-sm",
              selectionMode ? "bg-primary shadow-primary/20 scale-105" : "hover:border-primary hover:text-primary"
            )}
            onClick={() => {
              setSelectionMode(!selectionMode);
              setSelectedAlunos([]);
            }}
          >
            {selectionMode ? 'Concluir' : <><Users className="h-4 w-4" /> Seleção Múltipla</>}
          </Button>
        </div>
      </div>

      {turmaAlunos.length === 0 ? (
        <Card className="rounded-[2.5rem] border-dashed border-2 bg-muted/20">
          <CardContent className="p-20 text-center text-muted-foreground font-medium">
            Nenhum aluno vinculado a esta turma.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {turmaAlunos.map(a => {
            const isSelected = selectedAlunos.includes(a.id);
            const hasCheckin = registros.some(r => r.aluno_id === a.id && r.tipo_registro === 'presenca' && r.detalhes?.status === 'entrada');
            const criticalHealth = a.alergias || a.restricoes_alimentares;

            return (
              <Card
                key={a.id}
                className={cn(
                  "rounded-[2.5rem] border-none cursor-pointer transition-all duration-300 relative overflow-hidden group shadow-sm hover:shadow-xl",
                  isSelected ? "ring-4 ring-primary bg-primary/5 scale-[0.98]" : "bg-card hover:-translate-y-1"
                )}
                onClick={() => selectionMode ? toggleAlunoSelection(a.id) : navigate(`/educador/aluno/${a.id}`)}
              >
                <CardContent className="p-5 flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <div className={cn(
                      "h-24 w-24 rounded-[2rem] overflow-hidden border-4 transition-transform duration-500 group-hover:scale-105",
                      hasCheckin ? "border-emerald-500/30" : "border-slate-100 dark:border-slate-800",
                      isSelected ? "border-primary" : ""
                    )}>
                      {a.foto_url ? (
                        <img src={a.foto_url} alt={a.nome} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-primary/10 flex items-center justify-center text-3xl font-black text-primary">
                          {a.nome[0]}
                        </div>
                      )}
                    </div>

                    {/* Multi-selection Checkmark */}
                    {selectionMode && (
                      <div className={cn(
                        "absolute -top-1 -right-1 h-8 w-8 rounded-2xl border-4 flex items-center justify-center transition-all duration-300 z-10",
                        isSelected ? "bg-primary border-background text-white scale-110 rotate-0" : "bg-background/80 backdrop-blur-sm border-muted-foreground/20 text-transparent rotate-12"
                      )}>
                        {isSelected && <Check className="h-5 w-5 stroke-[4px]" />}
                      </div>
                    )}

                    {/* Status Ring for Check-in */}
                    {hasCheckin && !selectionMode && (
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full border-4 border-background flex items-center justify-center shadow-lg">
                        <Check className="h-3 w-3 text-white stroke-[4px]" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 w-full">
                    <p className="text-base font-black text-foreground leading-tight line-clamp-1">{a.nome.split(' ')[0]}</p>

                    <div className="flex flex-wrap justify-center gap-1.5">
                      {hasCheckin && (
                        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-tighter">
                          PRESENTE
                        </div>
                      )}
                      {criticalHealth && (
                        <div className="flex items-center gap-1 text-[10px] font-black text-white bg-destructive px-2.5 py-1 rounded-full border border-destructive shadow-md animate-pulse uppercase tracking-tighter">
                          <ShieldAlert className="h-3 w-3" /> ALERTA
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Luxury Action Bar for Selection Mode */}
      {selectionMode && selectedAlunos.length > 0 && (
        <div className="fixed bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[2.5rem] p-4 flex items-center gap-4 z-50 animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-500">
          <div className="flex flex-col items-center justify-center px-4 py-2 bg-primary/10 rounded-3xl min-w-[80px]">
            <span className="text-xl font-black text-primary leading-none">{selectedAlunos.length}</span>
            <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest mt-1">Alunos</span>
          </div>

          <div className="flex-1 flex gap-2">
            <Button
              size="lg"
              className="flex-1 rounded-[1.5rem] h-14 gap-2 bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 font-bold border-none transition-all active:scale-95"
              onClick={() => handleBatchAction('presenca', { status: 'entrada' }, 'Check-in')}
            >
              <Check className="h-5 w-5 stroke-[3px]" /> Check-in
            </Button>
            <Button
              size="lg"
              className="flex-1 rounded-[1.5rem] h-14 gap-2 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20 font-bold border-none transition-all active:scale-95"
              onClick={() => handleBatchAction('sono', { status: 'dormindo' }, 'Soneca')}
            >
              <Moon className="h-5 w-5" /> Soneca
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeTurma;
