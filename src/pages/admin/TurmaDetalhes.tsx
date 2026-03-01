import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, Users, ShieldAlert, Heart, GraduationCap } from 'lucide-react';

const TurmaDetalhes = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { turmas, alunos, perfis, loading } = useData();

    const turma = turmas.find(t => t.id === id);
    const alunosDaTurma = alunos.filter(a => a.turma_id === id);
    const professor = perfis.find(p => p.id === turma?.professor_id);

    if (loading) return <div className="p-12 text-center">Carregando detalhes...</div>;
    if (!turma) return <div className="p-12 text-center text-destructive">Turma não encontrada.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full h-10 w-10">
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <GraduationCap className="h-6 w-6 text-primary" /> {turma.nome_turma}
                    </h1>
                    <p className="text-sm text-muted-foreground">{turma.periodo} • {turma.ano_letivo || '2026'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-2xl border-none shadow-lg bg-card col-span-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Informações da Sala</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Responsável (Regente)</p>
                            <p className="font-bold border-l-2 border-primary pl-2">{professor?.nome || 'Sem Regente Associado'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Ocupação</p>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-bold">{alunosDaTurma.length} / {turma.capacidade_maxima || 20} Alunos</span>
                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                                    {Math.round((alunosDaTurma.length / (turma.capacidade_maxima || 20)) * 100)}%
                                </span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${(alunosDaTurma.length / (turma.capacidade_maxima || 20)) * 100}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Faixa Etária</p>
                            <p className="text-sm font-bold">{turma.faixa_etaria_min} a {turma.faixa_etaria_max} anos</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-none shadow-lg bg-card md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b mb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" /> Alunos Matriculados
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="pl-6">Aluno</TableHead>
                                    <TableHead>Saúde</TableHead>
                                    <TableHead className="text-right pr-6">Ação</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {alunosDaTurma.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                                            Nenhum aluno matriculado nesta turma ainda.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    alunosDaTurma.map(aluno => (
                                        <TableRow key={aluno.id} className="hover:bg-muted/30 transition-colors border-b border-muted/20">
                                            <TableCell className="pl-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {aluno.nome[0]}
                                                    </div>
                                                    <span className="font-semibold text-sm">{aluno.nome}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {aluno.alergias ? (
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full w-fit">
                                                        <ShieldAlert className="h-3 w-3" /> ALÉRGICO
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">
                                                        <Heart className="h-3 w-3" /> SAUDÁVEL
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="sm" className="text-xs rounded-lg" onClick={() => navigate('/admin/alunos')}>
                                                    Ver Perfil
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TurmaDetalhes;
