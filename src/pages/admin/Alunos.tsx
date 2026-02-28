import { useState } from 'react';
import { useData, type Aluno } from '@/contexts/DataProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Loader2, Trash2, ShieldAlert } from 'lucide-react';

const Alunos = () => {
  const { alunos, turmas, loading, addAluno, updateAluno, deleteAluno, vincularAlunoTurma } = useData();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Aluno>>({
    nome: '',
    data_nascimento: '',
    turma_id: null,
    alergias: '',
    restricoes_alimentares: '',
    medicamentos_uso_continuo: '',
    tipo_sanguineo: '',
    saude_observacoes: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!formData.nome?.trim()) return;

    if (editingId) {
      await updateAluno(editingId, formData);
    } else {
      await addAluno(formData as any);
    }

    setFormData({
      nome: '', data_nascimento: '', turma_id: null, alergias: '',
      restricoes_alimentares: '', medicamentos_uso_continuo: '',
      tipo_sanguineo: '', saude_observacoes: ''
    });
    setEditingId(null);
    setOpen(false);
  };

  const handleEdit = (aluno: Aluno) => {
    setEditingId(aluno.id);
    setFormData({
      nome: aluno.nome,
      data_nascimento: aluno.data_nascimento,
      turma_id: aluno.turma_id,
      alergias: aluno.alergias || '',
      restricoes_alimentares: aluno.restricoes_alimentares || '',
      medicamentos_uso_continuo: aluno.medicamentos_uso_continuo || '',
      tipo_sanguineo: aluno.tipo_sanguineo || '',
      saude_observacoes: aluno.saude_observacoes || ''
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Gestão de Alunos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2"><Plus className="h-4 w-4" /> Novo Aluno</Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl sm:max-w-xl overflow-y-auto max-h-[90vh]">
            <DialogHeader><DialogTitle>{editingId ? 'Editar Perfil do Aluno' : 'Cadastrar Novo Aluno'}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Nome Completo</Label>
                  <Input value={formData.nome} onChange={e => setFormData(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: João Silva" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Data de Nascimento</Label>
                  <Input type="date" value={formData.data_nascimento} onChange={e => setFormData(p => ({ ...p, data_nascimento: e.target.value }))} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo Sanguíneo</Label>
                  <Input value={formData.tipo_sanguineo} onChange={e => setFormData(p => ({ ...p, tipo_sanguineo: e.target.value }))} placeholder="Ex: A+" className="rounded-xl font-mono uppercase" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Turma</Label>
                  <Select value={formData.turma_id || "none"} onValueChange={(val) => setFormData(p => ({ ...p, turma_id: val === "none" ? null : val }))}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Sem turma" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem turma</SelectItem>
                      {turmas.map(t => <SelectItem key={t.id} value={t.id}>{t.nome_turma}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t pt-4">
                <h3 className="text-sm font-bold flex items-center gap-2 text-destructive"><ShieldAlert className="h-4 w-4" /> Segurança e Saúde</h3>

                <div className="space-y-2">
                  <Label>Alergias</Label>
                  <Input value={formData.alergias} onChange={e => setFormData(p => ({ ...p, alergias: e.target.value }))} placeholder="Ex: Lactose, Amendoim..." className="rounded-xl border-destructive/20" />
                </div>

                <div className="space-y-2">
                  <Label>Restrições Alimentares</Label>
                  <Input value={formData.restricoes_alimentares} onChange={e => setFormData(p => ({ ...p, restricoes_alimentares: e.target.value }))} placeholder="Ex: Não consome açúcar..." className="rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label>Medicamentos de Uso Contínuo</Label>
                  <Input value={formData.medicamentos_uso_continuo} onChange={e => setFormData(p => ({ ...p, medicamentos_uso_continuo: e.target.value }))} placeholder="Nome e dosagem..." className="rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label>Outras Observações</Label>
                  <Textarea value={formData.saude_observacoes} onChange={e => setFormData(p => ({ ...p, saude_observacoes: e.target.value }))} placeholder="Alguma outra informação relevante..." className="rounded-xl min-h-[60px]" />
                </div>
              </div>

              <Button className="w-full rounded-xl h-12 text-base font-semibold mt-4" onClick={handleSave}>
                {editingId ? 'Salvar Alterações' : 'Cadastrar Aluno'}
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
                <TableHead>Aluno</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Alergias</TableHead>
                <TableHead className="w-24 text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alunos.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">Nenhum aluno cadastrado.</TableCell></TableRow>
              ) : (
                alunos.map(a => (
                  <TableRow key={a.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                          {a.nome[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground line-clamp-1">{a.nome}</p>
                          <p className="text-[10px] text-muted-foreground">{a.idade || 'Idade N/A'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={a.turma_id || "none"} onValueChange={(val) => vincularAlunoTurma(a.id, val === "none" ? null : val)}>
                        <SelectTrigger className="w-[140px] h-8 text-xs rounded-lg border-none bg-muted/50 focus:ring-0">
                          <SelectValue placeholder="Sem turma" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="none">Sem turma</SelectItem>
                          {turmas.map(t => <SelectItem key={t.id} value={t.id}>{t.nome_turma}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {a.alergias ? (
                        <div className="flex items-center gap-1 text-destructive font-medium text-xs">
                          <ShieldAlert className="h-3 w-3" /> {a.alergias}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Nenhuma</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary" onClick={() => handleEdit(a)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive" onClick={() => deleteAluno(a.id)}>
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
    </div>
  );
};

export default Alunos;
