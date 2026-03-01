import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataProvider';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const HomeEducador = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { turmas, loading } = useData();

    // Filter turmas where this educator is the professor
    // For admin/demo, we might show more, but for educator flow it should be specific
    const minhasTurmas = turmas.filter(t => t.professor_id === user?.id);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col gap-1 px-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                    Olá, <span className="text-primary">{user?.nome?.split(' ')[0] || 'Educador'}</span>! 👋
                </h1>
                <p className="text-muted-foreground text-sm font-medium">Selecione uma de suas turmas para iniciar os registros.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {minhasTurmas.length === 0 ? (
                    <Card className="rounded-3xl border-dashed border-2 bg-muted/30 col-span-full">
                        <CardContent className="p-16 text-center space-y-4">
                            <div className="bg-muted p-4 rounded-full w-fit mx-auto">
                                <GraduationCap className="h-10 w-10 text-muted-foreground opacity-40" />
                            </div>
                            <p className="text-muted-foreground font-medium">Você não possui turmas vinculadas no momento.</p>
                        </CardContent>
                    </Card>
                ) : (
                    minhasTurmas.map((turma, index) => (
                        <Card
                            key={turma.id}
                            className={cn(
                                "rounded-[2rem] border-none shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 cursor-pointer hover:shadow-2xl transition-all duration-300 active:scale-[0.97] group overflow-hidden relative",
                                index === 0 ? " ring-1 ring-primary/20" : ""
                            )}
                            onClick={() => navigate(`/educador/turma/${turma.id}`)}
                        >
                            <div className={cn(
                                "absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500",
                                index % 2 === 0 ? "bg-primary/10" : "bg-emerald-500/10"
                            )} />

                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-4">
                                        <div className={cn(
                                            "p-3 rounded-2xl w-fit shadow-inner",
                                            index % 2 === 0 ? "bg-primary/20 text-primary" : "bg-emerald-500/20 text-emerald-600"
                                        )}>
                                            <GraduationCap className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-2xl text-foreground tracking-tight group-hover:text-primary transition-colors">
                                                {turma.nome_turma}
                                            </h3>
                                            <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground mt-2">
                                                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {turma.periodo}</span>
                                                <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                                <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {turma.capacidade_maxima || 20} Alunos</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:rotate-12 transition-all duration-300 shadow-sm">
                                        <ChevronRight className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardContent>

                            <div className={cn(
                                "h-1.5 w-full",
                                index % 2 === 0 ? "bg-primary" : "bg-emerald-500"
                            )} />
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default HomeEducador;
