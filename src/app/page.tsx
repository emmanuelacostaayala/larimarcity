'use client';

import Link from 'next/link';
import { FilePlus, Copy, Download, Users, TrendingUp, AlertTriangle, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const recentContracts = [
  { id: 'LC-001', client: 'John Doe', project: 'Prime Towers', unit: 'A-401', date: '2026-02-23', status: 'Draft' },
  { id: 'LC-002', client: 'Acme Corp', project: 'Breeze Towers', unit: 'B-205', date: '2026-02-22', status: 'Generated' },
  { id: 'LC-003', client: 'Maria Garcia', project: 'Townhouses', unit: 'TH-12', date: '2026-02-20', status: 'Signed' },
];

const stats = [
  {
    title: 'Total Contratos',
    value: '1,248',
    change: '+12%',
    positive: true,
    icon: Copy,
    accent: 'hsl(var(--primary))',
  },
  {
    title: 'Clientes',
    value: '842',
    change: '+4%',
    positive: true,
    icon: Users,
    accent: 'hsl(270 80% 65%)',
  },
  {
    title: 'Proyectos Activos',
    value: '3',
    change: 'Prime, Breeze, TH',
    positive: null,
    icon: TrendingUp,
    accent: 'hsl(140 70% 50%)',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Page Header */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'hsl(var(--primary))' }}>
              Bienvenido
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'hsl(var(--foreground))' }}>
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Resumen de actividad de generación de contratos.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: 'hsl(40 90% 55% / 0.1)',
              color: 'hsl(40 90% 55%)',
              border: '1px solid hsl(40 90% 55% / 0.25)',
            }}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            DATOS DE DEMO
          </div>
          <Link href="/contracts/new">
            <motion.div
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
              style={{
                background: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                boxShadow: '0 4px 14px hsl(var(--primary) / 0.35)',
              }}
            >
              <FilePlus className="w-4 h-4" />
              Nuevo Contrato
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              custom={i + 1}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="rounded-2xl p-5 card-hover cursor-default"
              style={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold tracking-tight" style={{ color: 'hsl(var(--foreground))' }}>
                    {stat.value}
                  </p>
                  <p className="text-xs mt-1.5 font-medium" style={{
                    color: stat.positive === true ? 'hsl(140 70% 45%)' : stat.positive === false ? 'hsl(0 70% 55%)' : 'hsl(var(--muted-foreground))',
                  }}>
                    {stat.positive !== null && stat.positive && '↑ '}{stat.change}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${stat.accent}18`, border: `1px solid ${stat.accent}28` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.accent }} />
                </div>
              </div>
              {/* Bottom accent bar */}
              <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ background: 'hsl(var(--muted))' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: stat.accent }}
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Contracts Table */}
      <motion.div
        custom={4}
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
        }}
      >
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
          <div>
            <h3 className="font-semibold" style={{ color: 'hsl(var(--foreground))' }}>Contratos Recientes</h3>
            <p className="text-xs mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Últimos contratos generados. (Datos demo)
            </p>
          </div>
          <button className="flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-70"
            style={{ color: 'hsl(var(--primary))' }}>
            Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider" style={{ background: 'hsl(var(--muted) / 0.5)', borderBottom: '1px solid hsl(var(--border))' }}>
              <tr>
                {['ID', 'Cliente', 'Proyecto', 'Unidad', 'Fecha', 'Estado', ''].map((h) => (
                  <th key={h} className={cn(
                    'px-5 py-3 font-semibold text-left',
                    h === '' ? 'text-right' : ''
                  )} style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentContracts.map((contract, i) => (
                <motion.tr
                  key={contract.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid hsl(var(--border))' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'hsl(var(--muted) / 0.4)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold" style={{ color: 'hsl(var(--primary))' }}>
                    {contract.id}
                  </td>
                  <td className="px-5 py-3.5 font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                    {contract.client}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium"
                      style={{
                        background: 'hsl(var(--primary) / 0.1)',
                        color: 'hsl(var(--primary))',
                        border: '1px solid hsl(var(--primary) / 0.2)',
                      }}>
                      {contract.project}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {contract.unit}
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {contract.date}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn(
                      'inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold',
                    )} style={
                      contract.status === 'Draft'
                        ? { background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))', border: '1px solid hsl(var(--border))' }
                        : contract.status === 'Generated'
                          ? { background: 'hsl(40 90% 55% / 0.12)', color: 'hsl(40 90% 50%)', border: '1px solid hsl(40 90% 55% / 0.25)' }
                          : { background: 'hsl(140 70% 50% / 0.12)', color: 'hsl(140 70% 40%)', border: '1px solid hsl(140 70% 50% / 0.25)' }
                    }>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      className="opacity-40 cursor-not-allowed transition-opacity"
                      title="Los mockups no son descargables"
                    >
                      <Download className="h-4 w-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
