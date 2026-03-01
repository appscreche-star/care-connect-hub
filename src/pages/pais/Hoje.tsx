import { useEffect, useState } from 'react';
import { useData } from '@/contexts/DataProvider';
import { useAuth } from '@/contexts/AuthContext';
import { DoorOpen, Apple, Baby, Smile, UtensilsCrossed, Moon, MapPin, Loader2, MessageSquare, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const iconMap: Record<string, React.ComponentType<any>> = {
  presenca: DoorOpen,
  alimentacao: Apple,
  fralda: Baby,
  bemestar: Smile,
  sono: Moon,
  recado: MessageSquare,
  chegando: MapPin,
  ocorrencia: AlertTriangle,
};

const detailsMap: Record<string, (d: any) => string> = {
  presenca: (d) => d.status === 'entrada' ? 'Entrada na creche' : 'Saída da creche',
  alimentacao: (d) => `Alimentação: ${d.status}${d.ml ? ` (${d.ml}ml)` : ''}`,
  fralda: (d) => `Troca de fralda: ${d.status}`,
  bemestar: (d) => `Humor: ${d.humor} ${d.emoji || ''}`,
  sono: (d) => d.status === 'dormindo' ? 'Iniciou soneca' : 'Acordou da soneca',
  recado: (d) => `Recado: ${d.mensagem}`,
  mochila: (d) => `Solicitação de item: ${d.item}`,
  chegando: () => 'A caminho da creche 🚗',
  ocorrencia: (d) => `Ocorrência: ${d.titulo} - ${d.descricao}`,
};

const Hoje = () => {
  const { user } = useAuth();
  const { alunos, registros, fetchRegistrosAluno, loading, addRegistro, ocorrencias, refreshSaude } = useData();
  const [targetAlunoId, setTargetAlunoId] = useState<string | null>(null);

  useEffect(() => {
    refreshSaude();
  }, [refreshSaude]);

  useEffect(() => {
    if (alunos.length > 0 && !targetAlunoId) {
      setTargetAlunoId(alunos[0].id);
    }
  }, [alunos, targetAlunoId]);

  useEffect(() => {
    if (targetAlunoId) {
      fetchRegistrosAluno(targetAlunoId);
    }
  }, [targetAlunoId, fetchRegistrosAluno]);

  // Combine and sort logs
  const timelineData = [
    ...registros.map(r => ({ ...r, source: 'registro' })),
    ...ocorrencias
      .filter(o => o.aluno_id === targetAlunoId && o.notificado_pais)
      .map(o => ({
        id: o.id,
        tipo_registro: 'ocorrencia',
        detalhes: { titulo: o.titulo, descricao: o.descricao },
        hora_registro: format(new Date(o.data_hora), "HH:mm"),
        source: 'ocorrencia'
      }))
  ].sort((a, b) => b.hora_registro.localeCompare(a.hora_registro));

  const handleChegando = async () => {
    if (!targetAlunoId) return;
    await addRegistro({
      aluno_id: targetAlunoId,
      tipo_registro: 'chegando',
      detalhes: { status: 'a_caminho' }
    });
    fetchRegistrosAluno(targetAlunoId);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  if (!targetAlunoId || timelineData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="text-6xl">🌅</div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">O dia está apenas começando!</h2>
          <p className="text-sm text-muted-foreground mt-2">Em breve teremos atualizações sobre o dia do seu filho.</p>
        </div>
        <Button className="rounded-xl gap-2 h-14 px-8" onClick={handleChegando}>
          <MapPin className="h-5 w-5" /> Estou Chegando
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-foreground">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
        </h1>
        <Button size="sm" variant="outline" className="rounded-full gap-2 border-primary text-primary" onClick={handleChegando}>
          <MapPin className="h-4 w-4" /> Chegando
        </Button>
      </div>

      <div className="relative pl-8">
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />
        {timelineData.map(r => {
          const Icon = iconMap[r.tipo_registro] || Smile;
          const details = detailsMap[r.tipo_registro]?.(r.detalhes) || JSON.stringify(r.detalhes);

          return (
            <div key={r.id} className="relative flex gap-4 pb-6">
              <div className={`absolute left-[-20px] h-8 w-8 rounded-full bg-background border-2 border-border flex items-center justify-center`}>
                <Icon className={cn("h-4 w-4", r.tipo_registro === 'ocorrencia' ? "text-destructive" : "text-primary")} />
              </div>
              <div className="ml-4 pt-1">
                <p className="text-xs text-muted-foreground font-medium">{r.hora_registro.slice(0, 5)}</p>
                <div className={cn(
                  "rounded-2xl p-4 mt-1",
                  r.tipo_registro === 'ocorrencia' ? "bg-destructive/5 border border-destructive/10" : "bg-muted/30"
                )}>
                  <p className={cn(
                    "text-sm font-medium",
                    r.tipo_registro === 'ocorrencia' ? "text-destructive" : "text-foreground"
                  )}>{details}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Hoje;
