import { useEffect, useState } from 'react';
import { useData } from '@/contexts/DataProvider';
import { useAuth } from '@/contexts/AuthContext';
import { DoorOpen, Apple, Baby, Smile, UtensilsCrossed, Moon, MapPin, Loader2, MessageSquare } from 'lucide-react';
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
};

const Hoje = () => {
  const { user } = useAuth();
  const { alunos, registros, fetchRegistrosAluno, loading, addRegistro } = useData();
  const [targetAlunoId, setTargetAlunoId] = useState<string | null>(null);

  useEffect(() => {
    // In a real flow, we'd lookup the student assigned to this parent
    // For now, let's pick the first student we find to show data
    if (alunos.length > 0 && !targetAlunoId) {
      setTargetAlunoId(alunos[0].id);
    }
  }, [alunos, targetAlunoId]);

  useEffect(() => {
    if (targetAlunoId) {
      fetchRegistrosAluno(targetAlunoId);
    }
  }, [targetAlunoId, fetchRegistrosAluno]);

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

  if (!targetAlunoId || registros.length === 0) {
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
        {registros.map(r => {
          const Icon = iconMap[r.tipo_registro] || Smile;
          const details = detailsMap[r.tipo_registro]?.(r.detalhes) || JSON.stringify(r.detalhes);

          return (
            <div key={r.id} className="relative flex gap-4 pb-6">
              <div className={`absolute left-[-20px] h-8 w-8 rounded-full bg-background border-2 border-border flex items-center justify-center`}>
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="ml-4 pt-1">
                <p className="text-xs text-muted-foreground font-medium">{r.hora_registro.slice(0, 5)}</p>
                <p className="text-sm text-foreground mt-0.5 font-medium">{details}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Hoje;
