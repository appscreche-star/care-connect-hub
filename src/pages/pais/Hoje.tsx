import { useEffect, useState } from 'react';
import { useData } from '@/contexts/DataProvider';
import { useAuth } from '@/contexts/AuthContext';
import { DoorOpen, Apple, Baby, Smile, UtensilsCrossed, Moon, MapPin, Loader2, MessageSquare, AlertTriangle, Clock, LayoutDashboard, History, Trophy, ChevronRight, Sparkles, Camera, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardCard from '@/components/DashboardCard';
import { CelebrationOverlay } from '@/components/CelebrationOverlay';
import { Badge } from '@/components/ui/badge';
import ActionMenu, { type MenuItem } from '@/components/ActionMenu';
import { Thermometer, Droplets, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const menuItems: MenuItem[] = [
    { id: 'presenca', label: 'Presença', icon: DoorOpen, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'saude', label: 'Saúde', icon: Thermometer, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'higiene', label: 'Higiene', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'bemestar', label: 'Bem-estar', icon: Smile, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'alimentacao', label: 'Refeição', icon: UtensilsCrossed, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'sono', label: 'Sono', icon: Moon, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'fralda', label: 'Fralda', icon: Baby, color: 'text-amber-700', bg: 'bg-amber-50' },
    { id: 'album', label: 'Álbum', icon: Camera, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'ocorrencia', label: 'Ocorrência', icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/5' },
    { id: 'mochila', label: 'Mochila', icon: Package, color: 'text-slate-500', bg: 'bg-slate-50' },
    { id: 'recados', label: 'Recados', icon: MessageSquare, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  ];

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
    <div className="space-y-4 pb-10">
      <CelebrationOverlay
        open={celebration.open}
        titulo={celebration.titulo}
        legenda={celebration.legenda}
        onClose={() => setCelebration({ open: false })}
      />

      {/* Header Compacto */}
      <div className="flex items-center justify-between bg-card/50 backdrop-blur-sm p-4 rounded-[2rem] border border-border/40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-primary/10 rounded-2xl flex flex-col items-center justify-center text-primary border border-primary/20">
            <span className="text-lg font-black leading-none">{format(new Date(), "dd")}</span>
            <span className="text-[8px] font-bold uppercase tracking-tighter">{format(new Date(), "MMM", { locale: ptBR })}</span>
          </div>
          <div>
            <h1 className="text-base font-black text-foreground">{format(new Date(), "EEEE", { locale: ptBR })}</h1>
            <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-400" /> Rotina de hoje
            </p>
          </div>
        </div>
        {/* Removido botão redundante aqui conforme solicitado */}
      </div>

      {activeOcorrencia && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-3 flex items-center gap-3 animate-pulse">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <div className="flex-1">
            <p className="text-[10px] font-black text-destructive uppercase">⚠️ Alerta de Saúde</p>
            <p className="text-xs font-bold">{activeOcorrencia.titulo}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-destructive/40" />
        </div>
      )}

      {/* Layout Compacto (Agenda) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

        {/* Coluna 1: Rotina do Dia (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <Card className="rounded-[2rem] border-none shadow-sm bg-card/60 p-5 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5"><LayoutDashboard className="h-12 w-12" /></div>
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Rotina do Dia
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Moon className="h-4 w-4" /></div>
                  <span className="text-xs font-bold">Soneca</span>
                </div>
                <span className="text-xs font-black">
                  {latestSono ? `${latestSono.hora_registro.includes(':') ? latestSono.hora_registro.slice(0, 5) : latestSono.hora_registro} - ${latestSono.detalhes?.status === 'dormindo' ? '...' : 'Acordou'}` : '--:--'}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Droplets className="h-4 w-4" /></div>
                  <span className="text-xs font-bold">Troca Fraldas</span>
                </div>
                <div className="flex gap-1">
                  {registros.filter(r => r.tipo_registro === 'fralda').slice(0, 3).map(r => (
                    <Badge key={r.id} variant="outline" className="text-[9px] px-1.5 py-0 rounded-lg">{r.hora_registro}</Badge>
                  ))}
                  {registros.filter(r => r.tipo_registro === 'fralda').length === 0 && <span className="text-[10px] text-muted-foreground">Pendente</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                  <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Humor</p>
                  <p className="text-xs font-bold flex items-center gap-1">
                    {timelineData.find(r => r.tipo_registro === 'bemestar')?.detalhes?.humor || 'Bem'}
                    {timelineData.find(r => r.tipo_registro === 'bemestar')?.detalhes?.emoji || '😊'}
                  </p>
                </div>
                <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100/50">
                  <p className="text-[9px] font-black text-rose-600 uppercase mb-1">Febre</p>
                  <p className="text-xs font-bold">
                    {ocorrencias.find(o => o.titulo.toLowerCase().includes('febre'))?.detalhes?.temperatura || 'Não'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-sm bg-indigo-50/30 p-5 overflow-hidden relative group cursor-pointer">
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Camera className="h-3.5 w-3.5" /> Últimas Fotos
            </h3>
            {latestAlbum ? (
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl overflow-hidden shadow-sm">
                  <img src={latestAlbum.detalhes?.foto_base64} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-foreground line-clamp-1">{latestAlbum.detalhes?.legenda}</p>
                  <p className="text-[9px] text-muted-foreground">{latestAlbum.hora_registro}</p>
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-muted-foreground italic">Aguardando as primeiras fotos...</p>
            )}
          </Card>
        </div>

        {/* Coluna 2: Alimentação (5 cols) */}
        <div className="md:col-span-5">
          <Card className="rounded-[2rem] border-none shadow-sm bg-card p-5 h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><UtensilsCrossed className="h-12 w-12" /></div>
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Alimentação
            </h3>

            <div className="space-y-2">
              <div className="grid grid-cols-12 px-2 text-[9px] font-black text-muted-foreground uppercase tracking-tighter mb-1">
                <div className="col-span-6">Refeição</div>
                <div className="col-span-6 text-right">Consumo</div>
              </div>

              {registros.filter(r => r.tipo_registro === 'alimentacao').length > 0 ? (
                registros.filter(r => r.tipo_registro === 'alimentacao').map(r => (
                  <div key={r.id} className="grid grid-cols-12 items-center p-2.5 rounded-2xl border border-border/40 hover:bg-muted/30 transition-colors">
                    <div className="col-span-6">
                      <p className="text-xs font-bold leading-none">{r.detalhes?.refeicao || 'Alimentação'}</p>
                      <p className="text-[9px] text-muted-foreground mt-1">{r.hora_registro}</p>
                    </div>
                    <div className="col-span-6 flex justify-end gap-1">
                      <div className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded-lg border",
                        r.detalhes?.status === 'Tudo' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                          r.detalhes?.status === 'Parte' ? "bg-amber-50 text-amber-700 border-amber-100" :
                            "bg-rose-50 text-rose-700 border-rose-100"
                      )}>
                        {r.detalhes?.status || 'Registrado'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center border-2 border-dashed border-muted rounded-3xl">
                  <UtensilsCrossed className="h-6 w-6 mx-auto mb-2 text-muted/30" />
                  <p className="text-[10px] text-muted-foreground font-medium">Aguardando cardápio de hoje</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Coluna 3: Meds & Recados (3 cols) */}
        <div className="md:col-span-3 space-y-4">
          <Card className="rounded-[2rem] border-none shadow-sm bg-card p-5 border-l-4 border-l-rose-400">
            <h3 className="text-xs font-black text-rose-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Thermometer className="h-3.5 w-3.5" /> Medicamentos
            </h3>
            <div className="space-y-3">
              {ocorrencias.filter(o => o.titulo.toLowerCase().includes('remédio')).length > 0 ? (
                ocorrencias.filter(o => o.titulo.toLowerCase().includes('remédio')).map(r => (
                  <div key={r.id} className="space-y-1">
                    <p className="text-xs font-black leading-none">{r.titulo}</p>
                    <p className="text-[9px] text-muted-foreground">{r.descricao}</p>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-muted-foreground italic">Nenhum agendado</p>
              )}
            </div>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-sm bg-amber-50/50 p-5 h-[calc(100%-8rem)]">
            <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5" /> Recados
            </h3>
            <div className="space-y-4 overflow-auto max-h-48 pr-2 custom-scrollbar">
              {registros.filter(r => r.tipo_registro === 'recado').length > 0 ? (
                registros.filter(r => r.tipo_registro === 'recado').map(r => (
                  <div key={r.id} className="bg-white/60 p-3 rounded-2xl border border-amber-100 shadow-sm">
                    <p className="text-[10px] font-bold text-amber-800 leading-relaxed italic">
                      "{r.detalhes?.mensagem}"
                    </p>
                    <p className="text-[8px] text-amber-600/60 font-black mt-2 text-right uppercase">{r.hora_registro}</p>
                  </div>
                ))
              ) : (
                <div className="h-24 flex flex-col items-center justify-center text-center opacity-40">
                  <MessageSquare className="h-5 w-5 mb-1" />
                  <p className="text-[9px] font-bold">Sem recados</p>
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Hoje;
