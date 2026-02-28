import { Bell } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataProvider';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NotificationSheet = () => {
  const { notificacoes } = useData();
  const unread = notificacoes.filter(n => !n.lida).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-xl hover:bg-accent transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
          <Bell className="h-5 w-5 text-foreground" />
          {unread > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full bg-destructive text-destructive-foreground">
              {unread}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Notificações</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          {notificacoes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhuma notificação.</p>
          ) : (
            notificacoes.map(n => (
              <div key={n.id} className={`p-3 rounded-xl border transition-colors ${n.lida ? 'bg-background' : 'bg-accent/50'}`}>
                <p className="text-sm text-foreground">{n.mensagem}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ptBR })}
                </p>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationSheet;
