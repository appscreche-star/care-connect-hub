import { useState } from 'react';
import { fotosGaleria } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const Galeria = () => {
  const diaDia = fotosGaleria.filter(f => !f.primeiraVez);
  const conquistas = fotosGaleria.filter(f => f.primeiraVez);

  const PhotoGrid = ({ fotos }: { fotos: typeof fotosGaleria }) => (
    <div className="grid grid-cols-2 gap-3">
      {fotos.map(f => (
        <Card key={f.id} className="rounded-2xl overflow-hidden">
          <div className="aspect-square bg-muted flex items-center justify-center">
            <img src={f.url} alt={f.legenda} className="h-12 w-12 opacity-30" />
          </div>
          <div className="p-3">
            <p className="text-xs text-foreground font-medium line-clamp-2">{f.legenda}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-muted-foreground">{f.data}</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg"><Download className="h-3 w-3" /></Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div>
      <h1 className="text-lg font-bold text-foreground mb-4">Galeria</h1>
      <Tabs defaultValue="dia" className="w-full">
        <TabsList className="w-full rounded-xl mb-4">
          <TabsTrigger value="dia" className="flex-1 rounded-lg">Dia a dia</TabsTrigger>
          <TabsTrigger value="conquistas" className="flex-1 rounded-lg">Primeiras Vezes</TabsTrigger>
        </TabsList>
        <TabsContent value="dia"><PhotoGrid fotos={diaDia} /></TabsContent>
        <TabsContent value="conquistas"><PhotoGrid fotos={conquistas} /></TabsContent>
      </Tabs>
    </div>
  );
};

export default Galeria;
