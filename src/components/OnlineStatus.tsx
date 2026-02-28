import { Cloud, CloudOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const OnlineStatus = () => {
  const { isOnline, toggleOnline } = useAuth();
  return (
    <button
      onClick={toggleOnline}
      className="p-2 rounded-xl hover:bg-accent transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
      title={isOnline ? 'Online' : 'Offline — sincronizando dados locais'}
    >
      {isOnline ? <Cloud className="h-5 w-5 text-emerald-500" /> : <CloudOff className="h-5 w-5 text-destructive" />}
    </button>
  );
};

export default OnlineStatus;
