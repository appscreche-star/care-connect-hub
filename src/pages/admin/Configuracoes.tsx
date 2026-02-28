import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

const Configuracoes = () => {
  const { instituicao, setPrimaryColor } = useAuth();
  const [color, setColor] = useState('#4F46E5');

  const handleColorChange = (hex: string) => {
    setColor(hex);
    setPrimaryColor(hexToHsl(hex));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Configurações</h1>

      <Card className="rounded-2xl">
        <CardHeader><CardTitle>Identidade Visual (White-label)</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Logotipo da Instituição</Label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-2xl border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                <img src={instituicao.logo_url} alt="Logo" className="h-12 w-12" />
              </div>
              <Button variant="outline" className="rounded-xl">Upload</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cor Primária</Label>
            <div className="flex items-center gap-4">
              <input type="color" value={color} onChange={e => handleColorChange(e.target.value)} className="h-12 w-12 rounded-xl cursor-pointer border-0" />
              <Input value={color} onChange={e => handleColorChange(e.target.value)} className="w-32 rounded-xl font-mono" />
              <div className="h-12 flex-1 rounded-xl bg-primary transition-colors" />
            </div>
          </div>

          <Button className="rounded-xl" onClick={() => toast({ title: '✅ Configurações salvas!' })}>
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuracoes;
