import Image from 'next/image';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Header() {
    return (
        <header className="h-16 border-b border-border bg-card/60 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50 transition-colors duration-300">
            <div className="flex items-center gap-4">
                {/* Full Uncropped Larimar City logo */}
                <div className="relative w-40 h-12">
                    <Image
                        src="/logo-larimarcity.color-cuadrado.png"
                        alt="Larimar City Logo"
                        fill
                        className="object-contain object-left dark:brightness-110 drop-shadow-sm transition-all"
                        priority
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <ThemeToggle />
            </div>
        </header>
    );
}

