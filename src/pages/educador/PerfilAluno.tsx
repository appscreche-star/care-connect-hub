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
import { ArrowLeft, LogIn, LogOut, Smile, Meh, Moon as MoonIcon, Frown, UtensilsCrossed, Baby, ShirtIcon, Camera, MessageSquare, Pill, Check, Loader2, ShieldAlert, Thermometer, Droplets, Sparkles, Plus, History, AlertTriangle, ImagePlus, X as XIcon, FileImage } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

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

const PerfilAluno = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { alunos, loading, addRegistro, registros, fetchRegistrosAluno } = useData();
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
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">{aluno.nome[0]}</div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{aluno.nome}</h1>
          <p className="text-sm text-muted-foreground">{aluno.idade || 'Idade não informada'}</p>
        </div>
      </div>

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
      <Card className="rounded-2xl">
        <CardHeader className="pb-2"><CardTitle className="text-base">Presença</CardTitle></CardHeader>
        <CardContent>
          <Button
            className={`w-full h-14 rounded-xl text-base gap-3 ${checkedIn ? 'bg-destructive hover:bg-destructive/90' : 'bg-emerald-500 hover:bg-emerald-600'}`}
            onClick={() => handleAction('presenca', { status: checkedIn ? 'saida' : 'entrada' }, checkedIn ? 'Check-out realizado' : 'Check-in realizado')}
          >
            {checkedIn ? <><LogOut className="h-5 w-5" /> Check-out</> : <><LogIn className="h-5 w-5" /> Check-in</>}
          </Button>
        </CardContent>
      </Card>

      {/* Saúde e Temperatura */}
      <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-card">
        <CardHeader className="pb-2 border-b mb-3 bg-muted/20">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-primary" /> Saúde e Monitoramento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Temperatura (°C)</Label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  placeholder="36.5"
                  className="rounded-xl h-11 pl-10"
                  onBlur={(e) => {
                    if (e.target.value) handleAction('saude', { temperatura: e.target.value }, `Temperatura: ${e.target.value}°C`);
                  }}
                />
                <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Medicação</Label>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full h-11 rounded-xl gap-2 border-primary/20 text-primary hover:bg-primary/5">
                    <Pill className="h-4 w-4" /> Administrar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Administrar Medicação</AlertDialogTitle>
                    <AlertDialogDescription>
                      {aluno.medicamentos_uso_continuo
                        ? `Medicação: ${aluno.medicamentos_uso_continuo}`
                        : "Nenhum medicamento de uso contínuo registrado."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                    <AlertDialogAction className="rounded-xl" onClick={() => handleAction('saude', { med: 'dose_ok' }, "Medicação realizada")}>Confirmar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Higiene */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4" /> Higiene</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2 text-center">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase">Banho</Label>
              <Toggle
                className="w-full h-12 rounded-xl gap-2 border data-[state=on]:bg-emerald-500 data-[state=on]:text-white"
                onPressedChange={(pressed) => handleAction('higiene', { item: 'banho', ok: pressed }, "Registro de Banho")}
              >
                <Droplets className="h-4 w-4" /> Realizado
              </Toggle>
            </div>
            <div className="space-y-2 text-center">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase">Higiene Bucal</Label>
              <Toggle
                className="w-full h-12 rounded-xl gap-2 border data-[state=on]:bg-blue-500 data-[state=on]:text-white"
                onPressedChange={(pressed) => handleAction('higiene', { item: 'bucal', ok: pressed }, "Higiene Bucal")}
              >
                <Sparkles className="h-4 w-4" /> Realizado
              </Toggle>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bem-estar */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-2"><CardTitle className="text-base">Bem-estar</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {moods.map(m => (
              <button
                key={m.label}
                onClick={() => handleAction('bemestar', { humor: m.label, emoji: m.emoji }, `Humor: ${m.label}`)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all min-h-[72px] ${selectedMood === m.label ? 'bg-primary/10 ring-2 ring-primary' : 'bg-accent/50 hover:bg-accent'}`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[10px] font-medium text-foreground">{m.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alimentação */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><UtensilsCrossed className="h-4 w-4" /> Alimentação</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {['Aceitou tudo', 'Aceitou metade', 'Recusou'].map(opt => (
              <Button key={opt} variant="outline" className="rounded-xl h-12 text-xs" onClick={() => handleAction('alimentacao', { status: opt, ml: mlBottle }, `Alimentação: ${opt}`)}>
                {opt}
              </Button>
            ))}
          </div>
          <Input placeholder="ml da mamadeira (opcional)" type="number" value={mlBottle} onChange={e => setMlBottle(e.target.value)} className="rounded-xl" />
        </CardContent>
      </Card>

      {/* Sono */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><MoonIcon className="h-4 w-4" /> Sono</CardTitle></CardHeader>
        <CardContent>
          <Button
            className={`w-full h-14 rounded-xl text-base gap-3 ${sleeping ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
            variant={sleeping ? 'default' : 'outline'}
            onClick={() => handleAction('sono', { status: sleeping ? 'acordado' : 'dormindo' }, sleeping ? 'Soneca encerrada' : 'Soneca iniciada')}
          >
            <MoonIcon className="h-5 w-5" /> {sleeping ? 'Encerrar Soneca' : 'Iniciar Soneca'}
          </Button>
        </CardContent>
      </Card>

      {/* Evacuação */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2"><Baby className="h-4 w-4" /> Evacuação</CardTitle>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold italic"><History className="h-3 w-3" /> Histórico</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Xixi', style: 'border-yellow-200 bg-yellow-50 text-yellow-700' },
              { label: 'Cocô Normal', style: 'border-amber-200 bg-amber-50 text-amber-900' },
              { label: 'Cocô Alterado', style: 'border-destructive/20 bg-destructive/5 text-destructive' },
              { label: 'Fralda Seca', style: 'border-emerald-200 bg-emerald-50 text-emerald-700' }
            ].map(opt => (
              <Button key={opt.label} variant="outline" className={cn("rounded-xl h-11 text-xs border", opt.style)} onClick={() => handleAction('fralda', { status: opt.label }, `Fralda: ${opt.label}`)}>
                {opt.label}
              </Button>
            ))}
          </div>

          <div className="space-y-1.5">
            <div className="max-h-[100px] overflow-y-auto space-y-1">
              {registros
                .filter(r => r.tipo_registro === 'fralda' && new Date(r.created_at).toDateString() === new Date().toDateString())
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/40 text-[10px] border border-muted">
                    <span className="font-bold opacity-70">{new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="font-bold">{r.detalhes?.status}</span>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mochila */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><ShirtIcon className="h-4 w-4" /> Mochila</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {['Fralda', 'Pomada', 'Roupa'].map(item => (
              <AlertDialog key={item}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="rounded-xl h-12 text-xs">Solicitar {item}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Solicitar {item}</AlertDialogTitle>
                    <AlertDialogDescription>Confirma a solicitação de {item.toLowerCase()} para {aluno.nome}? O responsável será notificado.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                    <AlertDialogAction className="rounded-xl" onClick={() => handleAction('mochila', { item }, `${item} solicitada`)}>Confirmar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Álbum Pedagógico — Full Implementation */}
      <Card className="rounded-[2rem] border-none shadow-xl bg-card overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-pink-400 to-purple-500" />
        <CardHeader className="pb-2 pt-5">
          <CardTitle className="text-base flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Álbum / Atividades Pedagógicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pb-6">

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture={undefined}
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Photo Upload Area */}
          {albumFoto ? (
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-muted">
              <img src={albumFoto} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={() => { setAlbumFoto(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-all"
              >
                <XIcon className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 text-[10px] font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded-full uppercase tracking-widest">
                Foto selecionada
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl border-2 border-dashed border-primary/20 bg-primary/3 hover:bg-primary/8 transition-all cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center gap-3 py-10">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all flex items-center justify-center">
                  <ImagePlus className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-foreground">Adicionar Foto</p>
                  <p className="text-[11px] text-muted-foreground">Câmera ou galeria do dispositivo</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 border border-primary/20 rounded-full px-3 py-1">📷 Câmera</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 border border-primary/20 rounded-full px-3 py-1">🖼️ Galeria</span>
                </div>
              </div>
            </div>
          )}

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Categoria da Atividade</Label>
            <Select value={albumCategoria} onValueChange={setAlbumCategoria}>
              <SelectTrigger className="rounded-xl h-12">
                <SelectValue placeholder="Selecione o tipo de atividade..." />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_TYPES.map(a => (
                  <SelectItem key={a.value} value={a.value}>
                    <span className="flex items-center gap-2">
                      <span>{a.emoji}</span>
                      <span>{a.value}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Visual category chip */}
            {albumCategoria && (() => {
              const cat = ACTIVITY_TYPES.find(a => a.value === albumCategoria);
              return cat ? (
                <div className={cn("inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest rounded-full px-3 py-1.5 border", cat.color)}>
                  <span>{cat.emoji}</span> {cat.value}
                </div>
              ) : null;
            })()}
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Legenda / Descrição</Label>
            <Textarea
              placeholder="Descreva o momento especial..."
              className="rounded-xl min-h-[80px] resize-none"
              value={albumLegenda}
              onChange={e => setAlbumLegenda(e.target.value)}
            />
          </div>

          {/* Conquista Checkbox */}
          <div
            className={cn(
              "flex items-start space-x-3 p-4 rounded-2xl border-2 cursor-pointer transition-all select-none",
              albumConquista
                ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 shadow-md shadow-amber-100"
                : "bg-muted/20 border-dashed border-muted-foreground/20 hover:border-primary/30"
            )}
            onClick={() => setAlbumConquista(v => !v)}
          >
            <Checkbox
              id="conquista-cb"
              checked={albumConquista}
              onCheckedChange={(v) => setAlbumConquista(!!v)}
              className="mt-0.5"
            />
            <div className="grid gap-1 leading-none">
              <label htmlFor="conquista-cb" className="text-sm font-black text-foreground cursor-pointer flex items-center gap-2">
                {albumConquista ? '🏆' : '⭐'} Marcar como Primeira Vez / Conquista
              </label>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Dispara uma <span className="font-bold text-amber-600">celebração especial</span> no app dos responsáveis com animação e notificação prioritária.
              </p>
            </div>
          </div>

          {/* Publish Button */}
          <Button
            className={cn(
              "w-full rounded-2xl h-14 font-black text-base gap-3 shadow-xl transition-all",
              albumConquista
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-amber-400/30"
                : "shadow-primary/20"
            )}
            onClick={handlePublishAlbum}
            disabled={albumLoading}
          >
            {albumLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : albumConquista ? (
              <><Sparkles className="h-5 w-5" /> Publicar Conquista! 🏆</>
            ) : (
              <><Camera className="h-5 w-5" /> Publicar no Álbum</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Registro de Ocorrências (Segurança) */}
      <Card className="rounded-2xl border-none shadow-md bg-card border-l-4 border-l-destructive">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" /> Registro de Ocorrência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-1">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Tipo de Incidente</Label>
              <Select onValueChange={(v) => console.log('Tipo incidente:', v)}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Selecione o tipo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Queda">Queda / Escoriação</SelectItem>
                  <SelectItem value="Mordida">Mordida</SelectItem>
                  <SelectItem value="Indisposição">Indisposição / Febre</SelectItem>
                  <SelectItem value="Conflito">Conflito entre Colegas</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Descrição Detalhada</Label>
              <Textarea id="incidente-desc" placeholder="Descreva o que houve e o horário..." className="rounded-xl min-h-[80px]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Providências Tomadas</Label>
              <Input id="incidente-prov" placeholder="Ex: Gelo aplicado, comunicado ao pai..." className="rounded-xl h-11" />
            </div>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-[10px] text-amber-800 leading-tight">
              <b>Fluxo de Segurança:</b> Este registro será enviado para a <b>Coordenação</b> validar antes de ser liberado para os pais.
            </p>
          </div>

          <Button
            variant="destructive"
            className="w-full rounded-xl h-12 font-bold"
            onClick={() => {
              toast({ title: "📨 Enviado", description: "Aguardando aprovação da coordenação." });
              handleAction('ocorrencia', {
                status: 'pendente_coordenacao',
                tipo: 'incidente'
              }, "Ocorrência registrada");
            }}
          >
            Enviar para Coordenação
          </Button>
        </CardContent>
      </Card>

      {/* Recados */}
      <Card className="rounded-2xl">
        <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Recados</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Textarea id="recado-texto" placeholder="Escreva um recado para os pais..." className="rounded-xl min-h-[80px]" />
          <Button className="rounded-xl w-full" onClick={() => {
            const el = document.getElementById('recado-texto') as HTMLTextAreaElement;
            handleAction('recado', { mensagem: el.value }, 'Recado enviado');
            el.value = '';
          }}>
            Enviar Recado
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerfilAluno;
