import React, { useState } from 'react';
import { useData, type Evento } from '@/contexts/DataProvider';
import { Calendar as CalendarIcon, Plus, Pencil, Trash2, Users, Clock, Info, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const CalendarioAdmin = () => {
    const { eventos, addEvento, updateEvento, deleteEvento } = useData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Evento | null>(null);
    const [formData, setFormData] = useState<Partial<Evento>>({
        titulo: '',
        descricao: '',
        data: '',
        hora: '',
        tipo: 'reuniao',
        publico_alvo: 'todos'
    });

    const handleOpenDialog = (event?: Evento) => {
        if (event) {
            setEditingEvent(event);
            setFormData(event);
        } else {
            setEditingEvent(null);
            setFormData({
                titulo: '',
                descricao: '',
                data: format(new Date(), 'yyyy-MM-dd'),
                hora: '08:00',
                tipo: 'reuniao',
                publico_alvo: 'todos'
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.titulo || !formData.data) return;

        if (editingEvent) {
            await updateEvento(editingEvent.id, formData);
        } else {
            await addEvento(formData as any);
        }
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Calendário Escolar 🗓️</h1>
                    <p className="text-muted-foreground font-medium">Gerencie eventos, reuniões e festas da creche.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="rounded-2xl h-12 font-black gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                    <Plus className="h-5 w-5" /> Novo Evento
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 rounded-3xl border-none shadow-xl overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b p-6">
                        <CardTitle className="text-lg font-black flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-primary" /> Planejamento Mensal
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="bg-muted/10 rounded-[2rem] border-4 border-dashed border-muted flex flex-col items-center justify-center py-20 text-center gap-4">
                            <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center">
                                <CalendarIcon className="h-10 w-10 text-muted-foreground/40" />
                            </div>
                            <div className="max-w-xs">
                                <p className="text-lg font-black text-foreground">Visão Gerencial</p>
                                <p className="text-sm text-muted-foreground font-medium">O cronograma anual está sendo sincronizado com os calendários locais.</p>
                            </div>
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-1">Sincronizado</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-card/50">
                    <CardHeader className="bg-muted/30 border-b">
                        <CardTitle className="text-lg font-black flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" /> Próximos Eventos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {eventos.length === 0 ? (
                            <div className="text-center py-20">
                                <Info className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                                <p className="text-sm text-muted-foreground font-bold italic">Nenhum evento agendado</p>
                            </div>
                        ) : (
                            eventos.map(e => (
                                <div key={e.id} className="p-5 rounded-3xl bg-card border border-muted-foreground/5 shadow-sm space-y-3 group hover:border-primary/20 transition-all">
                                    <div className="flex items-center justify-between">
                                        <Badge className={cn(
                                            "uppercase text-[9px] font-black border-none",
                                            e.tipo === 'reuniao' ? 'bg-indigo-500/10 text-indigo-600' :
                                                e.tipo === 'festa' ? 'bg-amber-500/10 text-amber-600' :
                                                    e.tipo === 'feriado' ? 'bg-rose-500/10 text-rose-600' : 'bg-primary/10 text-primary'
                                        )}>{e.tipo}</Badge>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="ghost" onClick={() => handleOpenDialog(e)} className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"><Pencil className="h-3.5 w-3.5" /></Button>
                                            <Button size="icon" variant="ghost" onClick={() => deleteEvento(e.id)} className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                                        </div>
                                    </div>
                                    <h3 className="font-black text-foreground group-hover:text-primary transition-colors">{e.titulo}</h3>
                                    <p className="text-[10px] text-muted-foreground font-bold leading-relaxed line-clamp-2 italic">{e.descricao}</p>
                                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-black uppercase tracking-widest pt-1">
                                        <span className="flex items-center gap-1.5"><CalendarIcon className="h-3 w-3 text-primary" /> {format(new Date(e.data), 'dd MMM', { locale: ptBR })}</span>
                                        {e.hora && <span className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-primary" /> {e.hora}</span>}
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="rounded-3xl sm:max-w-[500px] border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-foreground tracking-tight">
                            {editingEvent ? '✏️ Editar Evento' : '✨ Criar Novo Evento'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 py-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Título do Evento</label>
                            <Input
                                placeholder="Ex: Reunião de Pais e Mestres"
                                value={formData.titulo}
                                onChange={e => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                                className="rounded-2xl h-12 font-bold focus:ring-primary/20"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Data</label>
                                <Input
                                    type="date"
                                    value={formData.data}
                                    onChange={e => setFormData(prev => ({ ...prev, data: e.target.value }))}
                                    className="rounded-2xl h-12 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Horário (Opcional)</label>
                                <Input
                                    type="time"
                                    value={formData.hora}
                                    onChange={e => setFormData(prev => ({ ...prev, hora: e.target.value }))}
                                    className="rounded-2xl h-12 font-bold"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Tipo</label>
                                <Select value={formData.tipo} onValueChange={(v: any) => setFormData(prev => ({ ...prev, tipo: v }))}>
                                    <SelectTrigger className="rounded-2xl h-12 font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        <SelectItem value="reuniao" className="font-bold">🤝 Reunião</SelectItem>
                                        <SelectItem value="festa" className="font-bold">🎉 Festa</SelectItem>
                                        <SelectItem value="feriado" className="font-bold">🚩 Feriado</SelectItem>
                                        <SelectItem value="outro" className="font-bold">✨ Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Público</label>
                                <Select value={formData.publico_alvo} onValueChange={(v: any) => setFormData(prev => ({ ...prev, publico_alvo: v }))}>
                                    <SelectTrigger className="rounded-2xl h-12 font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        <SelectItem value="todos" className="font-bold">🌍 Todos</SelectItem>
                                        <SelectItem value="pais" className="font-bold">👪 Pais</SelectItem>
                                        <SelectItem value="professores" className="font-bold">👩‍🏫 Professores</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Descrição</label>
                            <Textarea
                                placeholder="Detalhes sobre o evento..."
                                value={formData.descricao}
                                onChange={e => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                                className="rounded-2xl min-h-[100px] font-medium resize-none shadow-sm"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-2xl h-12 font-bold px-8">Cancelar</Button>
                        <Button onClick={handleSubmit} className="rounded-2xl h-12 font-black px-12 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 gap-2">
                            <Check className="h-5 w-5" /> {editingEvent ? 'Atualizar' : 'Salvar Evento'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CalendarioAdmin;
