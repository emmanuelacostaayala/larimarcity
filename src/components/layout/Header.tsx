import Image from 'next/image';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Bell, Search } from 'lucide-react';

export default function Header() {
    return (
        <header
            className="h-[60px] flex items-center justify-between px-6 sticky top-0 z-50"
            style={{
                background: 'hsl(var(--background) / 0.85)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderBottom: '1px solid hsl(var(--border))',
                boxShadow: '0 1px 0 hsl(var(--primary) / 0.05)',
            }}
        >
            <div className="flex items-center gap-4">
                <div className="relative w-36 h-10">
                    <Image
                        src="/logo-larimarcity.color-cuadrado.png"
                        alt="Larimar City Logo"
                        fill
                        className="object-contain object-left transition-all"
                        priority
                    />
                </div>
                {/* Gradient separator */}
                <div
                    className="w-px h-6 hidden sm:block"
                    style={{ background: 'linear-gradient(180deg, transparent, hsl(var(--border)), transparent)' }}
                />
                <span
                    className="text-xs font-semibold uppercase tracking-widest hidden sm:block"
                    style={{ color: 'hsl(var(--primary))' }}
                >
                    Contract Management
                </span>
            </div>

            <div className="flex items-center gap-2">
                {/* Notification btn */}
                <button
                    className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                    style={{
                        background: 'hsl(var(--muted))',
                        color: 'hsl(var(--muted-foreground))',
                    }}
                >
                    <Bell size={16} />
                    <span
                        className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                        style={{ background: 'hsl(var(--primary))' }}
                    />
                </button>

                <ThemeToggle />
            </div>
        </header>
    );
}
