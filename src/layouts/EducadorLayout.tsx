import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import OnlineStatus from '@/components/OnlineStatus';
import { LogOut } from 'lucide-react';

const EducadorLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 border-b flex items-center justify-between px-4 sticky top-0 bg-background z-50">
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/educador/home')}
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <span className="text-xs font-bold font-mono">CC</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground text-xs leading-none">{user?.nome}</span>
            <span className="text-[10px] text-muted-foreground leading-none mt-1">Portal do Educador</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <OnlineStatus />
          <button onClick={() => { logout(); navigate('/login'); }} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-accent">
            <LogOut className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </header>
      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default EducadorLayout;
