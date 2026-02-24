'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, FilePlus, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
    { label: 'Dashboard', href: '/', exact: true, icon: LayoutDashboard },
    { label: 'Nuevo Contrato', href: '/contracts/new', exact: true, icon: FilePlus },
    { label: 'Documentos', href: '/documents', exact: false, icon: FileText },
    { label: 'Ajustes', href: '/settings', exact: false, icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-full flex flex-col mesh-bg" style={{
            background: 'hsl(var(--sidebar))',
            borderRight: '1px solid hsl(var(--sidebar-border))',
        }}>
            {/* Brand */}
            <div className="p-6 pb-4">
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 glow-primary-sm"
                        style={{ background: 'hsl(var(--primary))' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="hsl(var(--primary-foreground))" fillOpacity="0.9" />
                        </svg>
                    </div>
                    <div>
                        <span className="font-bold text-sm tracking-tight" style={{ color: 'hsl(var(--sidebar-foreground))' }}>
                            CLM Platform
                        </span>
                        <p className="text-[10px] font-medium tracking-widest uppercase" style={{ color: 'hsl(var(--primary))' }}>
                            Larimar City
                        </p>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="mx-4 mb-4 h-px" style={{ background: 'hsl(var(--sidebar-border))' }} />

            {/* Nav */}
            <nav className="flex-1 px-3 space-y-1">
                <p className="px-3 text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Menú
                </p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname === item.href || pathname.startsWith(item.href + '/');

                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileHover={{ x: 2 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    'relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer',
                                    isActive
                                        ? 'text-[--sidebar-primary-foreground]'
                                        : 'hover:bg-[hsl(var(--sidebar-accent)/0.6)]'
                                )}
                                style={isActive ? {
                                    background: 'hsl(var(--primary))',
                                    color: 'hsl(var(--primary-foreground))',
                                    boxShadow: '0 4px 14px hsl(var(--primary) / 0.35)',
                                } : {
                                    color: 'hsl(var(--sidebar-foreground) / 0.7)',
                                }}
                            >
                                {/* Active left indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                                        style={{ background: 'hsl(var(--primary))' }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <Icon size={18} className="shrink-0" />
                                <span className="text-sm font-medium flex-1">{item.label}</span>
                                {isActive && <ChevronRight size={14} className="shrink-0 opacity-70" />}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Divider */}
            <div className="mx-4 mt-4 h-px" style={{ background: 'hsl(var(--sidebar-border))' }} />

            {/* User */}
            <div className="p-4">
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors"
                    style={{ background: 'hsl(var(--sidebar-accent) / 0.5)' }}
                >
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                            background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(192 80% 60%))',
                            color: 'hsl(var(--primary-foreground))',
                        }}
                    >
                        AD
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold truncate" style={{ color: 'hsl(var(--sidebar-foreground))' }}>
                            Admin
                        </span>
                        <span className="text-[11px] truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>
                            admin@larimarcity.com
                        </span>
                    </div>
                </motion.div>
            </div>
        </aside>
    );
}
