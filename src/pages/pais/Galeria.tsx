import { useState, useEffect } from 'react';
import { fotosGaleria } from '@/data/mockData';
import { useData } from '@/contexts/DataProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trophy, Star, Camera, Sparkles } from 'lucide-react';
import { CelebrationOverlay } from '@/components/CelebrationOverlay';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  'Atividade Motora': 'bg-emerald-100 text-emerald-700',
  'Hora da História': 'bg-blue-100 text-blue-700',
  'Recreio / Parquinho': 'bg-orange-100 text-orange-700',
  'Artes / Pintura': 'bg-purple-100 text-purple-700',
  'Música e Dança': 'bg-pink-100 text-pink-700',
  'Descoberta Sensorial': 'bg-cyan-100 text-cyan-700',
  'Outros': 'bg-slate-100 text-slate-700',
};

const CATEGORY_EMOJIS: Record<string, string> = {
  'Atividade Motora': '🏃',
  'Hora da História': '📖',
  'Recreio / Parquinho': '🛝',
  'Artes / Pintura': '🎨',
  'Música e Dança': '🎵',
  'Descoberta Sensorial': '🔬',
  'Outros': '⭐',
};

const Galeria = () => {
  const { registros } = useData();
  const [celebration, setCelebration] = useState<{ open: boolean; titulo?: string; legenda?: string }>({ open: false });

  // Get album registros from DataProvider (real data)
  const albumRegistros = registros.filter(r => r.tipo_registro === 'album');
  const albumConquistas = albumRegistros.filter(r => r.detalhes?.conquista);
  const albumDiaDia = albumRegistros.filter(r => !r.detalhes?.conquista);

  // Fallback to mock data when no real registros exist
  const diaDiaMock = fotosGaleria.filter(f => !f.primeiraVez);
  const conquistasMock = fotosGaleria.filter(f => f.primeiraVez);

  // Trigger celebration automatically on first conquista load (simulating parent app)
  useEffect(() => {
    if (albumConquistas.length > 0) {
      const latest = albumConquistas[0];
      // Show celebration for items in the last 2 minutes (fresh)
      const isFresh = latest.created_at &&
        Date.now() - new Date(latest.created_at).getTime() < 2 * 60 * 1000;
      if (isFresh) {
        setTimeout(() => {
          setCelebration({
            open: true,
            titulo: latest.detalhes?.legenda || 'Primeira vez! 🎉',
            legenda: `${latest.detalhes?.categoria || 'Atividade'} • Momento especial registrado!`,
          });
        }, 800);
      }
    }
  }, [albumConquistas.length]);

  const AlbumCard = ({ foto, isConquista }: { foto: typeof fotosGaleria[0]; isConquista?: boolean }) => (
    <Card className={cn("rounded-2xl overflow-hidden border-none shadow-md hover:shadow-xl transition-all group", isConquista && "ring-2 ring-amber-400")}>
      <div className="aspect-square bg-gradient-to-br from-primary/10 to-pink-400/10 flex items-center justify-center relative overflow-hidden">
        {isConquista && (
          <div className="absolute top-2 right-2 bg-amber-400 text-white text-[10px] font-black rounded-full px-2 py-0.5 flex items-center gap-1 z-10">
            🏆 1ª Vez
          </div>
        )}
        <img
          src={foto.url}
          alt={foto.legenda}
          className="h-full w-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <Camera className="h-10 w-10 text-muted-foreground opacity-20 absolute" />
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-xs text-foreground font-semibold line-clamp-2">{foto.legenda}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">{foto.data}</span>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );

  const RegistroCard = ({ registro }: { registro: typeof albumRegistros[0] }) => {
    const cat = registro.detalhes?.categoria || 'Outros';
    const emoji = CATEGORY_EMOJIS[cat] || '⭐';
    const color = CATEGORY_COLORS[cat] || CATEGORY_COLORS['Outros'];
    const isConquista = !!registro.detalhes?.conquista;

    return (
      <Card
        className={cn(
          "rounded-2xl overflow-hidden border-none shadow-md hover:shadow-xl transition-all group cursor-pointer",
          isConquista && "ring-2 ring-amber-400"
        )}
        onClick={() => {
          if (isConquista) {
            setCelebration({
              open: true,
              titulo: registro.detalhes?.legenda || 'Primeira vez! 🎉',
              legenda: `${cat} • Toque para celebrar!`,
            });
          }
        }}
      >
        <div className="aspect-square bg-gradient-to-br from-primary/10 to-pink-400/10 flex items-center justify-center relative overflow-hidden">
          {isConquista && (
            <div className="absolute top-2 right-2 bg-amber-400 text-white text-[10px] font-black rounded-full px-2 py-0.5 flex items-center gap-1 z-10">
              🏆 1ª Vez
            </div>
          )}
          {registro.detalhes?.foto_base64 ? (
            <img
              src={registro.detalhes.foto_base64}
              alt={registro.detalhes?.legenda || 'Foto'}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
              <span className="text-5xl">{emoji}</span>
              <Camera className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="p-3 space-y-2">
          <div className={cn("inline-flex items-center gap-1 text-[10px] font-black rounded-full px-2 py-0.5", color)}>
            {emoji} {cat}
          </div>
          {registro.detalhes?.legenda && (
            <p className="text-xs text-foreground font-medium line-clamp-2">{registro.detalhes.legenda}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {registro.data_registro || new Date().toLocaleDateString('pt-BR')}
            </span>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const hasRealData = albumRegistros.length > 0;

  return (
    <>
      {/* Celebration Overlay for "Primeira Vez" */}
      <CelebrationOverlay
        open={celebration.open}
        titulo={celebration.titulo}
        legenda={celebration.legenda}
        onClose={() => setCelebration({ open: false })}
      />

      <div className="space-y-5 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">📸 Álbum</h1>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {hasRealData ? `${albumRegistros.length} publicações` : 'Memórias especiais'}
            </p>
          </div>
          {albumConquistas.length + conquistasMock.length > 0 && (
            <div
              className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-600 text-[11px] font-black rounded-full px-3 py-1.5 cursor-pointer hover:bg-amber-100 transition-colors"
              onClick={() => setCelebration({ open: true, titulo: 'Suas conquistas! 🏆', legenda: 'Todos os momentos especiais estão aqui.' })}
            >
              <Trophy className="h-4 w-4" />
              {albumConquistas.length + conquistasMock.length} conquistas
            </div>
          )}
        </div>

        <Tabs defaultValue="dia" className="w-full">
          <TabsList className="w-full rounded-2xl mb-4 h-12 p-1">
            <TabsTrigger value="dia" className="flex-1 rounded-xl font-bold text-xs">
              📷 Dia a dia
            </TabsTrigger>
            <TabsTrigger value="conquistas" className="flex-1 rounded-xl font-bold text-xs">
              🏆 Primeiras Vezes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dia">
            <div className="grid grid-cols-2 gap-3">
              {hasRealData
                ? albumDiaDia.map(r => <RegistroCard key={r.id} registro={r} />)
                : diaDiaMock.map(f => <AlbumCard key={f.id} foto={f} />)
              }
              {!hasRealData && diaDiaMock.length === 0 && (
                <div className="col-span-2 py-16 text-center text-muted-foreground">
                  <Camera className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm font-medium">Nenhuma foto ainda</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="conquistas">
            <div className="grid grid-cols-2 gap-3">
              {hasRealData
                ? albumConquistas.map(r => <RegistroCard key={r.id} registro={r} />)
                : conquistasMock.map(f => <AlbumCard key={f.id} foto={f} isConquista />)
              }
              {!hasRealData && conquistasMock.length === 0 && (
                <div className="col-span-2 py-16 text-center text-muted-foreground">
                  <Trophy className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm font-medium">Nenhuma conquista ainda</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Galeria;
