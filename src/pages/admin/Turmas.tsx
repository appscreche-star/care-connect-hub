import { useState } from 'react';
import { useData, type Turma } from '@/contexts/DataProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Loader2, Clock, User } from 'lucide-react';

const Turmas = () => {
  const { turmas, alunos, perfis, loading, addTurma, deleteTurma, updateTurma } = useData();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Turma>>({
    nome_turma: '',
    periodo: 'integral',
    horario_entrada: '08:00',
    horario_saida: '17:00',
    educador_id: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!formData.nome_turma?.trim()) return;
    if (editingId) {
      await updateTurma(editingId, formData);
    } else {
      await addTurma(formData);
    }
    setFormData({ nome_turma: '', periodo: 'integral', horario_entrada: '08:00', horario_saida: '17:00', educador_id: '' });
    setEditingId(null);
    setOpen(false);
  };

  const handleEdit = (turma: Turma) => {
    setEditingId(turma.id);
    setFormData({
      nome_turma: turma.nome_turma,
      periodo: turma.periodo,
      horario_entrada: turma.horario_entrada,
      horario_saida: turma.horario_saida,
      educador_id: turma.educador_id || ''
    });
    setOpen(true);
  };

  const getEducadorName = (id?: string) => {
    if (!id) return 'Não atribuído';
    return perfis.find(p => p.id === id)?.nome || 'Não encontrado';
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
        <h1 className="text-2xl font-bold text-foreground">Gestão de Turmas</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2"><Plus className="h-4 w-4" /> Nova Turma</Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl sm:max-w-md">
            <DialogHeader><DialogTitle>{editingId ? 'Editar Turma' : 'Criar Nova Turma'}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nome da Turma</Label>
                <Input value={formData.nome_turma} onChange={e => setFormData(p => ({ ...p, nome_turma: e.target.value }))} placeholder="Ex: Berçário II" className="rounded-xl" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Período</Label>
                  <Select value={formData.periodo} onValueChange={val => setFormData(p => ({ ...p, periodo: val as any }))}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="manha">Manhã</SelectItem><SelectItem value="tarde">Tarde</SelectItem><SelectItem value="integral">Integral</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Educador Responsável</Label>
                  <Select value={formData.educador_id || "none"} onValueChange={val => setFormData(p => ({ ...p, educador_id: val === "none" ? "" : val }))}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Selecione...</SelectItem>
                      {perfis.filter(p => p.role === 'educador').map(e => <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Entrada</Label>
                  <Input type="time" value={formData.horario_entrada} onChange={e => setFormData(p => ({ ...p, horario_entrada: e.target.value }))} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Saída</Label>
                  <Input type="time" value={formData.horario_saida} onChange={e => setFormData(p => ({ ...p, horario_saida: e.target.value }))} className="rounded-xl" />
                </div>
              </div>

              <Button className="w-full rounded-xl h-12 text-base font-semibold mt-4" onClick={handleSave}>
                {editingId ? 'Salvar Alterações' : 'Criar Turma'}
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
                <TableHead>Turma / Período</TableHead>
                <TableHead>Educador</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Alunos</TableHead>
                <TableHead className="w-24 text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {turmas.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">Clique em "Nova Turma" para começar.</TableCell></TableRow>
              ) : (
                turmas.map(t => (
                  <TableRow key={t.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="font-semibold text-foreground">{t.nome_turma}</div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{t.periodo || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3 w-3 text-muted-foreground" />
                        {getEducadorName(t.educador_id)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {t.horario_entrada?.slice(0, 5)} - {t.horario_saida?.slice(0, 5)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 w-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {alunos.filter(a => a.turma_id === t.id).length}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary" onClick={() => handleEdit(t)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive" onClick={() => deleteTurma(t.id)}>
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

export default Turmas;
