import { useState } from 'react';
import { useData, type Perfil } from '@/contexts/DataProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Loader2, Trash2, Search, Filter, GraduationCap, Clock, Phone, Info, Key } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Educadores = () => {
  const { perfis, loading, addPerfil, updatePerfil, deletePerfil } = useData();
  const [open, setOpen] = useState(false);
  const [viewProfile, setViewProfile] = useState<Perfil | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [shiftFilter, setShiftFilter] = useState('todos');

  const [formData, setFormData] = useState<Partial<Perfil>>({
    nome: '',
    email: '',
    role: 'Professor',
    cpf: '',
    formacao_academica: '',
    especialidades: [],
    turno: 'integral',
    status: 'ativo',
    contato_emergencia: '',
    username: '',
    password: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({ nome: '', email: '', role: 'Professor', cpf: '', formacao_academica: '', especialidades: [], turno: 'integral', status: 'ativo', contato_emergencia: '', username: '', password: '' });
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.email) return;
    if (editingId) {
      await updatePerfil(editingId, formData);
    } else {
      await addPerfil(formData as any);
    }
    setOpen(false);
    resetForm();
  };

  const handleEdit = (perfil: Perfil) => {
    setEditingId(perfil.id);
    setFormData({ ...perfil });
    setOpen(true);
  };

  const filteredEducadores = perfis.filter(p => {
    // Apenas Professor e Coordenador aparecem aqui
    if (p.role !== 'Professor' && p.role !== 'Coordenador') return false;

    const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(p.especialidades) && p.especialidades.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesShift = shiftFilter === 'todos' || p.turno === shiftFilter;

    return matchesSearch && matchesShift;
  });

  if (loading) return <div className="flex items-center justify-center p-12 text-primary font-bold"><Loader2 className="h-8 w-8 animate-spin mr-2" /> Carregando equipe...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Equipe Escolar</h1>
          <p className="text-sm text-muted-foreground">Gestão de professores, coordenadores e assistentes.</p>
        </div>
        <Dialog open={open} onOpenChange={(val) => { if (!val) resetForm(); setOpen(val); }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2 h-11 px-6 shadow-lg shadow-primary/20"><Plus className="h-4 w-4" /> Novo Colaborador</Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl sm:max-w-xl max-h-[90vh] overflow-y-auto border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" /> {editingId ? 'Editar Colaborador' : 'Adicionar à Equipe'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Nome Completo</Label>
                  <Input value={formData.nome} onChange={e => setFormData(p => ({ ...p, nome: e.target.value }))} className="rounded-xl h-11" placeholder="Ex: Maria Souza" />
                </div>
                <div className="space-y-2">
                  <Label>E-mail Corporativo</Label>
                  <Input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="rounded-xl h-11" placeholder="prof.maria@creche.com" />
                </div>
                <div className="space-y-2">
                  <Label>CPF</Label>
                  <Input value={formData.cpf} onChange={e => setFormData(p => ({ ...p, cpf: e.target.value }))} className="rounded-xl h-11 font-mono" placeholder="000.000.000-00" />
                </div>
                <div className="space-y-2">
                  <Label>Cargo / Função</Label>
                  <Select value={formData.role} onValueChange={(val: any) => setFormData(p => ({ ...p, role: val }))}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professor">Professor(a)</SelectItem>
                      <SelectItem value="Coordenador">Coordenador(a)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Turno</Label>
                  <Select value={formData.turno} onValueChange={(val: any) => setFormData(p => ({ ...p, turno: val }))}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manha">Manhã</SelectItem>
                      <SelectItem value="tarde">Tarde</SelectItem>
                      <SelectItem value="integral">Integral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted/30 p-5 rounded-2xl border border-muted-foreground/10 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Key className="h-4 w-4 text-primary" />
                  <span className="text-[11px] font-black uppercase text-foreground tracking-wider">Credenciais de Acesso</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Usuário (Login)</Label>
                    <Input
                      placeholder="usuario"
                      value={formData.username}
                      onChange={e => setFormData(p => ({ ...p, username: e.target.value }))}
                      className="rounded-xl h-11 font-mono font-black text-primary bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Senha</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                      className="rounded-xl h-11 font-bold bg-background"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t pt-2">
                <Label>Formação Acadêmica / Especialidades</Label>
                <Input value={Array.isArray(formData.especialidades) ? formData.especialidades.join(', ') : ''}
                  onChange={e => setFormData(p => ({ ...p, especialidades: e.target.value.split(',').map(s => s.trim()) }))}
                  className="rounded-xl h-11" placeholder="Ex: Pedagogia, Inclusão, Música..." />
              </div>
              <Button className="w-full rounded-xl h-12 text-base font-semibold mt-4" onClick={handleSave}>Finalizar Cadastro</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou especialidade..." className="rounded-xl pl-10 h-11" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-xl">
          <Filter className="h-4 w-4 ml-2 text-muted-foreground" />
          <Button variant={shiftFilter === 'todos' ? 'secondary' : 'ghost'} size="sm" className="rounded-lg h-9 px-4 h-9" onClick={() => setShiftFilter('todos')}>Todos</Button>
          <Button variant={shiftFilter === 'manha' ? 'secondary' : 'ghost'} size="sm" className="rounded-lg h-9 px-4 h-9" onClick={() => setShiftFilter('manha')}>Manhã</Button>
          <Button variant={shiftFilter === 'tarde' ? 'secondary' : 'ghost'} size="sm" className="rounded-lg h-9 px-4 h-9" onClick={() => setShiftFilter('tarde')}>Tarde</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEducadores.map(e => (
          <Card key={e.id} className="rounded-3xl border-none shadow-sm hover:shadow-xl transition-all group group relative border-t-4 border-t-primary/20">
            <CardContent className="pt-8 flex flex-col items-center text-center px-6">
              <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mb-4 shadow-inner relative group-hover:scale-110 transition-transform">
                {e.nome[0]}
                <div className={cn("absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background", e.status === 'ativo' ? 'bg-emerald-500' : 'bg-muted-foreground')}></div>
              </div>
              <Badge variant="outline" className="mb-2 text-[10px] uppercase font-bold tracking-wider rounded-lg py-0 border-primary/20 text-primary/70">{e.role}</Badge>
              <h3 className="text-lg font-bold text-foreground mb-1">{e.nome}</h3>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-1">{e.email}</p>

              <div className="flex items-center justify-center gap-4 w-full border-t border-muted/30 pt-4 mt-2">
                <div className="flex flex-col items-center">
                  <Clock className="h-3 w-3 text-muted-foreground mb-1" />
                  <span className="text-[10px] font-bold uppercase">{e.turno}</span>
                </div>
                <div className="w-[1px] h-6 bg-muted/30"></div>
                <div className="flex flex-col items-center">
                  <GraduationCap className="h-3 w-3 text-muted-foreground mb-1" />
                  <span className="text-[10px] font-bold uppercase">{Array.isArray(e.especialidades) ? e.especialidades[0] || 'Geral' : 'Geral'}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 w-full">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all border-none bg-muted/30" onClick={() => setViewProfile(e)}>
                  <Info className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all border-none bg-muted/30" onClick={() => handleEdit(e)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl hover:bg-destructive/10 hover:text-destructive transition-all border-none bg-muted/30" onClick={() => deletePerfil(e.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!viewProfile} onOpenChange={() => setViewProfile(null)}>
        <DialogContent className="rounded-3xl border-none shadow-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl"><Info className="h-5 w-5 text-primary" /> Detalhes do Profissional</DialogTitle>
          </DialogHeader>
          {viewProfile && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">{viewProfile.nome[0]}</div>
                <div>
                  <p className="font-bold text-lg text-primary">{viewProfile.nome}</p>
                  <p className="text-sm text-muted-foreground">{viewProfile.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm px-1">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Formação</p>
                  <p className="font-semibold">{viewProfile.formacao_academica || 'Não informada'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">CPF</p>
                  <p className="font-semibold">{viewProfile.cpf || 'Não informado'}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Especialidades</p>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(viewProfile.especialidades) && viewProfile.especialidades.length > 0 ? viewProfile.especialidades.map(s => <Badge key={s} variant="secondary" className="rounded-lg text-[9px] font-bold">{s}</Badge>) : <span className="italic text-muted-foreground">Geral</span>}
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-destructive/5 space-y-2">
                <p className="text-[10px] font-bold text-destructive uppercase flex items-center gap-1"><Phone className="h-3 w-3" /> Contato de Emergência</p>
                <p className="text-sm font-semibold">{viewProfile.contato_emergencia || 'Nenhum contato cadastrado'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Educadores;
