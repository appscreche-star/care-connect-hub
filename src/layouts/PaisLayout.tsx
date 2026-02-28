import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NotificationSheet from '@/components/NotificationSheet';
import OnlineStatus from '@/components/OnlineStatus';
import { CalendarDays, Camera, Package, Clock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const tabs = [
  { label: 'Hoje', path: '/pais/hoje', icon: Clock },
  { label: 'Galeria', path: '/pais/galeria', icon: Camera },
  { label: 'Mochila', path: '/pais/mochila', icon: Package },
  { label: 'Calendário', path: '/pais/calendario', icon: CalendarDays },
];

const PaisLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleEstouChegando = () => {
    toast({ title: '✅ Aviso enviado!', description: 'A creche foi notificada que você está a caminho.' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
              J
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Joãozinho</p>
              <p className="text-xs text-muted-foreground">😊 Feliz</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <OnlineStatus />
            <NotificationSheet />
            <button onClick={() => { logout(); navigate('/login'); }} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-accent">
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="px-4 pb-3">
          <Button className="w-full rounded-xl h-11 bg-amber-500 hover:bg-amber-600 text-white font-semibold" onClick={handleEstouChegando}>
            🚗 Estou Chegando!
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 pb-20 max-w-lg mx-auto w-full overflow-auto">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t h-16 flex items-center justify-around z-10">
        {tabs.map(t => {
          const active = location.pathname === t.path;
          return (
            <button
              key={t.path}
              onClick={() => navigate(t.path)}
              className={`flex flex-col items-center gap-1 min-w-[60px] min-h-[44px] justify-center transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <t.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default PaisLayout;
