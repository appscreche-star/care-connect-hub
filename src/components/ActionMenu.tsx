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
                "flex overflow-x-auto pb-4 gap-3 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-6 lg:grid-cols-11 sm:gap-4 sm:pb-0 sm:overflow-visible animate-in fade-in duration-700",
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
                            "flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl transition-all border-2 flex-shrink-0 w-20 sm:w-auto",
                            isActive
                                ? cn("border-primary/40 shadow-lg shadow-primary/5 scale-105", item.bg)
                                : "border-transparent bg-card/40 hover:bg-card hover:border-muted-foreground/10"
                        )}
                    >
                        <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center transition-transform",
                            item.color,
                            isActive ? "scale-110" : ""
                        )}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <span className={cn(
                            "text-[9px] font-black uppercase tracking-wider text-center line-clamp-1 whitespace-nowrap",
                            isActive ? "text-primary" : "text-muted-foreground/70"
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
