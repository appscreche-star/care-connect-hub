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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Loader2, Trash2, ShieldAlert, Heart, Users, ShieldCheck, UserPlus, Camera, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    saude_observacoes: '',
    responsaveis: [],
    autorizados: []
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!formData.nome?.trim()) return;

    // Validação de responsável financeiro se houver responsáveis
    if (formData.responsaveis && formData.responsaveis.length > 0) {
      const hasFinancial = formData.responsaveis.some(r => r.financeiro);
      if (!hasFinancial) {
        alert("É necessário definir pelo menos um responsável financeiro.");
        return;
      }
    }

    if (editingId) {
      await updateAluno(editingId, formData);
    } else {
      await addAluno(formData as any);
    }

    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setFormData({
      nome: '', data_nascimento: '', turma_id: null, alergias: '',
      restricoes_alimentares: '', medicamentos_uso_continuo: '',
      tipo_sanguineo: '', saude_observacoes: '',
      responsaveis: [], autorizados: []
    });
    setEditingId(null);
  };

  const handleEdit = (aluno: Aluno) => {
    setEditingId(aluno.id);
    setFormData({ ...aluno });
    setOpen(true);
  };

  if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Prontuário Digital do Aluno</h1>
        <Dialog open={open} onOpenChange={(val) => { if (!val) resetForm(); setOpen(val); }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2"><Plus className="h-4 w-4" /> Novo Aluno</Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl sm:max-w-2xl overflow-y-auto max-h-[90vh] p-0 border-none shadow-2xl">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-xl">{editingId ? 'Editar Prontuário' : 'Cadastrar Novo Aluno'}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="dados" className="w-full">
              <div className="px-6 pt-4 border-b">
                <TabsList className="bg-transparent gap-6 p-0 h-10">
                  <TabsTrigger value="dados" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 gap-2">
                    <Heart className="h-4 w-4" /> Dados e Saúde
                  </TabsTrigger>
                  <TabsTrigger value="familia" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 gap-2">
                    <Users className="h-4 w-4" /> Família
                  </TabsTrigger>
                  <TabsTrigger value="retirada" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 gap-2">
                    <ShieldCheck className="h-4 w-4" /> Retirada
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="dados" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label>Nome Completo (LGPD conforme Certidão)</Label>
                      <Input value={formData.nome} onChange={e => setFormData(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: João da Silva Santos" className="rounded-xl h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label>Data de Nascimento</Label>
                      <Input type="date" value={formData.data_nascimento} onChange={e => setFormData(p => ({ ...p, data_nascimento: e.target.value }))} className="rounded-xl h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo Sanguíneo</Label>
                      <Input value={formData.tipo_sanguineo} onChange={e => setFormData(p => ({ ...p, tipo_sanguineo: e.target.value }))} placeholder="Ex: AB-" className="rounded-xl h-11 uppercase" />
                    </div>
                  </div>
                  <div className="space-y-2 border-t pt-4">
                    <Label className="text-destructive font-bold flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> Alergias e Restrições</Label>
                    <Input value={formData.alergias} onChange={e => setFormData(p => ({ ...p, alergias: e.target.value }))} placeholder="Ex: Proteína do leite, Corantes..." className="rounded-xl border-destructive/20" />
                  </div>
                  <div className="space-y-2">
                    <Label>Observações Médicas Importantes</Label>
                    <Textarea value={formData.saude_observacoes} onChange={e => setFormData(p => ({ ...p, saude_observacoes: e.target.value }))} placeholder="Histórico clínico breve..." className="rounded-xl min-h-[80px]" />
                  </div>
                </TabsContent>

                <TabsContent value="familia" className="space-y-4 mt-0">
                  <div className="bg-muted/30 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserPlus className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-bold">Responsáveis Legais</p>
                        <p className="text-[10px] text-muted-foreground">Adicione pais ou tutores legais</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg h-8"
                      onClick={() => setFormData(p => ({
                        ...p,
                        responsaveis: [...(p.responsaveis || []), { nome: '', parentesco: '', financeiro: false }]
                      }))}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Adicionar
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                    {formData.responsaveis?.map((resp, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-end bg-muted/20 p-3 rounded-xl relative group">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={() => setFormData(p => ({
                            ...p,
                            responsaveis: p.responsaveis?.filter((_, i) => i !== idx)
                          }))}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <div className="col-span-12 md:col-span-5 space-y-1">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Nome do Responsável</Label>
                          <Input
                            value={resp.nome}
                            onChange={e => {
                              const newResps = [...(formData.responsaveis || [])];
                              newResps[idx] = { ...newResps[idx], nome: e.target.value };
                              setFormData(p => ({ ...p, responsaveis: newResps }));
                            }}
                            placeholder="Nome completo"
                            className="rounded-lg h-9 text-sm"
                          />
                        </div>
                        <div className="col-span-6 md:col-span-3 space-y-1">
                          <Label className="text-[10px] uppercase font-bold text-muted-foreground">Vínculo</Label>
                          <Input
                            value={resp.parentesco}
                            onChange={e => {
                              const newResps = [...(formData.responsaveis || [])];
                              newResps[idx] = { ...newResps[idx], parentesco: e.target.value };
                              setFormData(p => ({ ...p, responsaveis: newResps }));
                            }}
                            placeholder="Mãe, Pai, Avó..."
                            className="rounded-lg h-9 text-sm"
                          />
                        </div>
                        <div className="col-span-6 md:col-span-4 flex items-center gap-2 h-9 border rounded-lg px-2 bg-background">
                          <input
                            type="checkbox"
                            className="rounded border-primary h-3.5 w-3.5"
                            id={`financeiro-${idx}`}
                            checked={resp.financeiro}
                            onChange={e => {
                              const newResps = (formData.responsaveis || []).map((r, i) => ({
                                ...r,
                                financeiro: i === idx ? e.target.checked : r.financeiro
                              }));
                              setFormData(p => ({ ...p, responsaveis: newResps }));
                            }}
                          />
                          <label htmlFor={`financeiro-${idx}`} className="text-xs font-semibold cursor-pointer select-none">Financeiro</label>
                        </div>
                      </div>
                    ))}
                    {(!formData.responsaveis || formData.responsaveis.length === 0) && (
                      <p className="text-center text-xs text-muted-foreground py-4 italic">Nenhum responsável adicionado.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="retirada" className="space-y-4 mt-0">
                  <div className="bg-destructive/5 p-4 rounded-2xl border border-destructive/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-destructive flex items-center gap-2 mb-1"><ShieldCheck className="h-4 w-4" /> Protocolo de Segurança</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed italic">Apenas pessoas autorizadas podem retirar o aluno.</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg h-8 border-destructive/20 hover:bg-destructive/10 text-destructive"
                      onClick={() => setFormData(p => ({
                        ...p,
                        autorizados: [...(p.autorizados || []), { nome: '', documento: '' }]
                      }))}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Autorizar
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                    {formData.autorizados?.map((aut, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-dashed border-muted-foreground/20 relative group">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setFormData(p => ({
                            ...p,
                            autorizados: p.autorizados?.filter((_, i) => i !== idx)
                          }))}
                        >
                          <Trash2 className="h-3 w-3 text-muted-foreground" />
                        </Button>
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                          <Camera className="h-5 w-5" />
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <Input
                            value={aut.nome}
                            onChange={e => {
                              const newAuts = [...(formData.autorizados || [])];
                              newAuts[idx] = { ...newAuts[idx], nome: e.target.value };
                              setFormData(p => ({ ...p, autorizados: newAuts }));
                            }}
                            placeholder="Nome autorizado"
                            className="rounded-lg h-8 text-sm bg-background/50"
                          />
                          <Input
                            value={aut.documento}
                            onChange={e => {
                              const newAuts = [...(formData.autorizados || [])];
                              newAuts[idx] = { ...newAuts[idx], documento: e.target.value };
                              setFormData(p => ({ ...p, autorizados: newAuts }));
                            }}
                            placeholder="RG / CPF"
                            className="rounded-lg h-8 text-sm bg-background/50"
                          />
                        </div>
                      </div>
                    ))}
                    {(!formData.autorizados || formData.autorizados.length === 0) && (
                      <p className="text-center text-xs text-muted-foreground py-4 italic">Nenhuma autorização extra cadastrada.</p>
                    )}
                  </div>
                </TabsContent>

                <Button className="w-full rounded-xl h-12 text-base font-semibold mt-8 shadow-lg shadow-primary/20" onClick={handleSave}>
                  {editingId ? 'Salvar Prontuário' : 'Efetivar Matrícula'}
                </Button>
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-3xl overflow-hidden border-none shadow-xl bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50 border-none">
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-4 font-bold text-foreground pl-6">Aluno</TableHead>
                <TableHead className="py-4 font-bold text-foreground">Turma</TableHead>
                <TableHead className="py-4 font-bold text-foreground">Status Médicos</TableHead>
                <TableHead className="py-4 font-bold text-foreground text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alunos.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">Nenhum aluno no sistema.</TableCell></TableRow>
              ) : (
                alunos.map(a => (
                  <TableRow key={a.id} className="hover:bg-muted/20 transition-all border-b border-muted/30">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shadow-inner">
                          {a.nome[0]}
                        </div>
                        <div>
                          <p className="font-bold text-foreground leading-none mb-1">{a.nome}</p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium bg-muted/50 w-fit px-1.5 py-0.5 rounded-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {a.data_nascimento || 'Matrícula Ativa'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={a.turma_id || "none"} onValueChange={(val) => vincularAlunoTurma(a.id, val === "none" ? null : val)}>
                        <SelectTrigger className="w-[160px] h-9 text-xs rounded-xl font-semibold border-none bg-muted/40 hover:bg-muted/60 transition-colors">
                          <SelectValue placeholder="Sem Turma" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl shadow-2xl border-none">
                          <SelectItem value="none">Sem Turma</SelectItem>
                          {turmas.map(t => <SelectItem key={t.id} value={t.id}>{t.nome_turma}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {a.alergias ? (
                        <div className="flex items-center gap-1.5 bg-destructive/10 text-destructive font-bold text-[10px] px-2.5 py-1 rounded-full border border-destructive/20 w-fit">
                          <ShieldAlert className="h-3 w-3" /> {a.alergias.toUpperCase()}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 font-bold text-[10px] px-2.5 py-1 rounded-full border border-emerald-500/20 w-fit">
                          <Heart className="h-3 w-3" /> SAUDÁVEL
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-90" asChild>
                          <Link to={`/admin/aluno/${a.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all active:scale-90" onClick={() => handleEdit(a)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-destructive/10 hover:text-destructive transition-all active:scale-90" onClick={() => deleteAluno(a.id)}>
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
