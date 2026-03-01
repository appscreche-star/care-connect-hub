import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useData, type RegistroDiario } from '@/contexts/DataProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, LogIn, LogOut, Smile, Meh, Moon as MoonIcon, Frown, UtensilsCrossed, Baby, ShirtIcon, Camera, MessageSquare, Pill, Check, Loader2, ShieldAlert, Thermometer, Droplets, Sparkles, Plus, History, AlertTriangle, ImagePlus, X as XIcon, FileImage, Clock, DoorOpen, Package } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import ActionMenu from '@/components/ActionMenu';

const moods = [
  { label: 'Feliz', icon: Smile, emoji: '😊' },
  { label: 'Tranquilo', icon: Meh, emoji: '😌' },
  { label: 'Cansado', icon: MoonIcon, emoji: '😴' },
  { label: 'Manhoso', icon: Frown, emoji: '😢' },
];

// Album state & types
const ACTIVITY_TYPES = [
  { value: 'Atividade Motora', emoji: '🏃', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { value: 'Hora da História', emoji: '📖', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { value: 'Recreio / Parquinho', emoji: '🛝', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { value: 'Artes / Pintura', emoji: '🎨', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { value: 'Música e Dança', emoji: '🎵', color: 'text-pink-600 bg-pink-50 border-pink-200' },
  { value: 'Descoberta Sensorial', emoji: '🔬', color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
  { value: 'Outros', emoji: '⭐', color: 'text-slate-600 bg-slate-50 border-slate-200' },
];

const OcorrenciaCard = ({ aluno, addOcorrencia }: { aluno: any, addOcorrencia: any }) => {
  const [tipo, setTipo] = useState('');
  const [horario, setHorario] = useState(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
  const [descricao, setDescricao] = useState('');
  const [providencias, setProvidencias] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!tipo || !descricao) {
      toast({ title: "⚠️ Campos obrigatórios", description: "Informe o tipo e a descrição.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const fullDesc = `${descricao}${providencias ? `\n\nProvidências: ${providencias}` : ''}\nHorário: ${horario}`;

      await addOcorrencia({
        aluno_id: aluno.id,
        titulo: tipo,
        descricao: fullDesc,
        notificado_pais: false // Approval flow
      });

      setTipo('');
      setDescricao('');
      setProvidencias('');
      toast({ title: "📨 Enviado", description: "Ocorrência enviada para validação da coordenação." });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl border-none shadow-md bg-card border-l-4 border-l-destructive overflow-hidden animate-in slide-in-from-right duration-500 mb-6">
      <CardHeader className="pb-2 bg-destructive/5">
        <CardTitle className="text-base flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" /> Registro de Ocorrência
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Tipo de Incidente</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="rounded-xl h-11 border-destructive/20 focus:ring-destructive/30">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Queda / Escoriação">🤕 Queda / Escoriação</SelectItem>
                <SelectItem value="Mordida">🦷 Mordida</SelectItem>
                <SelectItem value="Indisposição / Febre">🌡️ Indisposição / Febre</SelectItem>
                <SelectItem value="Conflito">🤝 Conflito entre Colegas</SelectItem>
                <SelectItem value="Outros">⚠️ Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Horário</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                className="rounded-xl h-11 pl-9 border-destructive/20"
                value={horario}
                onChange={e => setHorario(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Descrição Detalhada</Label>
          <Textarea
            placeholder="O que aconteceu exatamente?"
            className="rounded-xl min-h-[80px] border-destructive/20 focus:ring-destructive/30"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Providências Tomadas</Label>
          <Input
            placeholder="Gelo, limpeza, comunicado..."
            className="rounded-xl h-11 border-destructive/20 focus:ring-destructive/30"
            value={providencias}
            onChange={e => setProvidencias(e.target.value)}
          />
        </div>

        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-[10px] text-amber-800 leading-tight">
            <b>Fluxo de Segurança:</b> Este registro será enviado para a <b>Coordenação</b> validar antes de ser liberado para os pais.
          </p>
        </div>

        <Button
          variant="destructive"
          className="w-full rounded-2xl h-12 font-black shadow-lg shadow-destructive/20 transition-all hover:scale-[1.02]"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar para Coordenação"}
        </Button>
      </CardContent>
    </Card>
  );
};

const PerfilAluno = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { alunos, loading, addRegistro, registros, fetchRegistrosAluno, addOcorrencia } = useData();
  const aluno = alunos.find(a => a.id === id);

  const [checkedIn, setCheckedIn] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [sleeping, setSleeping] = useState(false);
  const [sleepCount, setSleepCount] = useState(0);
  const [mlBottle, setMlBottle] = useState('');
  const [selectedFeeding, setSelectedFeeding] = useState<string | null>(null);

  // Hygiene counters & states
  const [xixi, setXixi] = useState({ count: 0, tipo: null as string | null });
  const [coco, setCoco] = useState({ count: 0, tipo: null as string | null });

  // Album state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [albumFoto, setAlbumFoto] = useState<string | null>(null);
  const [albumCategoria, setAlbumCategoria] = useState('');
  const [albumLegenda, setAlbumLegenda] = useState('');
  const [albumConquista, setAlbumConquista] = useState(false);
  const [albumLoading, setAlbumLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');

  const menuItems = [
    { id: 'presenca', label: 'Presença', icon: DoorOpen, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'saude', label: 'Saúde', icon: Thermometer, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'higiene', label: 'Higiene', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'bemestar', label: 'Bem-estar', icon: Smile, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'alimentacao', label: 'Refeição', icon: UtensilsCrossed, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'sono', label: 'Sono', icon: MoonIcon, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'fralda', label: 'Fralda', icon: Baby, color: 'text-amber-700', bg: 'bg-amber-50' },
    { id: 'album', label: 'Álbum', icon: Camera, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'ocorrencia', label: 'Ocorrência', icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/5' },
    { id: 'mochila', label: 'Mochila', icon: Package, color: 'text-slate-500', bg: 'bg-slate-50' },
    { id: 'recados', label: 'Recados', icon: MessageSquare, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAlbumFoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handlePublishAlbum = useCallback(async () => {
    if (!aluno) return;
    if (!albumFoto && !albumLegenda) {
      toast({ title: '⚠️ Adicione uma foto ou legenda', variant: 'destructive' });
      return;
    }
    setAlbumLoading(true);
    await addRegistro({
      aluno_id: aluno.id,
      tipo_registro: 'album',
      detalhes: {
        foto_base64: albumFoto,
        categoria: albumCategoria || 'Outros',
        legenda: albumLegenda,
        conquista: albumConquista,
      },
    });

    if (albumConquista) {
      toast({
        title: '🏆 Conquista publicada!',
        description: `Os pais de ${aluno.nome.split(' ')[0]} serão notificados com uma celebração especial! 🎉`,
        duration: 5000,
      });
    } else {
      toast({ title: '📸 Publicado no álbum!' });
    }

    // Reset form
    setAlbumFoto(null);
    setAlbumCategoria('');
    setAlbumLegenda('');
    setAlbumConquista(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setAlbumLoading(false);
  }, [aluno, albumFoto, albumCategoria, albumLegenda, albumConquista, addRegistro]);

  useEffect(() => {
    if (id) fetchRegistrosAluno(id);
  }, [id, fetchRegistrosAluno]);

  useEffect(() => {
    // Basic logic to determine current status based on last registros
    const lastCheckin = registros.find(r => r.tipo_registro === 'presenca');
    if (lastCheckin) setCheckedIn(lastCheckin.detalhes?.status === 'entrada');

    const lastMood = registros.find(r => r.tipo_registro === 'bemestar');
    if (lastMood) setSelectedMood(lastMood.detalhes?.humor);

    const lastSleep = registros.find(r => r.tipo_registro === 'sono');
    if (lastSleep) setSleeping(lastSleep.detalhes?.status === 'dormindo');
    const todaySleeps = registros.filter(r => r.tipo_registro === 'sono' && r.detalhes?.status === 'dormindo');
    setSleepCount(todaySleeps.length);
    const lastFeeding = registros.find(r => r.tipo_registro === 'alimentacao');
    if (lastFeeding) setSelectedFeeding(lastFeeding.detalhes?.status ?? null);
  }, [registros]);

  if (loading || !aluno) {
    if (!aluno && !loading) return <div className="p-8 text-center"><p>Aluno não encontrado</p><Button variant="link" onClick={() => navigate(-1)}>Voltar</Button></div>;
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const handleAction = async (tipo: string, detalhes: any, msg: string) => {
    await addRegistro({ aluno_id: aluno.id, tipo_registro: tipo, detalhes });
    await fetchRegistrosAluno(aluno.id);
  };

  return (
    <div className="space-y-4 pb-12 overflow-x-hidden">
      {/* Top Header & Student Info */}
      <div className="flex items-center justify-between bg-card/40 backdrop-blur-sm p-4 rounded-[2rem] border border-border/40 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-background rounded-2xl hover:bg-muted transition-colors shadow-sm border">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-[1.25rem] bg-indigo-500 overflow-hidden flex items-center justify-center text-xl font-black text-white border-2 border-white shadow-lg">
              {aluno.foto_url ? (
                <img src={aluno.foto_url} alt={aluno.nome} className="h-full w-full object-cover" />
              ) : (
                aluno.nome[0]
              )}
            </div>
            <div>
              <h1 className="text-lg font-black text-foreground leading-tight tracking-tight">{aluno.nome}</h1>
              <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">{aluno.idade || 'Turma A'}</span>
            </div>
          </div>
        </div>

        {/* Quick Presence Toggle */}
        <Button
          onClick={() => handleAction('presenca', { status: checkedIn ? 'saida' : 'entrada' }, checkedIn ? 'Saída' : 'Entrada')}
          className={cn(
            "rounded-2xl h-12 px-6 font-black shadow-lg transition-all active:scale-95 gap-2",
            checkedIn ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20" : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
          )}
        >
          {checkedIn ? <><LogOut className="h-4 w-4" /> Registrar Saída</> : <><LogIn className="h-4 w-4" /> Registrar Entrada</>}
        </Button>
      </div>

      {/* Health Alerts Bar (Slanted Design) */}
      {(aluno.alergias || aluno.medicamentos_uso_continuo) && (
        <div className="bg-destructive/10 border-l-4 border-l-destructive rounded-r-2xl p-3 flex items-center gap-3 animate-pulse">
          <ShieldAlert className="h-4 w-4 text-destructive" />
          <div className="flex-1">
            <p className="text-[10px] font-black text-destructive uppercase tracking-tighter">⚠️ Alertas Críticos</p>
            <p className="text-xs font-bold text-foreground">
              {aluno.alergias && `Alergia: ${aluno.alergias}`}
              {aluno.medicamentos_uso_continuo && ` • Medicamento: ${aluno.medicamentos_uso_continuo}`}
            </p>
          </div>
        </div>
      )}

      {/* ACTION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

        {/* Col 1: Feeding & Sleep */}
        <div className="md:col-span-5 space-y-4">

          {/* ALIMENTAÇÃO */}
          <Card className="rounded-[2rem] border-none shadow-sm bg-card p-5">
            <h3 className="text-[11px] font-black text-orange-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <UtensilsCrossed className="h-3.5 w-3.5" /> Alimentação
            </h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: 'Aceitou tudo', emoji: '🥗' },
                { label: 'Aceitou metade', emoji: '🥣' },
                { label: 'Recusou', emoji: '❌' }
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => { setSelectedFeeding(opt.label); handleAction('alimentacao', { status: opt.label, ml: mlBottle }, ''); }}
                  className={cn(
                    "flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl text-[9px] font-black uppercase border-2 transition-all",
                    selectedFeeding === opt.label
                      ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-200"
                      : "bg-muted/30 text-muted-foreground border-transparent hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                  )}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-muted/30 rounded-2xl px-4 py-2">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider shrink-0">Mamadeira</span>
              <Input
                placeholder="0 ml"
                type="number"
                value={mlBottle}
                onChange={e => setMlBottle(e.target.value)}
                onBlur={e => { if (e.target.value) handleAction('alimentacao', { ml: e.target.value, status: selectedFeeding || 'Registrado' }, ''); }}
                className="flex-1 h-8 font-black text-sm bg-transparent border-none focus:ring-0 p-0 text-right"
              />
              <span className="text-[10px] text-muted-foreground font-bold">ml/dia</span>
            </div>
          </Card>

          {/* CONTROLE DE SONO */}
          <Card className="rounded-[2rem] border-none shadow-sm bg-indigo-500 p-5 text-white">
            <h3 className="text-[11px] font-black uppercase tracking-widest mb-3 opacity-80 flex items-center gap-2">
              <MoonIcon className="h-3.5 w-3.5" /> Controle de Soneca
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-xl font-black">{sleeping ? 'Dormindo...' : 'Acordado'}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-bold opacity-60 uppercase">Dormiu hoje:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSleepCount(c => Math.max(0, c - 1))}
                      className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-black hover:bg-white/30"
                    >−</button>
                    <span className="text-sm font-black tabular-nums w-4 text-center">{sleepCount}</span>
                    <button
                      onClick={() => { handleAction('sono', { status: 'dormindo', vezes: sleepCount + 1 }, ''); setSleepCount(c => c + 1); }}
                      className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-black hover:bg-white/30"
                    >+</button>
                  </div>
                  <span className="text-[10px] font-bold opacity-60">{sleepCount === 1 ? 'vez' : 'vezes'}</span>
                </div>
              </div>
              <Button
                size="lg"
                className={cn(
                  "rounded-2xl h-14 w-14 p-0 shadow-2xl transition-all active:scale-90 shrink-0",
                  sleeping ? "bg-white text-indigo-600 hover:bg-white/90" : "bg-white/20 text-white hover:bg-white/30"
                )}
                onClick={() => handleAction('sono', { status: sleeping ? 'acordado' : 'dormindo' }, '')}
              >
                <MoonIcon className={cn("h-6 w-6", sleeping ? "fill-indigo-600" : "")} />
              </Button>
            </div>
          </Card>
        </div>

        {/* Col 2: Hygiene & Mood */}
        <div className="md:col-span-4 space-y-4">

          {/* HIGIENE */}
          <Card className="rounded-[2rem] border-none shadow-sm bg-card p-5">
            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Droplets className="h-3.5 w-3.5" /> Higiene
            </h3>

            {/* Xixi */}
            <div className="mb-4">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Xixi</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 bg-muted/30 rounded-2xl flex flex-col items-center justify-center py-2 gap-1">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setXixi(s => ({ ...s, count: Math.max(0, s.count - 1) }))} className="h-5 w-5 rounded-full bg-background border flex items-center justify-center text-xs font-black hover:bg-muted">−</button>
                    <span className="text-lg font-black tabular-nums w-5 text-center">{xixi.count}</span>
                    <button onClick={() => setXixi(s => ({ ...s, count: s.count + 1 }))} className="h-5 w-5 rounded-full bg-background border flex items-center justify-center text-xs font-black hover:bg-muted">+</button>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-bold uppercase">{xixi.count === 1 ? 'vez' : 'vezes'}</span>
                </div>
                {['Normal', 'Alterado'].map(tipo => (
                  <button
                    key={tipo}
                    onClick={() => { setXixi(s => ({ ...s, tipo })); handleAction('fralda', { tipo_saida: 'xixi', tipo, vezes: xixi.count }, ''); }}
                    className={cn(
                      "rounded-2xl py-2 text-[10px] font-black uppercase border-2 transition-all",
                      xixi.tipo === tipo
                        ? "bg-yellow-400 text-white border-yellow-400 shadow-md"
                        : "border-border/40 text-muted-foreground hover:border-yellow-300 hover:bg-yellow-50 hover:text-yellow-700"
                    )}
                  >{tipo}</button>
                ))}
              </div>
            </div>

            {/* Cocô */}
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Cocô</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 bg-muted/30 rounded-2xl flex flex-col items-center justify-center py-2 gap-1">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setCoco(s => ({ ...s, count: Math.max(0, s.count - 1) }))} className="h-5 w-5 rounded-full bg-background border flex items-center justify-center text-xs font-black hover:bg-muted">−</button>
                    <span className="text-lg font-black tabular-nums w-5 text-center">{coco.count}</span>
                    <button onClick={() => setCoco(s => ({ ...s, count: s.count + 1 }))} className="h-5 w-5 rounded-full bg-background border flex items-center justify-center text-xs font-black hover:bg-muted">+</button>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-bold uppercase">{coco.count === 1 ? 'vez' : 'vezes'}</span>
                </div>
                {['Normal', 'Alterado'].map(tipo => (
                  <button
                    key={tipo}
                    onClick={() => { setCoco(s => ({ ...s, tipo })); handleAction('fralda', { tipo_saida: 'coco', tipo, vezes: coco.count }, ''); }}
                    className={cn(
                      "rounded-2xl py-2 text-[10px] font-black uppercase border-2 transition-all",
                      coco.tipo === tipo
                        ? "bg-amber-600 text-white border-amber-600 shadow-md"
                        : "border-border/40 text-muted-foreground hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                    )}
                  >{tipo}</button>
                ))}
              </div>
            </div>
          </Card>

          {/* HUMOR */}
          <Card className="rounded-[2rem] border-none shadow-sm bg-card p-5">
            <h3 className="text-[11px] font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Smile className="h-3.5 w-3.5" /> Humor
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {moods.map(m => (
                <button
                  key={m.label}
                  onClick={() => { setSelectedMood(m.label); handleAction('bemestar', { humor: m.label, emoji: m.emoji }, ''); }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-black border-2 transition-all text-left",
                    selectedMood === m.label
                      ? "bg-amber-400 text-white border-amber-400 shadow-md"
                      : "border-border/40 text-muted-foreground hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                  )}
                >
                  <span className="text-lg shrink-0">{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Col 3: Tools & Recados */}
        <div className="md:col-span-3 space-y-4">
          <Card className="rounded-[2rem] border-none shadow-sm bg-card p-5 space-y-3">
            <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Ações</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('ocorrencia')}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 border-border/40 text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all"
              >
                <AlertTriangle className="h-5 w-5" />
                <span className="text-[9px] font-black uppercase">Ocorrência</span>
              </button>
              <button
                onClick={() => setActiveTab('album')}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 border-border/40 text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
              >
                <Camera className="h-5 w-5" />
                <span className="text-[9px] font-black uppercase">Álbum</span>
              </button>
            </div>
            <div className="flex items-center justify-between bg-rose-50/60 rounded-2xl px-3 py-2.5 border-2 border-rose-100">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-rose-500" />
                <span className="text-[10px] font-black text-rose-700 uppercase">Temperatura</span>
              </div>
              <Input
                type="number"
                placeholder="36.5"
                step="0.1"
                className="w-16 h-7 text-xs font-black bg-transparent border-none focus:ring-0 text-right p-0"
                onBlur={e => { if (e.target.value) handleAction('saude', { temperatura: e.target.value }, ''); }}
              />
            </div>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-sm bg-cyan-600 p-5 text-white flex flex-col" style={{ minHeight: '260px' }}>
            <h3 className="text-[11px] font-black uppercase tracking-widest mb-3 opacity-80 flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5" /> Recado Rápido
            </h3>
            <Textarea
              id="recado-educador"
              placeholder="Ex: Dormiu bem hoje..."
              className="flex-1 bg-white/10 border-none rounded-2xl resize-none placeholder:text-white/40 font-bold mb-3 focus-visible:ring-white/20 p-3 text-sm"
            />
            <Button
              className="w-full rounded-2xl bg-white text-cyan-700 font-black hover:bg-white/90 shadow-xl active:scale-95 h-10"
              onClick={() => {
                const el = document.getElementById('recado-educador') as HTMLTextAreaElement;
                if (el?.value.trim()) { handleAction('recado', { mensagem: el.value }, ''); el.value = ''; }
              }}
            >
              ENVIAR
            </Button>
          </Card>
        </div>

      </div>

      {/* Overflow Modals (For complex actions) */}
      <AlertDialog open={activeTab === 'ocorrencia'} onOpenChange={(open) => !open && setActiveTab('')}>
        <AlertDialogContent className="max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <OcorrenciaCard aluno={aluno} addOcorrencia={async (data: any) => {
            await addOcorrencia(data);
            setActiveTab('');
          }} />
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={activeTab === 'album'} onOpenChange={(open) => !open && setActiveTab('')}>
        <AlertDialogContent className="max-w-lg rounded-[2.5rem] p-6 border-none shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-indigo-600 flex items-center gap-2"><Camera className="h-5 w-5" /> Publicar no Álbum</h3>
              <button onClick={() => setActiveTab('')} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center"><XIcon className="h-4 w-4" /></button>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            {albumFoto ? (
              <div className="relative rounded-3xl overflow-hidden aspect-video shadow-inner ring-1 ring-border">
                <img src={albumFoto} className="w-full h-full object-cover" />
                <button onClick={() => setAlbumFoto(null)} className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm"><XIcon className="h-4 w-4" /></button>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()} className="h-40 rounded-3xl border-4 border-dashed border-indigo-100 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted transition-colors">
                <ImagePlus className="h-8 w-8 text-indigo-300 mb-2" />
                <p className="text-xs font-black text-muted-foreground uppercase opacity-60">Escolher Foto</p>
              </div>
            )}

            <div className="space-y-4">
              <Select value={albumCategoria} onValueChange={setAlbumCategoria}>
                <SelectTrigger className="rounded-2xl h-12 border-none bg-muted shadow-inner font-bold"><SelectValue placeholder="Categoria..." /></SelectTrigger>
                <SelectContent className="rounded-2xl">{ACTIVITY_TYPES.map(a => <SelectItem key={a.value} value={a.value}>{a.emoji} {a.value}</SelectItem>)}</SelectContent>
              </Select>
              <Textarea placeholder="Legenda..." value={albumLegenda} onChange={e => setAlbumLegenda(e.target.value)} className="rounded-2xl min-h-[80px] bg-muted border-none shadow-inner p-4 font-bold" />
              <Button onClick={handlePublishAlbum} disabled={albumLoading} className="w-full h-14 rounded-2xl bg-indigo-600 font-black shadow-lg">
                {albumLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'PUBLICAR NO ÁLBUM'}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default PerfilAluno;
