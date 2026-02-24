'use client';

import Link from 'next/link';
import { FilePlus, Copy, Download, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const recentContracts = [
  { id: 'LC-001', client: 'John Doe', project: 'Prime Towers', unit: 'A-401', date: '2026-02-23', status: 'Draft' },
  { id: 'LC-002', client: 'Acme Corp', project: 'Breeze Towers', unit: 'B-205', date: '2026-02-22', status: 'Generated' },
  { id: 'LC-003', client: 'Maria Garcia', project: 'Townhouses', unit: 'TH-12', date: '2026-02-20', status: 'Signed' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Overview of your contract generation activity.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            MOCKUP DATA - Not Downloadable
          </div>
          <Link
            href="/contracts/new"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors cursor-pointer"
          >
            <FilePlus className="mr-2 h-4 w-4" />
            New Contract
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow cursor-default">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Contracts</h3>
            <Copy className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-foreground">1,248</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow cursor-default">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Clients</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-foreground">842</div>
          <p className="text-xs text-muted-foreground">+4% from last month</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow cursor-default">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Projects</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-foreground">3</div>
          <p className="text-xs text-muted-foreground">Prime, Breeze, Townhouses</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Recent Contracts</h3>
          <p className="text-sm text-muted-foreground">The latest contracts generated across all projects. (Mockups)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted/50 uppercase border-b border-border">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Project</th>
                <th className="px-6 py-3 font-medium">Unit</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentContracts.map((contract) => (
                <tr key={contract.id} className="bg-card hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{contract.id}</td>
                  <td className="px-6 py-4 text-muted-foreground">{contract.client}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <span className="inline-flex items-center rounded-full bg-larimar/10 px-2 py-1 text-xs font-medium text-larimar-dark dark:text-larimar-light ring-1 ring-inset ring-larimar/20">
                      {contract.project}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{contract.unit}</td>
                  <td className="px-6 py-4 text-muted-foreground">{contract.date}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                      contract.status === 'Draft' ? "bg-muted text-muted-foreground ring-border" :
                        contract.status === 'Generated' ? "bg-amber-500/10 text-amber-500 ring-amber-500/20" :
                          "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20"
                    )}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-primary transition-colors cursor-not-allowed opacity-50" title="Mockups cannot be downloaded">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

// Utility for this file since we need cn
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
