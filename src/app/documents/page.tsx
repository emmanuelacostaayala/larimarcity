'use client';

import { useContractStore } from '@/context/ContractStore';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Trash2, FilePlus, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function getProjectBadge(project: string) {
    if (project.toLowerCase().includes('prime')) return 'PT';
    if (project.toLowerCase().includes('breeze')) return 'BT';
    return 'PP';
}

function getStatusBadge(format: 'pdf' | 'docx' | 'zip' | 'both') {
    switch (format) {
        case 'pdf': return { label: 'PDF', cls: 'bg-red-500/10 text-red-400 ring-red-500/20' };
        case 'docx': return { label: 'DOCX', cls: 'bg-blue-500/10 text-blue-400 ring-blue-500/20' };
        case 'zip': return { label: 'ZIP', cls: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' };
        case 'both': return { label: 'PDF + DOCX', cls: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' };
    }
}

export default function DocumentsPage() {
    const { contracts, removeContract, clearAll } = useContractStore();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Documentos Generados</h2>
                    <p className="text-sm text-muted-foreground">Contratos generados en esta sesión (caché local).</p>
                </div>
                <div className="flex items-center gap-3">
                    {contracts.length > 0 && (
                        <Button variant="outline" size="sm" onClick={clearAll} className="gap-2 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                            Limpiar todo
                        </Button>
                    )}
                    <Link href="/contracts/new">
                        <Button size="sm" className="gap-2">
                            <FilePlus className="w-4 h-4" />
                            Nuevo Contrato
                        </Button>
                    </Link>
                </div>
            </div>

            {contracts.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center min-h-[400px] rounded-xl border border-dashed border-border bg-card/50 gap-4"
                >
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                        <p className="font-medium text-foreground">No hay documentos aún</p>
                        <p className="text-sm text-muted-foreground mt-1">Genera tu primer contrato para verlo aquí.</p>
                    </div>
                    <Link href="/contracts/new">
                        <Button className="gap-2">
                            <FilePlus className="w-4 h-4" />
                            Crear Contrato
                        </Button>
                    </Link>
                </motion.div>
            ) : (
                <>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold border border-amber-500/20">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Almacenamiento local — Los documentos se pierden al limpiar el navegador
                    </div>

                    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-border">
                            <h3 className="text-lg font-semibold text-foreground">{contracts.length} documento{contracts.length !== 1 ? 's' : ''}</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground bg-muted/50 uppercase border-b border-border">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Cliente</th>
                                        <th className="px-6 py-3 font-medium">Proyecto / Unidad</th>
                                        <th className="px-6 py-3 font-medium">Formato</th>
                                        <th className="px-6 py-3 font-medium">Generado</th>
                                        <th className="px-6 py-3 font-medium">Nombre archivo</th>
                                        <th className="px-6 py-3 font-medium text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    <AnimatePresence>
                                        {contracts.map((contract) => {
                                            const badge = getStatusBadge(contract.format);
                                            return (
                                                <motion.tr
                                                    key={contract.id}
                                                    layout
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 10 }}
                                                    className="bg-card hover:bg-muted/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 font-medium text-foreground">
                                                        {contract.payload.client.name}
                                                        <p className="text-xs text-muted-foreground font-normal">
                                                            {contract.payload.client.type === 'Fisica' ? '👤 Persona Física' : '🏢 Sociedad'}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-primary/20 mr-2">
                                                            {getProjectBadge(contract.payload.property.project)}
                                                        </span>
                                                        <span className="font-mono text-xs text-muted-foreground">
                                                            {contract.payload.property.unitNumber}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={cn('inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset', badge.cls)}>
                                                            {badge.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-muted-foreground">
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {new Date(contract.generatedAt).toLocaleString('es-DO', { dateStyle: 'short', timeStyle: 'short' })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-mono text-xs text-muted-foreground break-all">{contract.filename}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {contract.blobUrl ? (
                                                                <a
                                                                    href={contract.blobUrl}
                                                                    download={contract.filename}
                                                                    className="text-muted-foreground hover:text-primary transition-colors"
                                                                    title="Re-descargar"
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                </a>
                                                            ) : (
                                                                <span className="text-muted-foreground/40 cursor-not-allowed" title="URL expirada — re-genera el contrato">
                                                                    <Download className="h-4 w-4" />
                                                                </span>
                                                            )}
                                                            <button
                                                                onClick={() => removeContract(contract.id)}
                                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                                                title="Eliminar de la lista"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
