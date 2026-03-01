import { useState } from 'react';
import { useData, type Turma } from '@/contexts/DataProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Loader2, GraduationCap, Users, UserCog, Eye, BookOpen, AlertCircle, ShieldAlert, Calendar, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Turmas = () => {
  const navigate = useNavigate();
  const { turmas, perfis, alunos, loading, addTurma, updateTurma, deleteTurma } = useData();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Turma>>({
    nome_turma: '',
    periodo: 'Manhã',
    professor_id: 'none',
    ano_letivo: new Date().getFullYear().toString(),
    capacidade_maxima: 20,
    faixa_etaria_min: 0,
    faixa_etaria_max: 2
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!formData.nome_turma) return;
    const finalData = { ...formData, professor_id: formData.professor_id === 'none' ? null : formData.professor_id };

    if (editingId) {
      await updateTurma(editingId, finalData);
    } else {
      await addTurma(finalData as any);
    }
    setOpen(false);
    setFormData({ nome_turma: '', periodo: 'Manhã', professor_id: 'none', ano_letivo: '2026', capacidade_maxima: 20, faixa_etaria_min: 0, faixa_etaria_max: 2 });
    setEditingId(null);
  };

  const handleEdit = (turma: Turma) => {
    setEditingId(turma.id);
    setFormData({
      nome_turma: turma.nome_turma,
      periodo: turma.periodo,
      professor_id: turma.professor_id || 'none',
      ano_letivo: turma.ano_letivo || '2026',
      capacidade_maxima: turma.capacidade_maxima || 20,
      faixa_etaria_min: turma.faixa_etaria_min || 0,
      faixa_etaria_max: turma.faixa_etaria_max || 2
    });
    setOpen(true);
  };

  if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Turmas e Salas</h1>
          <p className="text-sm text-muted-foreground">Controle de ocupação, regentes e faixas etárias.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2 h-11 px-6 shadow-lg shadow-primary/20"><Plus className="h-4 w-4" /> Nova Turma</Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl sm:max-w-xl border-none shadow-2xl p-0 overflow-hidden">
            <DialogHeader className="p-6 bg-muted/20">
              <DialogTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> {editingId ? 'Configurar Turma' : 'Criar Nova Turma'}</DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Identificação da Sala/Turma</Label>
                  <Input value={formData.nome_turma} onChange={e => setFormData(p => ({ ...p, nome_turma: e.target.value }))} placeholder="Ex: Berçário I - A" className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Ano Letivo</Label>
                  <Input value={formData.ano_letivo} onChange={e => setFormData(p => ({ ...p, ano_letivo: e.target.value }))} placeholder="2026" className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Período</Label>
                  <Select value={formData.periodo} onValueChange={(val: any) => setFormData(p => ({ ...p, periodo: val }))}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manhã">Manhã</SelectItem>
                      <SelectItem value="Tarde">Tarde</SelectItem>
                      <SelectItem value="Integral">Integral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Capacidade Máxima</Label>
                  <Input type="number" value={formData.capacidade_maxima} onChange={e => setFormData(p => ({ ...p, capacidade_maxima: parseInt(e.target.value) }))} className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Faixa Etária (Min - Max)</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" placeholder="Anos" value={formData.faixa_etaria_min} onChange={e => setFormData(p => ({ ...p, faixa_etaria_min: parseInt(e.target.value) }))} className="rounded-xl h-11" />
                    <span className="text-muted-foreground">-</span>
                    <Input type="number" placeholder="Anos" value={formData.faixa_etaria_max} onChange={e => setFormData(p => ({ ...p, faixa_etaria_max: parseInt(e.target.value) }))} className="rounded-xl h-11" />
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Professor Regente</Label>
                  <Select value={formData.professor_id} onValueChange={(val) => setFormData(p => ({ ...p, professor_id: val }))}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Selecione...</SelectItem>
                      {perfis.filter(p => p.role === 'Professor').map(e => <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full rounded-xl h-12 text-base font-semibold shadow-xl shadow-primary/20" onClick={handleSave}>Confirmar Configuração</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30 border-none">
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-4 font-bold pl-6">Turma / Sala</TableHead>
                <TableHead className="py-4 font-bold">Responsável (Regente)</TableHead>
                <TableHead className="py-4 font-bold">Ocupação / Vagas</TableHead>
                <TableHead className="py-4 font-bold text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {turmas.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">Nenhuma turma configurada no momento.</TableCell></TableRow>
              ) : (
                turmas.map(t => {
                  const numAlunos = alunos.filter(a => a.turma_id === t.id).length;
                  const occupancy = (numAlunos / (t.capacidade_maxima || 20)) * 100;
                  const professor = perfis.find(p => p.id === t.professor_id);

                  return (
                    <TableRow key={t.id} className="hover:bg-muted/20 transition-all border-b border-muted/20">
                      <TableCell className="pl-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center font-bold relative border border-primary/10">
                            <BookOpen className="h-5 w-5" />
                            <Badge className="absolute -top-2 -right-2 px-1 text-[8px] h-4 min-w-4 rounded-full bg-primary text-white flex items-center justify-center border-2 border-background">
                              {t.ano_letivo || '26'}
                            </Badge>
                          </div>
                          <div>
                            <p className="font-bold text-primary">{t.nome_turma}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="secondary" className="text-[9px] font-bold rounded-md bg-muted/60">{t.periodo.toUpperCase()}</Badge>
                              <span className="text-[10px] text-muted-foreground">• {t.faixa_etaria_min}-{t.faixa_etaria_max} anos</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {professor ? (
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground">{professor.nome[0]}</div>
                            <span className="text-sm font-semibold">{professor.nome}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-destructive font-bold text-[10px] px-2 py-1 bg-destructive/10 rounded-lg border border-destructive/20 w-fit">
                            <ShieldAlert className="h-3 w-3" /> SEM REGENTE
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1.5 max-w-[150px]">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-muted-foreground uppercase tracking-wider">{numAlunos} / {t.capacidade_maxima || 20} ALUNOS</span>
                            {occupancy >= 100 && <span className="text-destructive flex items-center gap-0.5"><AlertCircle className="h-2 w-2" /> LOTADA</span>}
                          </div>
                          <Progress value={occupancy} className={cn("h-2 rounded-full", occupancy >= 100 ? "bg-red-100 [&>div]:bg-red-500" : "bg-muted [&>div]:bg-primary")} />
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-primary hover:bg-primary/10 rounded-2xl transition-all"
                            onClick={() => navigate(`/admin/turmas/${t.id}`)}
                            title="Ver Alunos"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-muted/60 transition-all active:scale-95" onClick={() => handleEdit(t)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-destructive/10 hover:text-destructive transition-all active:scale-95" onClick={() => deleteTurma(t.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Turmas;
