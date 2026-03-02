import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useData, type RegistroDiario } from '@/contexts/DataProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import {
  ChevronLeft, Droplets, UtensilsCrossed, Moon as MoonIcon, AlertTriangle,
  Camera, History, Check, Loader2, Thermometer, MessageSquare, Package, Smile,
  ArrowLeft, LogIn, LogOut, Meh, Frown, Baby, ShirtIcon, Sparkles, Plus, ImagePlus,
  X as XIcon, FileImage, Clock, DoorOpen, Calendar, Pill, ShieldAlert
} from 'lucide-react';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Toggle } from '@/components/ui/toggle';
import ActionMenu from '@/components/ActionMenu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { alunos, loading, registros, fetchRegistrosAluno, addRegistro, addOcorrencia } = useData();
  const aluno = alunos.find(a => a.id === id);

  // Selected date from URL or default to today
  const selectedDateStr = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState<Date>(parseISO(selectedDateStr));

  const [checkedIn, setCheckedIn] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedFeeding, setSelectedFeeding] = useState<string | null>(null);
  const [mlBottle, setMlBottle] = useState('');
  const [mamadeiraTime, setMamadeiraTime] = useState('');
  const [mamadeiraEnabled, setMamadeiraEnabled] = useState(false);
  const [sleepCount, setSleepCount] = useState(0);
  const [sleeping, setSleeping] = useState(false);
  const [tempOption, setTempOption] = useState<'normal' | 'febre' | null>(null);
  const [recado, setRecado] = useState('');
  const [recadoList, setRecadoList] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [xixi, setXixi] = useState({ count: 0, tipo: null as string | null });
  const [coco, setCoco] = useState({ count: 0, tipo: null as string | null });

  // Track last manual update time to avoid jumping/flickering
  const lastUpdateRef = useRef<Record<string, number>>({});
  const IGNORE_SYNC_MS = 2000; // Ignore server sync for 2s after manual action

  // Album state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [albumFoto, setAlbumFoto] = useState<string | null>(null);
  const [albumCategoria, setAlbumCategoria] = useState('');
  const [albumLegenda, setAlbumLegenda] = useState('');
  const [albumConquista, setAlbumConquista] = useState(false);
  const [albumLoading, setAlbumLoading] = useState(false);

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
      data_registro: format(selectedDate, 'yyyy-MM-dd')
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
  }, [aluno, albumFoto, albumCategoria, albumLegenda, albumConquista, addRegistro, selectedDate]);

  useEffect(() => {
    if (id) fetchRegistrosAluno(id);
  }, [id, fetchRegistrosAluno]);

  useEffect(() => {
    // Determine if we should sync based on ignore window
    const shouldSync = (key: string) => {
      const last = lastUpdateRef.current[key] || 0;
      const ignoreRef = lastUpdateRef.current['all'] || 0;
      const finalLast = Math.max(last, ignoreRef);
      return Date.now() - finalLast > IGNORE_SYNC_MS;
    };

    const targetDate = format(selectedDate, 'yyyy-MM-dd');
    const records = [...registros].reverse(); // Get latest records first
    const hoje = records.filter(r => r.data_registro === targetDate);

    // Initial state cleanup if no records for this day
    if (hoje.length === 0 && shouldSync('all')) {
      setCheckedIn(false);
      setSelectedMood(null);
      setSelectedFeeding(null);
      setSleepCount(0);
      setSleeping(false);
      setTempOption(null);
      setRecadoList([]);
      setXixi({ count: 0, tipo: null });
      setCoco({ count: 0, tipo: null });
    }

    // Basic logic to determine current status based on last registros
    const lastCheckin = records.find(r => r.tipo_registro === 'presenca');
    if (lastCheckin && shouldSync('presenca')) setCheckedIn(lastCheckin.detalhes?.status === 'entrada');

    const lastMood = records.find(r => r.tipo_registro === 'bemestar');
    if (lastMood && shouldSync('bemestar')) setSelectedMood(lastMood.detalhes?.humor);

    const lastSleep = hoje.find(r => r.tipo_registro === 'sono');
    if (lastSleep && shouldSync('sono_status')) setSleeping(lastSleep.detalhes?.status === 'dormindo');

    // Count both "dormindo" (start) and "dormiu" (counter increment)
    if (shouldSync('sono_count')) {
      const todaySleeps = hoje.filter(r => r.tipo_registro === 'sono' && (r.detalhes?.status === 'dormindo' || r.detalhes?.status === 'dormiu'));
      setSleepCount(todaySleeps.length);
    }

    const lastFeeding = hoje.find(r => r.tipo_registro === 'alimentacao' && r.detalhes?.status !== 'Mamadeira');
    if (lastFeeding && shouldSync('alimentacao')) {
      setSelectedFeeding(lastFeeding.detalhes?.status ?? null);
    }

    // Sync hygiene counts
    if (shouldSync('higiene')) {
      const xixiRecords = hoje.filter(r => r.tipo_registro === 'fralda' && r.detalhes?.tipo_saida === 'xixi');
      const cocoRecords = hoje.filter(r => r.tipo_registro === 'fralda' && r.detalhes?.tipo_saida === 'coco');

      const lastXixi = xixiRecords[0];
      const lastCoco = cocoRecords[0];

      setXixi({
        count: xixiRecords.length,
        tipo: lastXixi?.detalhes?.tipo ?? null
      });
      setCoco({
        count: cocoRecords.length,
        tipo: lastCoco?.detalhes?.tipo ?? null
      });
    }

    // Sync temperature
    const lastHealth = hoje.find(r => r.tipo_registro === 'saude');
    if (lastHealth && shouldSync('temperatura')) {
      setTempOption(lastHealth.detalhes?.status === 'Febre' ? 'febre' : 'normal');
    }

    // Sync quick notes
    if (shouldSync('recado')) {
      const todayRecados = hoje.filter(r => r.tipo_registro === 'recado');
      setRecadoList(todayRecados.map(r => r.detalhes?.mensagem).filter(Boolean).reverse());
    }
  }, [registros, selectedDate]);

  if (loading || !aluno) {
    if (!aluno && !loading) return <div className="p-8 text-center"><p>Aluno não encontrado</p><Button variant="link" onClick={() => navigate(-1)}>Voltar</Button></div>;
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const handleAction = async (tipo: string, detalhes: any, msg: string, syncKey?: string) => {
    if (syncKey) lastUpdateRef.current[syncKey] = Date.now();
    // Use the selected date from URL for all registrations
    await addRegistro({
      aluno_id: aluno.id,
      tipo_registro: tipo,
      detalhes,
      data_registro: format(selectedDate, 'yyyy-MM-dd')
    });
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
          onClick={() => {
            const newStatus = !checkedIn;
            setCheckedIn(newStatus);
            handleAction('presenca', { status: newStatus ? 'entrada' : 'saida' }, newStatus ? 'Entrada' : 'Saída', 'presenca');
          }}
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

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

        {/* Col 1: Feeding & Sleep */}
        <div className="md:col-span-4 space-y-4">
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
                  onClick={() => {
                    setSelectedFeeding(opt.label);
                    handleAction('alimentacao', { status: opt.label, ml: mlBottle }, '', 'alimentacao');
                  }}
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

            {/* Mamadeira UI mais intuitiva */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <Toggle
                  pressed={mamadeiraEnabled}
                  onPressedChange={pressed => {
                    setMamadeiraEnabled(pressed);
                    if (!pressed) {
                      setMlBottle('');
                      setMamadeiraTime('');
                    }
                  }}
                  className={cn(
                    "flex-1 h-12 rounded-2xl font-black text-xs uppercase tracking-widest transition-all gap-2 border-2",
                    mamadeiraEnabled
                      ? "bg-amber-400 text-amber-950 border-amber-500 shadow-lg shadow-amber-100"
                      : "bg-muted/50 text-muted-foreground border-transparent hover:bg-amber-50"
                  )}
                >
                  <Baby className={cn("h-4 w-4", mamadeiraEnabled ? "fill-amber-950" : "")} />
                  Mamadeira?
                </Toggle>
              </div>

              {mamadeiraEnabled && (
                <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-3 bg-white border-2 border-orange-100 rounded-2xl px-4 py-2.5 shadow-sm">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <div className="flex-1">
                        <Label className="text-[8px] font-black text-orange-400 uppercase leading-none block mb-1">Horário</Label>
                        <Input
                          type="time"
                          value={mamadeiraTime}
                          onChange={e => setMamadeiraTime(e.target.value)}
                          className="h-6 border-none bg-transparent focus-visible:ring-0 text-xs font-bold p-0"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white border-2 border-orange-100 rounded-2xl px-4 py-2.5 shadow-sm">
                      <Package className="h-4 w-4 text-orange-500" />
                      <div className="flex-1">
                        <Label className="text-[8px] font-black text-orange-400 uppercase leading-none block mb-1">Volume (ML)</Label>
                        <div className="flex items-center">
                          <Input
                            placeholder="000"
                            type="number"
                            value={mlBottle}
                            onChange={e => setMlBottle(e.target.value)}
                            className="h-6 border-none bg-transparent focus-visible:ring-0 text-xs font-bold p-0 flex-1"
                          />
                          <span className="text-[10px] font-black text-orange-200 ml-1">ml</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full h-10 rounded-xl bg-orange-500 text-white font-black text-[10px] hover:bg-orange-600 shadow-md active:scale-[0.98]"
                    onClick={() => {
                      if (mlBottle) {
                        handleAction('alimentacao', { ml: mlBottle, horario: mamadeiraTime, status: 'Mamadeira' }, 'Mamadeira registrada', 'alimentacao');
                        setMlBottle('');
                        setMamadeiraEnabled(false);
                        toast({ title: "🍼 Mamadeira registrada!", description: `${mlBottle}ml às ${mamadeiraTime}` });
                      }
                    }}
                  >
                    CONFIRMAR MAMADEIRA
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* CONTROLE DE SONO */}
          <Card className="rounded-[2rem] border-none shadow-sm bg-indigo-500 p-5 text-white">
            <h3 className="text-[11px] font-black uppercase tracking-widest mb-3 opacity-80 flex items-center gap-2">
              <MoonIcon className="h-3.5 w-3.5" /> Dormiu?
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-xl font-black">{sleeping ? 'Sim' : 'Não'}</p>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2 bg-white/10 rounded-2xl px-3 py-2 w-fit">
                    <span className="text-[9px] font-black uppercase opacity-70 tracking-tight">Sonecas:</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSleepCount(c => {
                            const newCount = Math.max(0, c - 1);
                            handleAction('sono', { status: 'reduzido', total_vezes: newCount }, 'Menos uma soneca', 'sono_count');
                            return newCount;
                          });
                        }}
                        className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-black hover:bg-white/40 transition-colors"
                      >−</button>
                      <span className="text-base font-black tabular-nums min-w-[12px] text-center">{sleepCount}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSleepCount(c => {
                            const newCount = c + 1;
                            handleAction('sono', { status: 'dormiu', total_vezes: newCount }, 'Nova soneca', 'sono_count');
                            return newCount;
                          });
                        }}
                        className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-black hover:bg-white/40 transition-colors"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className={cn(
                  "rounded-2xl h-14 w-14 p-0 shadow-2xl transition-all active:scale-90 shrink-0",
                  sleeping ? "bg-amber-400 text-indigo-900 hover:bg-amber-500" : "bg-white/20 text-white hover:bg-white/30"
                )}
                onClick={() => {
                  const newStatus = !sleeping;
                  setSleeping(newStatus);
                  handleAction('sono', { status: newStatus ? 'dormindo' : 'acordou' }, newStatus ? 'Dormindo' : 'Acordou', 'sono_status');
                }}
              >
                <MoonIcon className={cn("h-6 w-6", sleeping ? "fill-current" : "")} />
              </Button>
            </div>
          </Card>
        </div>

        {/* Col 2: Hygiene & Mood */}
        <div className="md:col-span-4 space-y-4">
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
                    <button
                      onClick={() => {
                        handleAction('fralda', { tipo_saida: 'xixi', tipo: xixi.tipo || 'Normal', status: 'reduzido' }, 'Removido Xixi', 'higiene');
                      }}
                      className="h-5 w-5 rounded-full bg-background border flex items-center justify-center text-xs font-black hover:bg-muted"
                    >−</button>
                    <span className="text-lg font-black tabular-nums w-5 text-center">{xixi.count}</span>
                    <button
                      onClick={() => {
                        handleAction('fralda', { tipo_saida: 'xixi', tipo: xixi.tipo || 'Normal', status: 'confirmado' }, 'Registrado Xixi', 'higiene');
                      }}
                      className="h-5 w-5 rounded-full bg-background border flex items-center justify-center text-xs font-black hover:bg-muted"
                    >+</button>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-bold uppercase">{xixi.count === 1 ? 'vez' : 'vezes'}</span>
                </div>
                {['Normal', 'Alterado'].map(tipo => (
                  <button
                    key={tipo}
                    onClick={() => {
                      setXixi(s => ({ ...s, tipo }));
                      handleAction('fralda', { tipo_saida: 'xixi', tipo, vezes: xixi.count }, '', 'higiene');
                    }}
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
                    <button
                      onClick={() => {
                        handleAction('fralda', { tipo_saida: 'coco', tipo: coco.tipo || 'Normal', status: 'reduzido' }, 'Removido Cocô', 'higiene');
                      }}
                      className="h-5 w-5 rounded-full bg-background border flex items-center justify-center text-xs font-black hover:bg-muted"
                    >−</button>
                    <span className="text-lg font-black tabular-nums w-5 text-center">{coco.count}</span>
                    <button
                      onClick={() => {
                        handleAction('fralda', { tipo_saida: 'coco', tipo: coco.tipo || 'Normal', status: 'confirmado' }, 'Registrado Cocô', 'higiene');
                      }}
                      className="h-5 w-5 rounded-full bg-background border flex items-center justify-center text-xs font-black hover:bg-muted"
                    >+</button>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-bold uppercase">{coco.count === 1 ? 'vez' : 'vezes'}</span>
                </div>
                {['Normal', 'Alterado'].map(tipo => (
                  <button
                    key={tipo}
                    onClick={() => {
                      setCoco(s => ({ ...s, tipo }));
                      handleAction('fralda', { tipo_saida: 'coco', tipo, vezes: coco.count }, '', 'higiene');
                    }}
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
                  onClick={() => {
                    setSelectedMood(m.label);
                    handleAction('bemestar', { humor: m.label, emoji: m.emoji }, '', 'bemestar');
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-black border-2 transition-all text-left",
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
        <div className="md:col-span-4 space-y-4">
          <Card className="rounded-[2rem] border-none shadow-sm bg-card p-5 space-y-4">
            <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Ações Rápidas</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('ocorrencia')}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 border-border/40 text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all active:scale-95"
              >
                <AlertTriangle className="h-5 w-5" />
                <span className="text-[9px] font-black uppercase">Ocorrência</span>
              </button>
              <button
                onClick={() => setActiveTab('album')}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 border-border/40 text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all active:scale-95"
              >
                <Camera className="h-5 w-5" />
                <span className="text-[9px] font-black uppercase">Álbum</span>
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 border-border/40 text-cyan-600 hover:border-cyan-200 hover:bg-cyan-50 transition-all active:scale-95"
              >
                <History className="h-5 w-5" />
                <span className="text-[9px] font-black uppercase">Relatório</span>
              </button>
              <button
                onClick={() => setActiveTab('mochila')}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 border-border/40 text-slate-600 hover:border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
              >
                <Package className="h-5 w-5" />
                <span className="text-[9px] font-black uppercase">Mochila</span>
              </button>
            </div>

            {/* Temperatura Section */}
            <div className="space-y-3 pt-2 border-t border-border/40">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-rose-500" />
                <span className="text-[10px] font-black text-rose-700 uppercase tracking-wider">Temperatura</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setTempOption('normal');
                    handleAction('saude', { status: 'Normal', temperatura: '36.5' }, '', 'temperatura');
                  }}
                  className={cn(
                    "rounded-xl py-2 text-[10px] font-black uppercase border-2 transition-all",
                    tempOption === 'normal' ? "bg-rose-500 text-white border-rose-500 shadow-md" : "border-border/40 text-muted-foreground hover:bg-muted"
                  )}
                >
                  Normal
                </button>
                <button
                  onClick={() => {
                    setTempOption('febre');
                  }}
                  className={cn(
                    "rounded-xl py-2 text-[10px] font-black uppercase border-2 transition-all",
                    tempOption === 'febre' ? "bg-rose-500 text-white border-rose-500 shadow-md" : "border-border/40 text-muted-foreground hover:bg-muted"
                  )}
                >
                  Febre
                </button>
              </div>
              {tempOption === 'febre' && (
                <div className="flex items-center gap-2 bg-rose-50 rounded-xl px-3 py-2 animate-in slide-in-from-top-2 duration-200">
                  <span className="text-[10px] font-black text-rose-600 uppercase">Graus</span>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="38.5"
                    className="h-6 border-none bg-transparent focus:ring-0 text-xs font-bold text-rose-900 p-0 text-right"
                    onBlur={e => {
                      if (e.target.value) handleAction('saude', { status: 'Febre', temperatura: e.target.value }, '', 'temperatura');
                    }}
                  />
                </div>
              )}
            </div>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-sm bg-cyan-600 p-5 text-white flex flex-col" style={{ minHeight: '300px' }}>
            <h3 className="text-[11px] font-black uppercase tracking-widest mb-3 opacity-80 flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5" /> Recado Rápido
            </h3>

            <div className="flex-1 overflow-y-auto space-y-2 mb-3 pr-1 scrollbar-thin scrollbar-thumb-white/20">
              {recadoList.length === 0 && (
                <p className="text-[10px] opacity-40 italic py-4 text-center">Nenhum recado enviado hoje.</p>
              )}
              {recadoList.map((msg, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-3 animate-in slide-in-from-bottom-2 duration-300">
                  <p className="text-xs font-medium leading-relaxed">{msg}</p>
                  <span className="text-[8px] opacity-50 block mt-1 uppercase font-black">Enviado agora</span>
                </div>
              ))}
            </div>

            <Textarea
              id="recado-educador"
              placeholder="Ex: Dormiu bem hoje..."
              className="bg-white/10 border-none rounded-2xl resize-none placeholder:text-white/40 font-bold mb-3 focus-visible:ring-white/20 p-3 text-sm min-h-[80px]"
            />
            <Button
              className="w-full rounded-2xl bg-white text-cyan-700 font-black hover:bg-white/90 shadow-xl active:scale-95 h-12"
              onClick={() => {
                const el = document.getElementById('recado-educador') as HTMLTextAreaElement;
                if (el?.value.trim()) {
                  const msg = el.value.trim();
                  handleAction('recado', { mensagem: msg }, '');
                  setRecadoList(prev => [msg, ...prev]);
                  el.value = '';
                }
              }}
            >
              ENVIAR RECADO
            </Button>
          </Card>
        </div>

      </div>

      {/* RELATÓRIO / HISTÓRICO MODAL */}
      <AlertDialog open={showHistory} onOpenChange={setShowHistory}>
        <AlertDialogContent className="max-w-2xl rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 p-8 text-white relative">
            <button onClick={() => setShowHistory(false)} className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-all">
              <XIcon className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-3xl bg-white/20 flex items-center justify-center">
                <History className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">Relatório Diário</h2>
                <p className="text-cyan-100 font-bold opacity-80 uppercase text-[10px] tracking-widest mt-1">Histórico completo de atividades</p>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[0, 1, 2, 3, 4, 5, 6].map(daysAgo => {
                const date = subDays(new Date(), daysAgo);
                const active = isSameDay(date, selectedDate);
                return (
                  <button
                    key={daysAgo}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "flex flex-col items-center min-w-[60px] py-3 rounded-2xl transition-all border-2",
                      active ? "bg-white text-cyan-700 border-white shadow-lg scale-105" : "bg-white/10 text-white border-transparent hover:bg-white/20"
                    )}
                  >
                    <span className="text-[10px] font-black uppercase opacity-60 mb-1">{format(date, 'eee', { locale: ptBR })}</span>
                    <span className="text-lg font-black">{format(date, 'dd')}</span>
                  </button>
                );
              })}
              <div className="pl-2">
                <Button variant="ghost" className="h-14 w-14 rounded-2xl bg-white/5 border-2 border-white/10 text-white hover:bg-white/10">
                  <Calendar className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-8 max-h-[60vh] overflow-y-auto bg-slate-50/50">
            <div className="space-y-6">
              {registros.filter(r => r.data_registro === format(selectedDate, 'yyyy-MM-dd')).length === 0 ? (
                <div className="py-20 text-center opacity-40">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="h-8 w-8" />
                  </div>
                  <p className="font-bold">Nenhum registro encontrado para esta data.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {registros
                    .filter(r => r.data_registro === format(selectedDate, 'yyyy-MM-dd'))
                    .sort((a, b) => b.hora_registro.localeCompare(a.hora_registro))
                    .map((reg, idx) => (
                      <div key={reg.id} className="flex gap-4 group">
                        <div className="flex flex-col items-center shrink-0">
                          <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center border-2 border-border/40 text-indigo-500">
                            {reg.tipo_registro === 'alimentacao' && <UtensilsCrossed className="h-4 w-4" />}
                            {reg.tipo_registro === 'sono' && <MoonIcon className="h-4 w-4" />}
                            {reg.tipo_registro === 'fralda' && <Droplets className="h-4 w-4" />}
                            {reg.tipo_registro === 'bemestar' && <Smile className="h-4 w-4" />}
                            {reg.tipo_registro === 'recado' && <MessageSquare className="h-4 w-4" />}
                            {reg.tipo_registro === 'presenca' && <DoorOpen className="h-4 w-4" />}
                            {reg.tipo_registro === 'mochila' && <Package className="h-4 w-4" />}
                          </div>
                          {idx !== registros.length - 1 && <div className="w-0.5 grow bg-border/40 mt-2" />}
                        </div>
                        <div className="pb-6 grow">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">{reg.tipo_registro}</span>
                            <span className="text-[10px] font-bold text-muted-foreground/60">{reg.hora_registro}</span>
                          </div>
                          <div className="bg-white border-2 border-border/20 rounded-2xl p-4 shadow-sm group-hover:border-indigo-100 transition-colors">
                            <p className="text-sm font-bold text-slate-700">
                              {reg.tipo_registro === 'alimentacao' && `Alimentação: ${reg.detalhes?.status}${reg.detalhes?.ml ? ` (${reg.detalhes?.ml}ml)` : ''}`}
                              {reg.tipo_registro === 'sono' && `Soneca: ${reg.detalhes?.status === 'dormindo' ? 'Iniciou' : 'Finalizou'} (${reg.detalhes?.total_vezes ?? ''}ª vez)`}
                              {reg.tipo_registro === 'fralda' && `Troca de Fralda (${reg.detalhes?.tipo_saida}): ${reg.detalhes?.tipo}`}
                              {reg.tipo_registro === 'bemestar' && `Humor: ${reg.detalhes?.humor} ${reg.detalhes?.emoji || ''}`}
                              {reg.tipo_registro === 'recado' && `Recado: ${reg.detalhes?.mensagem}`}
                              {reg.tipo_registro === 'presenca' && `Status: ${reg.detalhes?.status === 'entrada' ? 'Entrou na Creche' : 'Saiu da Creche'}`}
                              {reg.tipo_registro === 'mochila' && `Mochila: Solicitação de ${reg.detalhes?.item}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="p-6 bg-white border-t border-border/40">
            <Button onClick={() => setShowHistory(false)} className="w-full h-12 rounded-2xl bg-cyan-600 font-black shadow-lg">FECHAR RELATÓRIO</Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* OUTROS MODAIS */}
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
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    const input = fileInputRef.current;
                    if (input) {
                      input.setAttribute('capture', 'environment');
                      input.click();
                    }
                  }}
                  className="h-40 rounded-3xl border-4 border-dashed border-indigo-100 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 transition-colors group"
                >
                  <Camera className="h-8 w-8 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-black text-indigo-600 uppercase opacity-60">Abrir Câmera</p>
                </button>
                <button
                  onClick={() => {
                    const input = fileInputRef.current;
                    if (input) {
                      input.removeAttribute('capture');
                      input.click();
                    }
                  }}
                  className="h-40 rounded-3xl border-4 border-dashed border-indigo-100 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors group"
                >
                  <FileImage className="h-8 w-8 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-black text-slate-600 uppercase opacity-60">Ver Galeria</p>
                </button>
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

      <AlertDialog open={activeTab === 'mochila'} onOpenChange={(open) => !open && setActiveTab('')}>
        <AlertDialogContent className="max-w-md rounded-[2.5rem] p-6 border-none shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-600 flex items-center gap-2"><Package className="h-5 w-5" /> Reposição / Mochila</h3>
              <button onClick={() => setActiveTab('')} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center"><XIcon className="h-4 w-4" /></button>
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-relaxed">
              Marque os itens que estão faltando ou precisam de reposição na mochila do aluno.
            </p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: 'Fraldas', icon: Baby },
                { label: 'Lenço Umedecido', icon: Droplets },
                { label: 'Troca de Roupa', icon: ShirtIcon },
                { label: 'Pomada', icon: Pill },
                { label: 'Leite / Fórmula', icon: UtensilsCrossed }
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => {
                    handleAction('mochila', { item: item.label, status: 'pendente' }, `Pedido de ${item.label}`, 'mochila');
                    toast({ title: `🔔 Pedido enviado`, description: `Reposição de ${item.label} solicitada.` });
                    setActiveTab('');
                  }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-slate-200 transition-all text-slate-700 font-bold group"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <Plus className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PerfilAluno;
