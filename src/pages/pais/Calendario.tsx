import { eventosCalendario } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Calendario = () => {
  const exportIcs = (evento: typeof eventosCalendario[0]) => {
    const ics = `BEGIN:VCALENDAR\nBEGIN:VEVENT\nSUMMARY:${evento.titulo}\nDTSTART:${evento.data.replace(/-/g, '')}T090000\nDESCRIPTION:${evento.descricao}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${evento.titulo}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: '✅ Evento exportado!' });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-foreground">Calendário</h1>
      {eventosCalendario.map(e => (
        <Card key={e.id} className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{e.titulo}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{e.data}</p>
                  <p className="text-xs text-muted-foreground mt-1">{e.descricao}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl gap-1 min-h-[44px]" onClick={() => exportIcs(e)}>
                <Download className="h-3 w-3" /> Salvar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Calendario;
