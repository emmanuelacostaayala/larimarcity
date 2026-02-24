'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, FilePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
    const pathname = usePathname();
    const navItems = [
        { label: 'Dashboard', href: '/', icon: LayoutDashboard },
        { label: 'New Contract', href: '/contracts/new', icon: FilePlus },
        { label: 'Documents', href: '/contracts', icon: FileText },
        { label: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-card/30 backdrop-blur-md border-r border-border h-full flex flex-col">
            <div className="p-6 border-b border-border flex items-center gap-3">
                <span className="font-semibold text-lg text-foreground tracking-tight">Menu</span>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon size={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-medium shadow-sm text-primary">
                        AD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-foreground font-medium">Admin User</span>
                        <span className="text-xs">admin@larimarcity.com</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
