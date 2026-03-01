import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: LucideIcon;
    color: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'amber' | 'slate';
    onClick?: () => void;
    className?: string;
}

const colorMap = {
    blue: 'bg-blue-500/10 text-blue-600 border-blue-200/50',
    green: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-200/50',
    orange: 'bg-orange-500/10 text-orange-600 border-orange-200/50',
    pink: 'bg-pink-500/10 text-pink-600 border-pink-200/50',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-200/50',
    slate: 'bg-slate-500/10 text-slate-600 border-slate-200/50',
};

const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    onClick,
    className
}) => {
    return (
        <Card
            onClick={onClick}
            className={cn(
                "group relative overflow-hidden rounded-[2rem] border-none p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl cursor-pointer bg-card/60 backdrop-blur-xl shadow-sm",
                className
            )}
        >
            <div className="relative z-10 flex flex-col gap-4">
                <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                    colorMap[color]
                )}>
                    <Icon className="h-6 w-6" />
                </div>

                <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
                    <p className="text-lg font-black text-foreground leading-tight">{value}</p>
                    {subtitle && (
                        <p className="text-[10px] font-semibold text-muted-foreground/60">{subtitle}</p>
                    )}
                </div>
            </div>

            {/* Decorative Gradient Background */}
            <div className={cn(
                "absolute -right-8 -bottom-8 h-32 w-32 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20",
                color === 'blue' && "bg-blue-500",
                color === 'green' && "bg-emerald-500",
                color === 'purple' && "bg-purple-500",
                color === 'orange' && "bg-orange-500",
                color === 'pink' && "bg-pink-500",
                color === 'amber' && "bg-amber-500",
                color === 'slate' && "bg-slate-500",
            )} />
        </Card>
    );
};

export default DashboardCard;
