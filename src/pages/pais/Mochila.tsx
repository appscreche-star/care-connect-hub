import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Package, Pill } from 'lucide-react';

const solicitacoes = [
  { id: '1', item: 'Fralda G', status: 'pendente' },
  { id: '2', item: 'Pomada para assaduras', status: 'pendente' },
];

const Mochila = () => {
  const [nome, setNome] = useState('');
  const [horario, setHorario] = useState('');
  const [dosagem, setDosagem] = useState('');

  const enviarMedicamento = () => {
    if (!nome || !horario || !dosagem) return;
    toast({ title: '✅ Medicamento enviado com sucesso!' });
    setNome(''); setHorario(''); setDosagem('');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-foreground">Saúde & Mochila</h1>

      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4" /> Solicitações de Reposição</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {solicitacoes.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border">
                <span className="text-sm text-foreground">{s.item}</span>
                <Badge variant="secondary" className="rounded-lg text-xs">Pendente</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Pill className="h-4 w-4" /> Enviar Medicamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Nome do remédio</Label>
            <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Paracetamol" className="rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Horário</Label>
              <Input value={horario} onChange={e => setHorario(e.target.value)} type="time" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Dosagem</Label>
              <Input value={dosagem} onChange={e => setDosagem(e.target.value)} placeholder="Ex: 5 gotas" className="rounded-xl" />
            </div>
          </div>
          <Button className="w-full rounded-xl h-12" onClick={enviarMedicamento}>Enviar Medicamento</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Mochila;
