import React, { useState } from 'react';
import { useData, type Perfil } from '@/contexts/DataProvider';
import { Users, Plus, Search, Mail, Phone, Key, ShieldCheck, Pencil, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Responsaveis = () => {
    const { perfis, addPerfil, updatePerfil, deletePerfil } = useData();
    const responsaveis = perfis.filter(p => p.role === 'Responsavel');

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPerfil, setEditingPerfil] = useState<Perfil | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState<Partial<Perfil>>({
        nome: '',
        email: '',
        telefone: '',
        username: '',
        password: '',
        status: 'ativo',
        role: 'Responsavel'
    });

    const handleOpenDialog = (perfil?: Perfil) => {
        if (perfil) {
            setEditingPerfil(perfil);
            setFormData(perfil);
        } else {
            setEditingPerfil(null);
            setFormData({
                nome: '',
                email: '',
                telefone: '',
                username: '',
                password: '',
                status: 'ativo',
                role: 'Responsavel'
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.nome || !formData.username) return;

        if (editingPerfil) {
            await updatePerfil(editingPerfil.id, formData);
        } else {
            await addPerfil(formData as any);
        }
        setIsDialogOpen(false);
    };

    const filteredResponsaveis = responsaveis.filter(p =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Responsáveis e Pais 👨‍👩‍👧</h1>
                    <p className="text-muted-foreground font-medium">Gerencie o acesso e credenciais dos pais.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="rounded-2xl h-12 font-black gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                    <Plus className="h-5 w-5" /> Novo Responsável
                </Button>
            </div>

            <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
                <div className="p-6 border-b bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nome, login ou e-mail..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-11 rounded-2xl h-12 border-muted-foreground/10 bg-background/50 focus:ring-primary/20 font-medium"
                        />
                    </div>
                    <Badge variant="outline" className="rounded-xl px-4 py-1.5 font-black uppercase text-[10px] tracking-widest border-muted-foreground/10">
                        {filteredResponsaveis.length} Responsáveis Encontrados
                    </Badge>
                </div>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-muted-foreground/5 bg-muted/10">
                                <TableHead className="font-black text-[10px] uppercase tracking-widest pl-8 py-4">Responsável</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Acesso (Login)</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest">Contatos</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-8">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredResponsaveis.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-48 text-center text-muted-foreground italic font-medium">
                                        Nenhum responsável encontrado para esta busca.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredResponsaveis.map(p => (
                                    <TableRow key={p.id} className="border-muted-foreground/5 hover:bg-primary/5 transition-colors group">
                                        <TableCell className="pl-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                                                    {p.nome[0]}
                                                </div>
                                                <div>
                                                    <p className="font-black text-foreground group-hover:text-primary transition-colors">{p.nome}</p>
                                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{p.cpf || 'Cpf não informado'}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="inline-flex flex-col items-center bg-muted/40 px-4 py-2 rounded-2xl border border-muted-foreground/5">
                                                <span className="text-xs font-mono font-black text-primary">{p.username}</span>
                                                <span className="text-[8px] uppercase font-bold text-muted-foreground/60 mt-0.5 tracking-tighter">Login Exclusivo</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold"><Mail className="h-3.5 w-3.5 text-primary/40" /> {p.email || '---'}</div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold"><Phone className="h-3.5 w-3.5 text-primary/40" /> {p.telefone || '---'}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={cn(
                                                "rounded-lg px-2 py-0.5 text-[9px] font-black uppercase border-none",
                                                p.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted-foreground/10 text-muted-foreground'
                                            )}>
                                                {p.status || 'ativo'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" onClick={() => handleOpenDialog(p)} className="h-10 w-10 rounded-2xl hover:bg-primary/10 hover:text-primary"><Pencil className="h-4 w-4" /></Button>
                                                <Button size="icon" variant="ghost" onClick={() => deletePerfil(p.id)} className="h-10 w-10 rounded-2xl hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="rounded-3xl sm:max-w-[550px] border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                            {editingPerfil ? '✏️ Editar Responsável' : '✨ Novo Responsável'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-5 py-6">
                        <div className="col-span-2 space-y-2">
                            <label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Nome Completo</label>
                            <Input
                                placeholder="Ex: João Silva"
                                value={formData.nome}
                                onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                                className="rounded-2xl h-12 font-bold focus:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-muted-foreground ml-1">E-mail</label>
                            <Input
                                type="email"
                                placeholder="email@exemplo.com"
                                value={formData.email}
                                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="rounded-2xl h-12 font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Telefone</label>
                            <Input
                                placeholder="(00) 00000-0000"
                                value={formData.telefone}
                                onChange={e => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                                className="rounded-2xl h-12 font-bold"
                            />
                        </div>

                        <div className="col-span-2 bg-muted/30 p-5 rounded-[2rem] border border-muted-foreground/10 space-y-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Key className="h-4 w-4 text-primary" />
                                <span className="text-[11px] font-black uppercase text-foreground tracking-wider">Credenciais de Acesso</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Usuário (Login)</label>
                                    <Input
                                        placeholder="joao.silva"
                                        value={formData.username}
                                        onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                        className="rounded-2xl h-12 font-mono font-black text-primary bg-background"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Senha</label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                        className="rounded-2xl h-12 font-bold bg-background"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-2xl h-12 font-bold px-8">Cancelar</Button>
                        <Button onClick={handleSubmit} className="rounded-2xl h-12 font-black px-12 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 gap-2">
                            <Check className="h-5 w-5" /> {editingPerfil ? 'Salvar Alterações' : 'Criar Conta'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Responsaveis;
