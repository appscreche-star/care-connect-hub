import { useState, useEffect } from 'react';
import { useData, type MedicamentoAgenda, type Ocorrencia, type ControleVacina } from '@/contexts/DataProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    HeartPulse, Pill, AlertTriangle, ShieldCheck, Plus, Clock, User,
    Calendar as CalendarIcon, Search, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Saude = () => {
    const {
        alunos, medicamentos, ocorrencias, addMedicamento, addOcorrencia,
        toggleMedicamentoAtivo, refreshSaude, refreshVacinasAluno
    } = useData();

    const [activeTab, setActiveTab] = useState('medicamentos');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loadingMed, setLoadingMed] = useState<string | null>(null);

    // Form states
    const [tipoRegistro, setTipoRegistro] = useState<'medicamento' | 'ocorrencia'>('medicamento');
    const [selectedAlunoId, setSelectedAlunoId] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dosagem, setDosagem] = useState('');
    const [horario, setHorario] = useState('12:00');

    // Vaccination state per filter
    const [vacinasFiltro, setVacinasFiltro] = useState<ControleVacina[]>([]);

    const filteredMeds = medicamentos.filter(m => {
        const aluno = alunos.find(a => a.id === m.aluno_id);
        return aluno?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.nome_medicamento.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const filteredOcs = ocorrencias.filter(o => {
        const aluno = alunos.find(a => a.id === o.aluno_id);
        return aluno?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleConfirm = async () => {
        if (!selectedAlunoId || !titulo) return;

        if (tipoRegistro === 'medicamento') {
            await addMedicamento({
                aluno_id: selectedAlunoId,
                nome_medicamento: titulo,
                dosagem,
                horarios: [horario],
                instrucoes: descricao,
                ativo: true
            });
        } else {
            await addOcorrencia({
                aluno_id: selectedAlunoId,
                titulo,
                descricao,
                notificado_pais: false
            });
        }
        setIsDialogOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setTitulo('');
        setDescricao('');
        setDosagem('');
        setSelectedAlunoId('');
    };

    const handleToggleMed = async (id: string, current: boolean) => {
        setLoadingMed(id);
        await toggleMedicamentoAtivo(id, !current);
        setLoadingMed(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-2">
                        <HeartPulse className="h-8 w-8 text-primary" /> Saúde e Bem-estar
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">Central de monitoramento de saúde dos alunos.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar aluno ou registro..."
                            className="pl-9 rounded-2xl bg-muted/50 border-none h-11 focus-visible:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-2xl h-11 px-6 shadow-lg shadow-primary/20 gap-2">
                                <Plus className="h-4 w-4" /> Novo Registro
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-3xl border-none shadow-2xl sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle className="text-2xl">Novo Evento de Saúde</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Tipo de Registro</Label>
                                    <Select value={tipoRegistro} onValueChange={(v: any) => setTipoRegistro(v)}>
                                        <SelectTrigger className="rounded-xl h-12">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="medicamento">💊 Agendar Medicamento</SelectItem>
                                            <SelectItem value="ocorrencia">⚠️ Relatar Ocorrência</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Aluno</Label>
                                    <Select value={selectedAlunoId} onValueChange={setSelectedAlunoId}>
                                        <SelectTrigger className="rounded-xl h-12">
                                            <SelectValue placeholder="Selecione o aluno..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {alunos.map(a => (
                                                <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>{tipoRegistro === 'medicamento' ? 'Nome do Medicamento' : 'Título da Ocorrência'}</Label>
                                    <Input
                                        className="rounded-xl h-12"
                                        placeholder={tipoRegistro === 'medicamento' ? "Ex: Paracetamol" : "Ex: Febre alta"}
                                        value={titulo}
                                        onChange={e => setTitulo(e.target.value)}
                                    />
                                </div>

                                {tipoRegistro === 'medicamento' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Dosagem</Label>
                                            <Input className="rounded-xl h-12" placeholder="Ex: 5ml" value={dosagem} onChange={e => setDosagem(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Horário</Label>
                                            <Input type="time" className="rounded-xl h-12" value={horario} onChange={e => setHorario(e.target.value)} />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label>Descrição / Instruções</Label>
                                    <Textarea
                                        className="rounded-xl min-h-[100px]"
                                        placeholder="Detalhes importantes..."
                                        value={descricao}
                                        onChange={e => setDescricao(e.target.value)}
                                    />
                                </div>

                                <Button
                                    className="w-full rounded-2xl h-14 text-lg font-bold shadow-xl shadow-primary/25 mt-2"
                                    onClick={handleConfirm}
                                    disabled={!selectedAlunoId || !titulo}
                                >
                                    Confirmar Registro
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs defaultValue="medicamentos" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="bg-muted/40 p-1.5 rounded-3xl h-16 w-full md:w-fit gap-2">
                    <TabsTrigger value="medicamentos" className="rounded-2xl h-full px-8 data-[state=active]:bg-background data-[state=active]:shadow-md gap-2 font-bold transition-all">
                        <Pill className="h-5 w-5" /> Medicamentos
                    </TabsTrigger>
                    <TabsTrigger value="ocorrencias" className="rounded-2xl h-full px-8 data-[state=active]:bg-background data-[state=active]:shadow-md gap-2 font-bold transition-all">
                        <AlertTriangle className="h-5 w-5" /> Ocorrências
                    </TabsTrigger>
                    <TabsTrigger value="vacinas" className="rounded-2xl h-full px-8 data-[state=active]:bg-background data-[state=active]:shadow-md gap-2 font-bold transition-all">
                        <ShieldCheck className="h-5 w-5" /> Vacinação
                    </TabsTrigger>
                </TabsList>

                <div className="mt-8">
                    <TabsContent value="medicamentos">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {filteredMeds.length === 0 && (
                                <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-3xl border-2 border-dashed">
                                    Nenhum medicamento agendado.
                                </div>
                            )}
                            {filteredMeds.map(m => {
                                const aluno = alunos.find(a => a.id === m.aluno_id);
                                return (
                                    <Card key={m.id} className={cn(
                                        "rounded-3xl border-none shadow-sm hover:shadow-xl transition-all group overflow-hidden bg-card",
                                        !m.ativo && "opacity-60"
                                    )}>
                                        <div className={cn("h-2 w-full", m.ativo ? "bg-primary/20" : "bg-muted")} />
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant="secondary" className={cn(
                                                    "border-none rounded-lg px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider",
                                                    m.ativo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                                )}>
                                                    {m.ativo ? 'Em Curso' : 'Pausado'}
                                                </Badge>
                                                <button
                                                    className={cn("transition-colors", m.ativo ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-primary")}
                                                    onClick={() => handleToggleMed(m.id, m.ativo)}
                                                    disabled={loadingMed === m.id}
                                                >
                                                    {loadingMed === m.id ? <Loader2 className="h-6 w-6 animate-spin" /> : <CheckCircle2 className="h-6 w-6" />}
                                                </button>
                                            </div>
                                            <CardTitle className="text-xl font-bold">{m.nome_medicamento}</CardTitle>
                                            <CardDescription className="flex items-center gap-1 font-medium">
                                                <User className="h-3 w-3" /> {aluno?.nome || 'Aluno Excluído'}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="bg-muted/30 p-4 rounded-2xl space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Clock className="h-4 w-4 text-primary" />
                                                    <span className="font-bold">{m.horarios?.[0] || '--:--'}</span>
                                                    {m.dosagem && <span className="text-muted-foreground">• {m.dosagem}</span>}
                                                </div>
                                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{m.instrucoes}</p>
                                            </div>
                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                                                    <CalendarIcon className="h-3 w-3" /> Hoje
                                                </div>
                                                <Badge className={cn(
                                                    "border-none rounded-md px-2 py-0.5 text-[10px] font-bold",
                                                    m.ativo ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                                                )}>
                                                    {m.ativo ? 'ATIVO' : 'INATIVO'}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>

                    <TabsContent value="ocorrencias">
                        <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-card">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-muted/30 border-none">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="py-5 font-bold pl-8">Aluno</TableHead>
                                            <TableHead className="py-5 font-bold">Ocorrência</TableHead>
                                            <TableHead className="py-5 font-bold text-center">Status</TableHead>
                                            <TableHead className="py-5 font-bold">Data/Hora</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredOcs.length === 0 && (
                                            <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Nenhuma ocorrência registrada.</TableCell></TableRow>
                                        )}
                                        {filteredOcs.map(oc => {
                                            const aluno = alunos.find(a => a.id === oc.aluno_id);
                                            return (
                                                <TableRow key={oc.id} className="hover:bg-muted/20 transition-all border-b border-muted/20 last:border-0">
                                                    <TableCell className="pl-8 py-4 font-bold">{aluno?.nome || 'N/A'}</TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="max-w-md">
                                                            <p className="font-bold text-foreground">{oc.titulo}</p>
                                                            <p className="text-xs text-muted-foreground truncate">{oc.descricao}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center py-4">
                                                        <Badge className={cn(
                                                            "rounded-lg border-none px-3 py-1 font-bold text-[10px] uppercase",
                                                            oc.notificado_pais ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                                        )}>
                                                            {oc.notificado_pais ? 'Pais Notificados' : 'Pendente Notif.'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-xs font-medium text-muted-foreground">
                                                        {format(new Date(oc.data_hora), "dd/MM 'às' HH:mm", { locale: ptBR })}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="vacinas">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card className="rounded-3xl border-none shadow-sm bg-primary/5 p-6 flex flex-col items-center text-center">
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                                    <ShieldCheck className="h-8 w-8" />
                                </div>
                                <h3 className="font-bold text-lg mb-1">98%</h3>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight">Cobertura Escolar</p>
                            </Card>

                            <Card className="rounded-3xl border-none shadow-sm bg-card p-6 col-span-1 md:col-span-3">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                    <h3 className="font-bold text-xl">Controle por Aluno</h3>
                                    <Select onValueChange={async (id) => {
                                        const v = await refreshVacinasAluno(id);
                                        setVacinasFiltro(v);
                                    }}>
                                        <SelectTrigger className="w-full md:w-64 rounded-xl">
                                            <SelectValue placeholder="Ver vacinas de..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {alunos.map(a => <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-4">
                                    {vacinasFiltro.length === 0 && <p className="text-center py-8 text-muted-foreground">Selecione um aluno para ver o histórico.</p>}
                                    {vacinasFiltro.map(v => (
                                        <div key={v.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border border-muted-foreground/10 text-primary">
                                                    <ShieldCheck className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold">{v.vacina_nome}</p>
                                                    <p className="text-xs text-muted-foreground">Previsão: {v.data_prevista ? format(new Date(v.data_prevista), "dd/MM/yyyy") : 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge className={cn(
                                                    "rounded-lg text-[9px] h-5 border-none font-bold",
                                                    v.status === 'em_dia' ? "bg-emerald-500/10 text-emerald-600" : v.status === 'atrasada' ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"
                                                )}>
                                                    {v.status.toUpperCase()}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <Card className="rounded-3xl border-none shadow-sm bg-amber-500/5 border-l-4 border-l-amber-500">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                            <AlertCircle className="h-5 w-5" /> Alertas de Saúde
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-amber-900/70 leading-relaxed font-medium">
                            Existem <b>{medicamentos.filter(m => m.ativo).length} medicações</b> ativas sendo monitoradas hoje.
                            Certifique-se de registrar a aplicação após o procedimento.
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm bg-primary/5 border-l-4 border-l-primary">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-primary">
                            <ShieldCheck className="h-5 w-5" /> Relatório Semanal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-primary/70 leading-relaxed font-medium">
                            Foram registradas <b>{ocorrencias.length} ocorrências</b> nos últimos 7 dias.
                            O sistema de vacinação está pronto para consulta individual por aluno.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Saude;
