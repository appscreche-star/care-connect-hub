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
    <div className="space-y-4 pb-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground min-h-[44px]">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-black text-primary border-2 border-primary/20 shadow-inner">
          {aluno.nome[0]}
        </div>
        <div>
          <h1 className="text-xl font-black text-foreground tracking-tight">{aluno.nome}</h1>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{aluno.idade || 'Idade não informada'}</p>
        </div>
      </div>

      {/* Action Menu - Modular Component with horizontal scroll on mobile */}
      <ActionMenu
        items={menuItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Alertas de Saúde */}
      {(aluno.alergias || aluno.saude_observacoes || aluno.restricoes_alimentares || aluno.medicamentos_uso_continuo || aluno.tipo_sanguineo) && (
        <Card className="rounded-2xl border-destructive/20 bg-destructive/5 overflow-hidden">
          <div className="bg-destructive/10 px-4 py-2 flex items-center gap-2 text-destructive font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="h-4 w-4" /> Alertas Críticos de Saúde
          </div>
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {aluno.alergias && (
                <div className="col-span-2">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Alergias</p>
                  <p className="text-sm font-bold text-destructive">{aluno.alergias}</p>
                </div>
              )}
              {aluno.tipo_sanguineo && (
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Tipo Sanguíneo</p>
                  <p className="text-sm font-bold text-foreground font-mono">{aluno.tipo_sanguineo}</p>
                </div>
              )}
              {aluno.restricoes_alimentares && (
                <div className="col-span-2">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Restrições Alimentares</p>
                  <p className="text-sm font-semibold text-foreground">{aluno.restricoes_alimentares}</p>
                </div>
              )}
              {aluno.medicamentos_uso_continuo && (
                <div className="col-span-2">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Uso de Medicamentos</p>
                  <p className="text-sm font-semibold text-foreground">{aluno.medicamentos_uso_continuo}</p>
                </div>
              )}
              {aluno.saude_observacoes && (
                <div className="col-span-2">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Obsservações Gerais</p>
                  <p className="text-sm text-foreground">{aluno.saude_observacoes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Presença */}
      {activeTab === 'presenca' && (
        <Card className="rounded-2xl animate-in zoom-in-95 duration-300">
          <CardHeader className="pb-2"><CardTitle className="text-base font-black flex items-center gap-2"><DoorOpen className="h-5 w-5 text-emerald-500" /> Presença</CardTitle></CardHeader>
          <CardContent>
            <Button
              className={cn(
                "w-full h-16 rounded-2xl text-base font-black gap-3 transition-all shadow-lg",
                checkedIn ? 'bg-destructive hover:bg-destructive/90 shadow-destructive/20' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
              )}
              onClick={() => handleAction('presenca', { status: checkedIn ? 'saida' : 'entrada' }, checkedIn ? 'Check-out realizado' : 'Check-in realizado')}
            >
              {checkedIn ? <><LogOut className="h-5 w-5" /> Registrar Saída</> : <><LogIn className="h-5 w-5" /> Registrar Entrada</>}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Saúde e Temperatura */}
      {activeTab === 'saude' && (
        <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-card animate-in zoom-in-95 duration-300">
          <CardHeader className="pb-2 border-b mb-3 bg-muted/20">
            <CardTitle className="text-sm font-black flex items-center gap-2 text-rose-600">
              <Thermometer className="h-4 w-4" /> Saúde e Monitoramento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1.5">
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Temperatura (°C)</p>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    className="rounded-xl h-11 pl-10 font-bold"
                    onBlur={(e) => {
                      if (e.target.value) handleAction('saude', { temperatura: e.target.value }, `Temperatura: ${e.target.value}°C`);
                    }}
                  />
                  <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-rose-500" />
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Medicação</p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full h-11 rounded-xl gap-2 border-rose-200 text-rose-600 hover:bg-rose-50 font-bold">
                      <Pill className="h-4 w-4" /> Administrar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Administrar Medicação</AlertDialogTitle>
                      <AlertDialogDescription className="text-sm font-medium">
                        {aluno.medicamentos_uso_continuo
                          ? `Medicação: ${aluno.medicamentos_uso_continuo}`
                          : "Nenhum medicamento de uso contínuo registrado."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl font-bold">Cancelar</AlertDialogCancel>
                      <AlertDialogAction className="rounded-xl font-bold bg-rose-500 hover:bg-rose-600" onClick={() => handleAction('saude', { med: 'dose_ok' }, "Medicação realizada")}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Higiene */}
      {activeTab === 'higiene' && (
        <Card className="rounded-2xl animate-in zoom-in-95 duration-300 shadow-lg border-none">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2 font-black text-blue-600"><Sparkles className="h-4 w-4" /> Higiene do Dia</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 text-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Banho</p>
                <Toggle
                  className="w-full h-16 rounded-2xl gap-2 border-2 border-transparent bg-muted/20 data-[state=on]:bg-blue-500 data-[state=on]:text-white transition-all font-bold shadow-sm"
                  onPressedChange={(pressed) => handleAction('higiene', { item: 'banho', ok: pressed }, "Registro de Banho")}
                >
                  <Droplets className="h-5 w-5" /> Banho OK
                </Toggle>
              </div>
              <div className="space-y-2 text-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Saúde Bucal</p>
                <Toggle
                  className="w-full h-16 rounded-2xl gap-2 border-2 border-transparent bg-muted/20 data-[state=on]:bg-sky-500 data-[state=on]:text-white transition-all font-bold shadow-sm"
                  onPressedChange={(pressed) => handleAction('higiene', { item: 'bucal', ok: pressed }, "Higiene Bucal")}
                >
                  <Sparkles className="h-5 w-5" /> Escovação OK
                </Toggle>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bem-estar */}
      {activeTab === 'bemestar' && (
        <Card className="rounded-2xl animate-in zoom-in-95 duration-300 shadow-lg border-none">
          <CardHeader className="pb-2"><CardTitle className="text-base font-black text-amber-600">Como está o Humor?</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {moods.map(m => (
                <button
                  key={m.label}
                  onClick={() => handleAction('bemestar', { humor: m.label, emoji: m.emoji }, `Humor: ${m.label}`)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all min-h-[85px] border-2",
                    selectedMood === m.label
                      ? 'bg-amber-500/10 border-amber-500/40 ring-4 ring-amber-500/5'
                      : 'bg-accent/30 border-transparent hover:bg-accent'
                  )}
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="text-[10px] font-black tracking-tight text-foreground uppercase">{m.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alimentação */}
      {activeTab === 'alimentacao' && (
        <Card className="rounded-2xl animate-in zoom-in-95 duration-300 shadow-lg border-none">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2 text-orange-600 font-black"><UtensilsCrossed className="h-4 w-4" /> Alimentação</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Aceitou tudo', emoji: '🥗' },
                { label: 'Aceitou metade', emoji: '🥣' },
                { label: 'Recusou', emoji: '❌' }
              ].map(opt => (
                <Button key={opt.label} variant="outline" className="rounded-2xl h-16 flex flex-col gap-1 text-[10px] font-black uppercase tracking-tighter transition-all hover:bg-orange-500 hover:text-white border-orange-100" onClick={() => handleAction('alimentacao', { status: opt.label, ml: mlBottle }, `Alimentação: ${opt.label}`)}>
                  <span className="text-xl">{opt.emoji}</span>
                  {opt.label}
                </Button>
              ))}
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Mamadeira (Opcional)</p>
              <Input placeholder="Quantidade em ml..." type="number" value={mlBottle} onChange={e => setMlBottle(e.target.value)} className="rounded-xl h-12 font-bold focus:ring-orange-200" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sono */}
      {activeTab === 'sono' && (
        <Card className="rounded-2xl animate-in zoom-in-95 duration-300 shadow-xl border-none overflow-hidden text-center">
          <CardHeader className="pb-2 bg-purple-500/5"><CardTitle className="text-base flex items-center justify-center gap-2 text-purple-600 font-black text-center"><MoonIcon className="h-4 w-4" /> Horário da Soneca</CardTitle></CardHeader>
          <CardContent className="pt-6">
            <Button
              className={cn(
                "w-full h-20 rounded-[1.5rem] text-lg font-black gap-4 transition-all shadow-lg",
                sleeping ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20' : 'bg-primary hover:bg-primary/90 shadow-primary/20'
              )}
              onClick={() => handleAction('sono', { status: sleeping ? 'acordado' : 'dormindo' }, sleeping ? 'Soneca encerrada' : 'Soneca iniciada')}
            >
              <MoonIcon className={cn("h-6 w-6", sleeping ? "animate-pulse" : "")} />
              {sleeping ? 'Acordou Agora' : 'Iniciar Soneca'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Evacuação */}
      {activeTab === 'fralda' && (
        <Card className="rounded-2xl animate-in zoom-in-95 duration-300 shadow-lg border-none">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2 text-amber-800 font-black"><Baby className="h-4 w-4" /> Registro de Fralda</CardTitle>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-black uppercase tracking-widest"><History className="h-3 w-3" /> Histórico</div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Xixi', style: 'border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-500 hover:text-white' },
                { label: 'Cocô Normal', style: 'border-amber-200 bg-amber-50 text-amber-950 hover:bg-amber-800 hover:text-white' },
                { label: 'Cocô Alterado', style: 'border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive hover:text-white' },
                { label: 'Fralda Seca', style: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white' }
              ].map(opt => (
                <Button key={opt.label} variant="outline" className={cn("rounded-2xl h-14 text-[10px] font-black uppercase border transition-all", opt.style)} onClick={() => handleAction('fralda', { status: opt.label }, `Fralda: ${opt.label}`)}>
                  {opt.label}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="max-h-[120px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {registros
                  .filter(r => r.tipo_registro === 'fralda' && new Date(r.created_at).toDateString() === new Date().toDateString())
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 text-[10px] border border-muted-foreground/10 group">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground opacity-50" />
                        <span className="font-bold opacity-70">{new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <span className="font-black text-foreground uppercase">{r.detalhes?.status}</span>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mochila */}
      {activeTab === 'mochila' && (
        <Card className="rounded-2xl animate-in zoom-in-95 duration-300 shadow-lg border-none">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2 text-slate-600 font-black"><ShirtIcon className="h-5 w-5" /> Mochila / Reposição</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {['FRALDA', 'POMADA', 'ROUPA'].map(item => (
                <AlertDialog key={item}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="rounded-[1.25rem] h-16 text-[10px] font-black uppercase tracking-widest border-2 hover:bg-slate-500 hover:text-white border-muted/30">Pedir {item}</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-3xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Solicitar Item</AlertDialogTitle>
                      <AlertDialogDescription className="font-medium text-sm">Confirma a solicitação de <b>{item.toLowerCase()}</b> para os responsáveis? Eles receberão uma notificação.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                      <AlertDialogCancel className="rounded-xl font-bold">Cancelar</AlertDialogCancel>
                      <AlertDialogAction className="rounded-xl font-bold bg-slate-600 hover:bg-slate-700" onClick={() => handleAction('mochila', { item }, `${item} solicitada`)}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Álbum Pedagógico — Tab Integration */}
      {activeTab === 'album' && (
        <Card className="rounded-[2.5rem] border-none shadow-2xl bg-card overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-indigo-400 to-purple-500" />
          <CardHeader className="pb-2 pt-6">
            <CardTitle className="text-base font-black flex items-center gap-2 text-indigo-600">
              <Camera className="h-5 w-5" />
              Álbum / Atividade do Dia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pb-8 pt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {albumFoto ? (
              <div className="relative rounded-3xl overflow-hidden aspect-video bg-muted shadow-lg ring-4 ring-muted/10 group">
                <img src={albumFoto} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <button
                  onClick={() => { setAlbumFoto(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="absolute top-3 right-3 h-10 w-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-all backdrop-blur-md"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div
                className="rounded-3xl border-4 border-dashed border-indigo-100 bg-indigo-50/20 hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-indigo-100 group-hover:bg-indigo-200 transition-all flex items-center justify-center shadow-inner">
                    <ImagePlus className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-foreground">Enviar para o Álbum</p>
                    <p className="text-xs text-muted-foreground mt-1 tracking-tight font-medium">Capture um momento especial da atividade</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Tipo de Atividade</p>
                <Select value={albumCategoria} onValueChange={setAlbumCategoria}>
                  <SelectTrigger className="rounded-2xl h-14 border-muted-foreground/10 text-base font-medium">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {ACTIVITY_TYPES.map(a => (
                      <SelectItem key={a.value} value={a.value} className="rounded-xl my-1">
                        <span className="flex items-center gap-2 font-black text-xs uppercase">
                          <span>{a.emoji}</span>
                          <span>{a.value}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Legenda (Opcional)</p>
                <Textarea
                  placeholder="Escreva uma mensagem para os pais..."
                  className="rounded-2xl min-h-[100px] resize-none border-muted-foreground/10 p-4 font-medium"
                  value={albumLegenda}
                  onChange={e => setAlbumLegenda(e.target.value)}
                />
              </div>

              <div
                className={cn(
                  "flex items-start space-x-3 p-5 rounded-3xl border-2 cursor-pointer transition-all select-none",
                  albumConquista ? "bg-amber-500/5 border-amber-300 shadow-md shadow-amber-100" : "bg-card border-dashed border-muted-foreground/10 hover:border-amber-200"
                )}
                onClick={() => setAlbumConquista(v => !v)}
              >
                <Checkbox id="conquista-cb" checked={albumConquista} onCheckedChange={(v) => setAlbumConquista(!!v)} className="h-5 w-5 mt-0.5 border-amber-300" />
                <div className="grid gap-1">
                  <label className="text-sm font-black text-foreground cursor-pointer flex items-center gap-2">
                    {albumConquista ? '🏅' : '⭐'} Marcar como Conquista
                  </label>
                  <p className="text-[10px] text-muted-foreground leading-relaxed font-bold tracking-tight">
                    Isso dispara uma <span className="text-amber-600">Celebração Especial</span> animada no app dos pais.
                  </p>
                </div>
              </div>

              <Button
                className={cn(
                  "w-full rounded-[1.5rem] h-16 font-black text-lg gap-3 shadow-xl transition-all",
                  albumConquista ? "bg-amber-500 hover:bg-amber-600 shadow-amber-400/30" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30"
                )}
                onClick={handlePublishAlbum}
                disabled={albumLoading}
              >
                {albumLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : albumConquista ? <><Sparkles className="h-6 w-6" /> PUBLICAR CONQUISTA!</> : <><Camera className="h-6 w-6" /> PUBLICAR NO ÁLBUM</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Registro de Ocorrências (Segurança) */}
      {activeTab === 'ocorrencia' && (
        <div className="animate-in zoom-in-95 duration-300">
          <OcorrenciaCard aluno={aluno} addOcorrencia={addOcorrencia} />
        </div>
      )}

      {/* Recados */}
      {activeTab === 'recados' && (
        <Card className="rounded-2xl animate-in zoom-in-95 duration-300 shadow-lg border-none">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2 text-cyan-600 font-black"><MessageSquare className="h-4 w-4" /> Recados Rápidos</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-2">
            <Textarea id="recado-texto" placeholder="Mensagem para os pais..." className="rounded-2xl min-h-[120px] p-4 text-base font-medium border-muted-foreground/10 focus:ring-cyan-200" />
            <Button className="rounded-[1.25rem] w-full h-16 font-black text-lg bg-cyan-600 hover:bg-cyan-700 shadow-xl shadow-cyan-600/20" onClick={() => {
              const el = document.getElementById('recado-texto') as HTMLTextAreaElement;
              if (!el.value.trim()) return;
              handleAction('recado', { mensagem: el.value }, 'Recado enviado');
              el.value = '';
            }}>
              <Check className="h-6 w-6 mr-2" /> Enviar Recado
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerfilAluno;
