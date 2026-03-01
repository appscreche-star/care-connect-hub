import { useEffect, useState } from 'react';
import { useData } from '@/contexts/DataProvider';
import { useAuth } from '@/contexts/AuthContext';
import { DoorOpen, Apple, Baby, Smile, UtensilsCrossed, Moon, MapPin, Loader2, MessageSquare, AlertTriangle, Clock, LayoutDashboard, History, Trophy, ChevronRight, Sparkles, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardCard from '@/components/DashboardCard';
import { CelebrationOverlay } from '@/components/CelebrationOverlay';
import { Badge } from '@/components/ui/badge';

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
  const { alunos, registros, fetchRegistrosAluno, loading, addRegistro, ocorrencias, refreshSaude, selectedAlunoId } = useData();
  const [celebration, setCelebration] = useState<{ open: boolean; titulo?: string; legenda?: string }>({ open: false });

  useEffect(() => {
    refreshSaude();
  }, [refreshSaude]);

  useEffect(() => {
    if (selectedAlunoId) {
      fetchRegistrosAluno(selectedAlunoId);
    }
  }, [selectedAlunoId, fetchRegistrosAluno]);

  // Process data for Dashboard
  const albumRegistros = registros.filter(r => r.aluno_id === selectedAlunoId && r.tipo_registro === 'album');
  const latestAlbum = albumRegistros.length > 0 ? albumRegistros[0] : null;
  const latestAlimentacao = registros.filter(r => r.aluno_id === selectedAlunoId && r.tipo_registro === 'alimentacao')[0];
  const latestSono = registros.filter(r => r.aluno_id === selectedAlunoId && r.tipo_registro === 'sono')[0];
  const latestFralda = registros.filter(r => r.aluno_id === selectedAlunoId && r.tipo_registro === 'fralda')[0];
  const activeOcorrencia = ocorrencias.filter(o => o.aluno_id === selectedAlunoId && o.notificado_pais)[0];

  // Combine and sort logs for Timeline Tab
  const timelineData = [
    ...registros.map(r => ({ ...r, source: 'registro' })),
    ...ocorrencias
      .filter(o => o.aluno_id === selectedAlunoId && o.notificado_pais)
      .map(o => ({
        id: o.id,
        tipo_registro: 'ocorrencia',
        detalhes: { titulo: o.titulo, descricao: o.descricao },
        hora_registro: format(new Date(o.data_hora), "HH:mm"),
        source: 'ocorrencia'
      }))
  ].sort((a, b) => b.hora_registro.localeCompare(a.hora_registro));

  const handleChegando = async () => {
    if (!selectedAlunoId) return;
    await addRegistro({
      aluno_id: selectedAlunoId,
      tipo_registro: 'chegando',
      detalhes: { status: 'a_caminho' }
    });
    fetchRegistrosAluno(selectedAlunoId);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <CelebrationOverlay
        open={celebration.open}
        titulo={celebration.titulo}
        legenda={celebration.legenda}
        onClose={() => setCelebration({ open: false })}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Bom dia! 👋</h1>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        <Button size="sm" variant="outline" className="rounded-full gap-2 border-primary text-primary hover:bg-primary/5 transition-all" onClick={handleChegando}>
          <MapPin className="h-4 w-4" /> Chegando
        </Button>
      </div>

      {activeOcorrencia && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-3xl p-4 flex items-center gap-4 animate-pulse">
          <div className="h-10 w-10 rounded-2xl bg-destructive text-white flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-destructive uppercase tracking-widest">⚠️ Atenção</p>
            <p className="text-sm font-black text-foreground">{activeOcorrencia.titulo}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-destructive/40" />
        </div>
      )}

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-2 rounded-2xl h-14 p-1 bg-muted/40 mb-6">
          <TabsTrigger value="dashboard" className="rounded-xl font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="timeline" className="rounded-xl font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <History className="h-4 w-4" /> Atividades
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Hero Highlight Card */}
          {latestAlbum ? (
            <div
              className="group relative h-64 rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer"
              onClick={() => {
                if (latestAlbum.detalhes?.conquista) {
                  setCelebration({
                    open: true,
                    titulo: latestAlbum.detalhes?.legenda || 'Conquista! 🎉',
                    legenda: 'Momento especial registrado hoje.'
                  });
                }
              }}
            >
              <img
                src={latestAlbum.detalhes?.foto_base64 || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80'}
                alt="Highlight"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {latestAlbum.detalhes?.conquista && (
                <div className="absolute top-4 right-4 bg-amber-400 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg z-10 animate-bounce">
                  <Trophy className="h-3 w-3" /> CONQUISTA
                </div>
              )}

              <div className="absolute bottom-6 left-6 right-6">
                <Badge className="bg-primary/20 backdrop-blur-md border-none text-[10px] font-bold mb-2">
                  <Sparkles className="h-3 w-3 mr-1" /> ÚLTIMA ATIVIDADE
                </Badge>
                <h3 className="text-white text-xl font-black leading-tight line-clamp-2">
                  {latestAlbum.detalhes?.legenda || 'Um momento especial do dia!'}
                </h3>
                <p className="text-white/60 text-xs font-medium mt-1">
                  {latestAlbum.detalhes?.categoria || 'Pedagógico'} • {latestAlbum.hora_registro}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-48 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-center p-6">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Camera className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-foreground">Prepare o coração!</p>
              <p className="text-xs text-muted-foreground mt-1">Logo teremos as primeiras fotos do dia.</p>
            </div>
          )}

          {/* Quick Status Grid */}
          <div className="grid grid-cols-2 gap-4">
            <DashboardCard
              title="Alimentação"
              value={latestAlimentacao?.detalhes?.status || 'Pendente'}
              subtitle={latestAlimentacao ? `Às ${latestAlimentacao.hora_registro}` : 'Aguardando registro'}
              icon={Apple}
              color="orange"
            />
            <DashboardCard
              title="Soneca"
              value={latestSono?.detalhes?.status === 'dormindo' ? 'Dormindo' : 'Acordado'}
              subtitle={latestSono ? `Desde ${latestSono.hora_registro}` : 'Não iniciou'}
              icon={Moon}
              color="purple"
            />
            <DashboardCard
              title="Higiene"
              value={latestFralda?.detalhes?.status || 'Ok'}
              subtitle={latestFralda ? `Troca às ${latestFralda.hora_registro}` : 'Nenhuma troca'}
              icon={Baby}
              color="blue"
            />
            <DashboardCard
              title="Humor"
              value={timelineData.find(r => r.tipo_registro === 'bemestar')?.detalhes?.humor || 'Bem'}
              subtitle="Atualizado agora"
              icon={Smile}
              color="green"
            />
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative pl-8">
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border/50" />
            {timelineData.map(r => {
              const Icon = iconMap[r.tipo_registro] || Smile;
              const details = detailsMap[r.tipo_registro]?.(r.detalhes) || JSON.stringify(r.detalhes);

              return (
                <div key={r.id} className="relative flex gap-4 pb-8">
                  <div className={cn(
                    "absolute left-[-20px] h-9 w-9 rounded-2xl bg-background border-2 flex items-center justify-center shadow-sm",
                    r.tipo_registro === 'ocorrencia' ? "border-destructive text-destructive" : "border-border text-primary"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="ml-4 pt-1 flex-1">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{r.hora_registro}</p>
                    <div className={cn(
                      "rounded-3xl p-5 mt-2 shadow-sm border",
                      r.tipo_registro === 'ocorrencia' ? "bg-destructive/5 border-destructive/10" : "bg-card border-border/40"
                    )}>
                      <p className={cn(
                        "text-sm font-bold leading-relaxed",
                        r.tipo_registro === 'ocorrencia' ? "text-destructive" : "text-foreground"
                      )}>{details}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Hoje;
