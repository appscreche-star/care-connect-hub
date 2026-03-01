import React from 'react';
import { useData } from '@/contexts/DataProvider';
import { Calendar as CalendarIcon, Clock, Users, Info, ChevronRight, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const CalendarioEducador = () => {
    const { eventos } = useData();

    // Filter events for educators (everyone or specifically for teachers)
    const availableEvents = eventos.filter(e => e.publico_alvo === 'todos' || e.publico_alvo === 'professores');

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-foreground tracking-tight">Calendário Escolar 🗓️</h1>
                    <p className="text-xs text-muted-foreground font-semibold mt-0.5">Stay updated with school events and meetings.</p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative">
                    <Bell className="h-5 w-5" />
                    <div className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
                </div>
            </header>

            <Card className="rounded-[2rem] border-none shadow-xl bg-gradient-to-br from-primary/5 via-background to-background overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <CalendarIcon className="h-32 w-32" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Agenda do Mês
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-10 italic text-muted-foreground text-sm">
                        Calendário visual em desenvolvimento...
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-lg font-black text-foreground flex items-center gap-2 px-1">
                    Próximos Compromissos
                </h2>

                {availableEvents.length === 0 ? (
                    <div className="p-8 text-center bg-card rounded-[2rem] border-2 border-dashed border-muted">
                        <Info className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground font-bold tracking-tight">Aguardando novos eventos...</p>
                    </div>
                ) : (
                    availableEvents.map(e => (
                        <Card key={e.id} className="rounded-3xl border-none shadow-md hover:shadow-lg transition-all active:scale-[0.98] group cursor-pointer overflow-hidden">
                            <div className={cn(
                                "h-1.5 w-full",
                                e.tipo === 'reuniao' ? 'bg-indigo-400' :
                                    e.tipo === 'festa' ? 'bg-amber-400' :
                                        e.tipo === 'feriado' ? 'bg-rose-400' : 'bg-primary'
                            )} />
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="flex flex-col items-center justify-center h-14 w-14 rounded-2xl bg-muted/30 border border-muted-foreground/10 shrink-0">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground leading-none mb-1">
                                        {format(new Date(e.data), 'MMM', { locale: ptBR })}
                                    </span>
                                    <span className="text-xl font-black text-foreground leading-none">
                                        {format(new Date(e.data), 'dd')}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="secondary" className="text-[9px] font-black tracking-widest uppercase py-0 px-2 h-4">
                                            {e.tipo}
                                        </Badge>
                                        {e.hora && (
                                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold italic">
                                                <Clock className="h-2.5 w-2.5" /> {e.hora}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-black text-foreground text-base truncate group-hover:text-primary transition-colors">{e.titulo}</h3>
                                    <p className="text-xs text-muted-foreground font-medium line-clamp-1">{e.descricao || 'Sem descrição adicional'}</p>
                                </div>

                                <ChevronRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary transform transition-all group-hover:translate-x-1" />
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default CalendarioEducador;
