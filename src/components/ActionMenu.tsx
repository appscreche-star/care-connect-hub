import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
    id: string;
    label: string;
    icon: LucideIcon;
    color: string;
    bg: string;
}

interface ActionMenuProps {
    items: MenuItem[];
    activeTab: string;
    onTabChange: (id: string) => void;
    className?: string;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ items, activeTab, onTabChange, className }) => {
    return (
        <div
            className={cn(
                "flex overflow-x-auto pb-4 gap-3 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center sm:gap-4 sm:pb-2 sm:overflow-visible animate-in fade-in duration-700",
                className
            )}
        >
            {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={cn(
                            "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all border-2 flex-shrink-0 w-24 sm:w-28 md:w-32",
                            isActive
                                ? cn("border-primary/40 shadow-xl shadow-primary/10 scale-105", item.bg)
                                : "border-transparent bg-card/40 hover:bg-card hover:border-muted-foreground/10"
                        )}
                    >
                        <div className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center transition-transform shadow-sm",
                            item.color,
                            isActive ? "scale-110 bg-white/50" : "bg-white/30"
                        )}>
                            <Icon className="h-6 w-6" />
                        </div>
                        <span className={cn(
                            "text-[10px] sm:text-xs font-black uppercase tracking-wider text-center line-clamp-1 whitespace-nowrap",
                            isActive ? "text-primary" : "text-muted-foreground/80"
                        )}>
                            {item.label}
                        </span>
                    </button>
                );
            })}

            {/* Styles to hide scrollbar but keep functionality */}
            <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
};

export default ActionMenu;
