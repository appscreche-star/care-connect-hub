import { useState } from 'react';
import { useData } from '@/contexts/DataProvider';
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
    HeartPulse,
    Pill,
    AlertTriangle,
    ShieldCheck,
    Plus,
    Clock,
    User,
    Calendar as CalendarIcon,
    Search,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RegistroSaude {
    id: string;
    aluno_id: string;
    aluno_nome: string;
    tipo: 'medicamento' | 'ocorrencia' | 'vacina';
    titulo: string;
    descricao: string;
    data: string;
    status: 'pendente' | 'concluido' | 'alerta';
    responsavel?: string;
    dosagem?: string;
    horarios?: string[];
}

const Saude = () => {
    const { alunos } = useData();
    const [activeTab, setActiveTab] = useState('medicamentos');

    // Mock de dados para visualização (Será integrado ao DataProvider futuramente)
    const [registros, setRegistros] = useState<RegistroSaude[]>([
        {
            id: '1',
            aluno_id: '1',
            aluno_nome: 'João Silva',
            tipo: 'medicamento',
            titulo: 'Amoxicilina',
            descricao: 'Dar 5ml após o almoço',
            data: new Date().toISOString(),
            status: 'pendente',
            dosagem: '5ml',
            horarios: ['12:30']
        },
        {
            id: '2',
            aluno_id: '2',
            aluno_nome: 'Maria Oliveira',
            tipo: 'ocorrencia',
            titulo: 'Febre súbita',
            descricao: 'Apresentou 38.5°C às 10h. Comunicado aos pais.',
            data: new Date().toISOString(),
            status: 'alerta',
            responsavel: 'Prof. Ana'
        },
        {
            id: '3',
            aluno_id: '3',
            aluno_nome: 'Pedro Santos',
            tipo: 'vacina',
            titulo: 'Gripe (Anual)',
            descricao: 'Campanha de vacinação escolar',
            data: '2026-05-20T10:00:00Z',
            status: 'pendente'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredRegistros = registros.filter(r =>
        r.aluno_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

                    <Dialog>
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
                                    <Select defaultValue="medicamento">
                                        <SelectTrigger className="rounded-xl h-12">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="medicamento">💊 Agendar Medicamento</SelectItem>
                                            <SelectItem value="ocorrencia">⚠️ Relatar Ocorrência</SelectItem>
                                            <SelectItem value="vacina">💉 Controle de Vacina</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Aluno</Label>
                                    <Select>
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
                                    <Label>Título / Assunto</Label>
                                    <Input className="rounded-xl h-12" placeholder="Ex: Paracetamol 500mg" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Descrição Detalhada / Instruções</Label>
                                    <Textarea className="rounded-xl min-h-[100px]" placeholder="Instruções de uso ou detalhes da ocorrência..." />
                                </div>

                                <Button className="w-full rounded-2xl h-14 text-lg font-bold shadow-xl shadow-primary/25 mt-2">
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
                            {filteredRegistros.filter(r => r.tipo === 'medicamento').map(r => (
                                <Card key={r.id} className="rounded-3xl border-none shadow-sm hover:shadow-xl transition-all group overflow-hidden bg-card">
                                    <div className="h-2 bg-primary/20 w-full" />
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none rounded-lg px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider">
                                                Próxima Dose
                                            </Badge>
                                            <button className="text-muted-foreground hover:text-primary transition-colors">
                                                <CheckCircle2 className="h-6 w-6" />
                                            </button>
                                        </div>
                                        <CardTitle className="text-xl font-bold">{r.titulo}</CardTitle>
                                        <CardDescription className="flex items-center gap-1 font-medium">
                                            <User className="h-3 w-3" /> {r.aluno_nome}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="bg-muted/30 p-4 rounded-2xl space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-primary" />
                                                <span className="font-bold">{r.horarios?.[0] || '--:--'}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{r.descricao}</p>
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                                                <CalendarIcon className="h-3 w-3" /> Hoje
                                            </div>
                                            <Badge className="bg-emerald-500/10 text-emerald-600 border-none rounded-md px-2 py-0.5 text-[10px] font-bold">
                                                AGENDADO
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
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
                                            <TableHead className="py-5 font-bold text-right pr-8">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRegistros.filter(r => r.tipo === 'ocorrencia').map(r => (
                                            <TableRow key={r.id} className="hover:bg-muted/20 transition-all border-b border-muted/20 last:border-0">
                                                <TableCell className="pl-8 py-4 font-bold">{r.aluno_nome}</TableCell>
                                                <TableCell className="py-4">
                                                    <div className="max-w-md">
                                                        <p className="font-bold text-foreground">{r.titulo}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{r.descricao}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center py-4">
                                                    <Badge className={cn(
                                                        "rounded-lg border-none px-3 py-1 font-bold text-[10px] uppercase",
                                                        r.status === 'alerta' ? "bg-red-500/10 text-red-600" : "bg-emerald-500/10 text-emerald-600"
                                                    )}>
                                                        {r.status === 'alerta' ? 'Crítico' : 'Resolvido'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4 text-xs font-medium text-muted-foreground">
                                                    {format(new Date(r.data), "dd/MM 'às' HH:mm", { locale: ptBR })}
                                                </TableCell>
                                                <TableCell className="text-right pr-8">
                                                    <Button variant="ghost" size="sm" className="rounded-xl h-9 hover:bg-primary/10 hover:text-primary font-bold">Ver Detalhes</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
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
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-xl">Próximas Campanhas</h3>
                                    <Button variant="link" className="text-primary font-bold">Ver Calendário SUS</Button>
                                </div>
                                <div className="space-y-4">
                                    {filteredRegistros.filter(r => r.tipo === 'vacina').map(v => (
                                        <div key={v.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border border-muted-foreground/10 text-primary">
                                                    <HeartPulse className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold">{v.titulo}</p>
                                                    <p className="text-xs text-muted-foreground">{v.aluno_nome}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold">{format(new Date(v.data), "dd 'de' MMMM", { locale: ptBR })}</p>
                                                <Badge variant="outline" className="rounded-lg text-[9px] h-5 border-primary/20 text-primary font-bold">PENDENTE</Badge>
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
                            Existem <b>3 alunos</b> com medicações pendentes para o turno da tarde.
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
                            O índice de ocorrências baixou <b>15%</b> em relação à semana passada.
                            O módulo de vacinação está 100% atualizado para o Berçário II.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Saude;
