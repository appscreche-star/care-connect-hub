import { useState } from 'react';
import { useData } from '@/contexts/DataProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Loader2, Trash2, User, Mail, Phone, Calendar } from 'lucide-react';

const Educadores = () => {
  const { turmas, perfis, loading, addPerfil, updatePerfil, deletePerfil } = useData();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    rg: '',
    endereco: '',
    data_nascimento: '',
    foto_url: '',
    role: 'educador' as const,
    observacoes: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!formData.nome.trim()) return;

    if (editingId) {
      await updatePerfil(editingId, formData);
    } else {
      await addPerfil({ ...formData, instituicao_id: '1' });
    }

    setFormData({
      nome: '', email: '', telefone: '', cpf: '', rg: '',
      endereco: '', data_nascimento: '', foto_url: '',
      role: 'educador', observacoes: ''
    });
    setEditingId(null);
    setOpen(false);
  };

  const handleEdit = (perfil: any) => {
    setEditingId(perfil.id);
    setFormData({
      nome: perfil.nome,
      email: perfil.email || '',
      telefone: perfil.telefone || '',
      cpf: perfil.cpf || '',
      rg: perfil.rg || '',
      endereco: perfil.endereco || '',
      data_nascimento: perfil.data_nascimento || '',
      foto_url: perfil.foto_url || '',
      role: perfil.role,
      observacoes: perfil.observacoes || ''
    });
    setOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const educadores = perfis.filter(p => p.role === 'educador');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Equipe Escolar</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2"><Plus className="h-4 w-4" /> Novo Membro</Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl sm:max-w-xl overflow-y-auto max-h-[90vh]">
            <DialogHeader><DialogTitle>{editingId ? 'Editar Perfil' : 'Cadastrar na Equipe'}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Nome Completo</Label>
                  <Input value={formData.nome} onChange={e => setFormData(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: Maria Oliveira" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>E-mail (Login)</Label>
                  <Input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="maria@exemplo.com" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={formData.telefone} onChange={e => setFormData(p => ({ ...p, telefone: e.target.value }))} placeholder="(00) 00000-0000" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>RG</Label>
                  <Input value={formData.rg} onChange={e => setFormData(p => ({ ...p, rg: e.target.value }))} placeholder="00.000.000-0" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Data de Nascimento</Label>
                  <Input type="date" value={formData.data_nascimento} onChange={e => setFormData(p => ({ ...p, data_nascimento: e.target.value }))} className="rounded-xl" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Endereço Completo</Label>
                  <Input value={formData.endereco} onChange={e => setFormData(p => ({ ...p, endereco: e.target.value }))} placeholder="Rua, Número, Bairro, Cidade" className="rounded-xl" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Foto do Perfil (URL)</Label>
                  <Input value={formData.foto_url} onChange={e => setFormData(p => ({ ...p, foto_url: e.target.value }))} placeholder="https://..." className="rounded-xl" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observações / Bio</Label>
                <Textarea value={formData.observacoes} onChange={e => setFormData(p => ({ ...p, observacoes: e.target.value }))} placeholder="Experiência, especialidades..." className="rounded-xl min-h-[100px]" />
              </div>

              <Button className="w-full rounded-xl h-12 text-base font-semibold mt-4" onClick={handleSave}>
                {editingId ? 'Salvar Alterações' : 'Cadastrar Membro'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-2xl overflow-hidden border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Membro</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Turma(s)</TableHead>
                <TableHead className="w-24 text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {educadores.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">Nenhum membro da equipe cadastrado.</TableCell></TableRow>
              ) : (
                educadores.map(e => (
                  <TableRow key={e.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                          {e.nome[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground line-clamp-1">{e.nome}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">CPF: {e.cpf || 'Não inf.'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" /> {e.email || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" /> {e.telefone || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {turmas.filter(t => t.educador_id === e.id).map(t => (
                          <span key={t.id} className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground uppercase">
                            {t.nome_turma}
                          </span>
                        ))}
                        {turmas.filter(t => t.educador_id === e.id).length === 0 && (
                          <span className="text-xs text-muted-foreground italic">Nenhuma</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary" onClick={() => handleEdit(e)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive" onClick={() => deletePerfil(e.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <p className="text-[10px] text-muted-foreground px-2 uppercase font-bold tracking-tighter">* A vinculação de turmas deve ser feita na página de Gestão de Turmas.</p>
    </div>
  );
};

export default Educadores;
