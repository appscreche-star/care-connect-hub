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
  const [mlBottle, setMlBottle] = useState('');

  // Album state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [albumFoto, setAlbumFoto] = useState<string | null>(null);
  const [albumCategoria, setAlbumCategoria] = useState('');
  const [albumLegenda, setAlbumLegenda] = useState('');
  const [albumConquista, setAlbumConquista] = useState(false);
  const [albumLoading, setAlbumLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('presenca');

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

      {/* ACTION GRID (3 Columns Desktop, 1 Col Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

        {/* Left Col: Feeding & Sleep (Priority) */}
        <div className="md:col-span-5 space-y-4">
          {/* Section: Feeding */}
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-card p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><UtensilsCrossed className="h-12 w-12" /></div>
            <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Alimentação
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Aceitou tudo', emoji: '🥗', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-500' },
                  { label: 'Aceitou metade', emoji: '🥣', color: 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-500' },
                  { label: 'Recusou', emoji: '❌', color: 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-500' }
                ].map(opt => (
                  <Button
                    key={opt.label}
                    variant="outline"
                    className={cn("rounded-2xl h-20 flex flex-col gap-1 text-[10px] font-black uppercase tracking-tighter transition-all hover:text-white border-2", opt.color)}
                    onClick={() => handleAction('alimentacao', { status: opt.label, ml: mlBottle }, `Alimentação: ${opt.label}`)}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    {opt.label}
                  </Button>
                ))}
              </div>
              <div className="relative group">
                <Input
                  placeholder="Mamadeira (ml)..."
                  type="number"
                  value={mlBottle}
                  onChange={e => setMlBottle(e.target.value)}
                  className="rounded-2xl h-12 font-bold focus:ring-orange-200 pl-4 bg-muted/30 border-none shadow-inner"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground uppercase opacity-40">Mililitros</div>
              </div>
            </div>
          </Card>

          {/* Section: Sleep */}
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-indigo-500 p-5 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><MoonIcon className="h-12 w-12" /></div>
            <h3 className="text-xs font-black uppercase tracking-widest mb-4 opacity-80">Controle de Soneca</h3>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-2xl font-black">{sleeping ? 'Dormindo...' : 'Acordado'}</p>
                <p className="text-[10px] font-bold opacity-60 mt-1 uppercase tracking-tight">Ultimo registro: {registros.find(r => r.tipo_registro === 'sono')?.hora_registro || '--:--'}</p>
              </div>
              <Button
                size="lg"
                className={cn(
                  "rounded-2xl h-14 w-14 p-0 shadow-2xl transition-all active:scale-90",
                  sleeping ? "bg-white text-indigo-600 hover:bg-white/90" : "bg-indigo-400 text-white hover:bg-indigo-300"
                )}
                onClick={() => handleAction('sono', { status: sleeping ? 'acordado' : 'dormindo' }, sleeping ? 'Acordou' : 'Dormiu')}
              >
                <MoonIcon className={cn("h-6 w-6", sleeping ? "fill-indigo-600" : "")} />
              </Button>
            </div>
          </Card>
        </div>

        {/* Center Col: Diapers & Mood (Efficiency) */}
        <div className="md:col-span-4 space-y-4">
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-card p-5 h-full flex flex-col">
            <h3 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-600" /> Registro de Higiene
            </h3>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {[
                { label: 'Xixi', style: 'border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-500 hover:text-white' },
                { label: 'Cocô OK', style: 'border-amber-200 bg-amber-100/50 text-amber-950 hover:bg-amber-800 hover:text-white' },
                { label: 'Alterado', style: 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-500 hover:text-white' },
                { label: 'Seca', style: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white' }
              ].map(opt => (
                <Button
                  key={opt.label}
                  variant="outline"
                  className={cn("rounded-2xl h-14 text-[10px] font-black uppercase border-2 transition-all shadow-sm", opt.style)}
                  onClick={() => handleAction('fralda', { status: opt.label }, `Fralda: ${opt.label}`)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>

            <div className="flex-1 bg-muted/20 rounded-3xl p-4 border border-dashed border-border/60 overflow-hidden">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase mb-3 flex items-center gap-2"><History className="h-3 w-3" /> Hoje</h4>
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                {registros.filter(r => r.tipo_registro === 'fralda').slice(0, 5).map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] font-bold text-muted-foreground bg-background/50 p-2 rounded-xl border border-border/40">
                    <span>{r.detalhes?.status}</span>
                    <span className="opacity-40">{r.hora_registro}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 pt-4 border-t border-border/40">
              {moods.map(m => (
                <button
                  key={m.label}
                  onClick={() => handleAction('bemestar', { humor: m.label, emoji: m.emoji }, `Humor`)}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-xl transition-all aspect-square border-2",
                    selectedMood === m.label ? "bg-amber-100 border-amber-400" : "bg-muted/30 border-transparent hover:bg-muted"
                  )}
                >
                  <span className="text-xl">{m.emoji}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Tools & Recados (Action Center) */}
        <div className="md:col-span-3 space-y-4">
          {/* Quick Actions Card */}
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-card p-5 space-y-2">
            <h3 className="text-xs font-black text-rose-600 uppercase tracking-widest mb-3">Assistente</h3>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="rounded-2xl h-16 flex flex-col gap-1 border-rose-100 text-rose-600 hover:bg-rose-50"
                onClick={() => setActiveTab('ocorrencia')}
              >
                <AlertTriangle className="h-5 w-5" />
                <span className="text-[9px] font-black uppercase">Ocorrência</span>
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl h-16 flex flex-col gap-1 border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                onClick={() => setActiveTab('album')}
              >
                <Camera className="h-5 w-5" />
                <span className="text-[9px] font-black uppercase">Álbum</span>
              </Button>
            </div>

            <div className="pt-2">
              <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-rose-500" />
                  <span className="text-[10px] font-black text-rose-700 uppercase">Febre?</span>
                </div>
                <Input
                  type="number"
                  placeholder="36.5"
                  step="0.1"
                  className="w-16 h-8 text-xs font-black bg-transparent border-none focus:ring-0 text-right p-0"
                  onBlur={(e) => {
                    if (e.target.value) handleAction('saude', { temperatura: e.target.value }, `Temp.`);
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Recados Direct */}
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-cyan-600 p-5 text-white h-[280px] flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-widest mb-3 opacity-80 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Recado rápido
            </h3>
            <Textarea
              id="recado-educador"
              placeholder="Ex: Dormiu em 2 min..."
              className="flex-1 bg-white/10 border-none rounded-2xl resize-none placeholder:text-white/40 font-bold mb-3 focus-visible:ring-white/20 p-4 scrollbar-hide"
            />
            <Button
              className="w-full rounded-2xl bg-white text-cyan-700 font-black hover:bg-white/90 shadow-xl active:scale-95"
              onClick={() => {
                const el = document.getElementById('recado-educador') as HTMLTextAreaElement;
                if (el.value.trim()) {
                  handleAction('recado', { mensagem: el.value }, 'Recado');
                  el.value = '';
                }
              }}
            >
              ENVIAR AGORA
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
