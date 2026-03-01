import { useEffect, useState } from 'react';
import { Sparkles, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CelebrationOverlayProps {
    open: boolean;
    titulo?: string;
    legenda?: string;
    onClose: () => void;
}

// Confetti particle colors
const COLORS = ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#ef4444', '#06b6d4'];

function Particle({ index }: { index: number }) {
    const color = COLORS[index % COLORS.length];
    const left = `${Math.random() * 100}%`;
    const delay = `${Math.random() * 1.5}s`;
    const duration = `${1.8 + Math.random() * 1.5}s`;
    const size = `${6 + Math.floor(Math.random() * 10)}px`;
    const shape = index % 3 === 0 ? '50%' : index % 3 === 1 ? '0' : '2px';

    return (
        <div
            style={{
                position: 'absolute',
                top: '-20px',
                left,
                width: size,
                height: size,
                backgroundColor: color,
                borderRadius: shape,
                animation: `confettiFall ${duration} ${delay} ease-in forwards`,
                opacity: 0,
            }}
        />
    );
}

export const CelebrationOverlay = ({ open, titulo, legenda, onClose }: CelebrationOverlayProps) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (open) {
            setVisible(true);
        }
    }, [open]);

    if (!visible) return null;

    return (
        <>
            <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
        @keyframes trophyBounce {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.3) rotate(-10deg); }
          50% { transform: scale(1.5) rotate(5deg); }
          75% { transform: scale(1.2) rotate(-3deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

            <div
                className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
                style={{ background: 'linear-gradient(145deg, #1e1b4b ee, #312e81)' }}
                onClick={onClose}
            >
                {/* Confetti Layer */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {Array.from({ length: 60 }).map((_, i) => (
                        <Particle key={i} index={i} />
                    ))}
                </div>

                {/* Content Card */}
                <div
                    className="relative z-10 flex flex-col items-center text-center space-y-6 p-8 mx-6"
                    style={{ animation: 'fadeInUp 0.6s ease forwards' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Trophy */}
                    <div
                        className="text-8xl select-none"
                        style={{ animation: 'trophyBounce 1s ease 0.3s both' }}
                    >
                        🏆
                    </div>

                    {/* Stars */}
                    <div className="flex gap-3">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className="h-6 w-6 fill-amber-400 text-amber-400"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            />
                        ))}
                    </div>

                    {/* Text */}
                    <div className="space-y-2">
                        <h1
                            className="text-3xl font-black text-white tracking-tight"
                            style={{
                                background: 'linear-gradient(90deg, #fbbf24, #f472b6, #818cf8, #34d399, #fbbf24)',
                                backgroundSize: '200%',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                animation: 'shimmer 3s linear infinite',
                            }}
                        >
                            {titulo || 'Primeira Vez! 🎉'}
                        </h1>
                        <p className="text-white/70 text-sm font-medium leading-relaxed">
                            {legenda || 'Um momento especial foi registrado no álbum do seu filho!'}
                        </p>
                    </div>

                    {/* Confetti sparkle decorations */}
                    <div className="flex gap-4 items-center">
                        <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
                        <span className="text-white/60 text-xs uppercase tracking-widest font-bold">Momento Especial</span>
                        <Sparkles className="h-5 w-5 text-pink-300 animate-pulse" />
                    </div>

                    <Button
                        size="lg"
                        className="rounded-full px-10 h-14 font-black text-base shadow-2xl shadow-amber-500/30"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                        onClick={onClose}
                    >
                        Ver no Álbum 📸
                    </Button>
                </div>
            </div>
        </>
    );
};

export default CelebrationOverlay;
