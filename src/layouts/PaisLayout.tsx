import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataProvider';
import NotificationSheet from '@/components/NotificationSheet';
import OnlineStatus from '@/components/OnlineStatus';
import { CalendarDays, Camera, Package, Clock, LogOut, MapPin } from 'lucide-react';
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
  const { alunos, selectedAlunoId, setSelectedAlunoId, registros } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedAluno = alunos.find(a => a.id === selectedAlunoId);
  const humorAtual = registros.find(r => r.aluno_id === selectedAlunoId && r.tipo_registro === 'bemestar')?.detalhes;

  const handleEstouChegando = () => {
    if (!selectedAlunoId) return;
    toast({
      title: '✅ Aviso enviado!',
      description: `A creche foi notificada que você está a caminho para buscar ${selectedAluno?.nome.split(' ')[0] || 'o aluno'}.`
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-primary/10 overflow-hidden flex items-center justify-center text-lg font-black text-primary border-2 border-primary/20 shadow-inner">
              {selectedAluno?.foto_url ? (
                <img src={selectedAluno.foto_url} alt={selectedAluno.nome} className="h-full w-full object-cover" />
              ) : (
                selectedAluno?.nome?.[0] || '?'
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                {alunos.length > 1 ? (
                  <select
                    className="text-base font-black bg-transparent border-none p-0 focus:ring-0 cursor-pointer text-foreground appearance-none pr-4 leading-none"
                    value={selectedAlunoId || ''}
                    onChange={(e) => setSelectedAlunoId(e.target.value)}
                  >
                    {alunos.map(a => (
                      <option key={a.id} value={a.id}>{a.nome.split(' ')[0]}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-base font-black text-foreground leading-none">
                    {selectedAluno?.nome.split(' ')[0] || 'Aluno'}
                  </p>
                )}
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-0.5">
                {humorAtual ? `${humorAtual.emoji || '😊'} ${humorAtual.humor || 'Bem'}` : '✨ Sem atualizações'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <OnlineStatus />
            <NotificationSheet />
            <button onClick={() => { logout(); navigate('/login'); }} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl hover:bg-accent transition-colors">
              <LogOut className="h-5 w-5 text-muted-foreground/60" />
            </button>
          </div>
        </div>
        <div className="px-4 pb-4">
          <Button
            className="w-full rounded-2xl h-12 bg-amber-500 hover:bg-amber-600 text-white font-black shadow-lg shadow-amber-500/20 transition-all active:scale-95 gap-2"
            onClick={handleEstouChegando}
          >
            <MapPin className="h-4 w-4" /> Estou Chegando!
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
