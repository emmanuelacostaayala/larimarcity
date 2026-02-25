'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Eye, FileText, Pickaxe, Save, Loader2, Package, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PartyForm } from '@/components/forms/PartyForm';
import { PropertyForm } from '@/components/forms/PropertyForm';
import { PaymentForm } from '@/components/forms/PaymentForm';
import { ClausesForm } from '@/components/forms/ClausesForm';
import { ContractPayload } from '@/types/contract';
import { useContractStore } from '@/context/ContractStore';
import { getDocumentFilename } from '@/utils/documentName';
import { formatLegalCurrency } from '@/utils/numberToWords';
import { buildInstallmentTable, formatPaymentDate } from '@/utils/paymentTable';
import { useRouter } from 'next/navigation';

const STEPS = [
    { id: 'client', label: 'Cliente' },
    { id: 'property', label: 'Propiedad' },
    { id: 'payment', label: 'Plan de Pago' },
    { id: 'clauses', label: 'Cláusulas' },
    { id: 'preview', label: 'Vista Previa' },
];

// ─── Preview Component ────────────────────────────────────────────────────────
function ContractPreview({ payload }: { payload: Partial<ContractPayload> }) {
    const c = payload.client;
    const p = payload.property;
    const pay = payload.paymentPlan;
    const cl = payload.clauses;

    if (!c || !p || !pay || !cl) return null;

    const currency = pay.currency;
    const rows = buildInstallmentTable(pay);

    const field = (label: string, value?: string | number) => (
        <div className="flex justify-between py-2" style={{ borderBottom: '1px solid hsl(var(--border))' }}>
            <span className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>{label}</span>
            <span className="text-sm font-medium text-right max-w-[60%]" style={{ color: 'hsl(var(--foreground))' }}>{value ?? '—'}</span>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 font-semibold" style={{ color: 'hsl(var(--primary))' }}>
                <Eye className="w-5 h-5" />
                <span>Vista Previa del Contrato</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl p-5" style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
                    <h3 className="font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>Beneficiario</h3>
                    {field('Nombre', c.name)}
                    {field('Tipo', c.type === 'Fisica' ? 'Persona Física' : 'Sociedad')}
                    {c.type === 'Fisica' && field('Documento', `${c.documentType} · ${c.documentNumber}`)}
                    {c.type === 'Fisica' && field('Nacionalidad', c.nationality)}
                    {c.type === 'Sociedad' && field('RNC / CIF', c.rncCif)}
                    {field('Domicilio', c.address)}
                </div>
                <div className="rounded-2xl p-5" style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
                    <h3 className="font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>Propiedad</h3>
                    {field('Proyecto', p.project)}
                    {field('Unidad', p.unitNumber)}
                    {field('Nivel', String(p.level))}
                    {field('Superficie', `${p.squareMeters} m²`)}
                    {field('Habitaciones', `${p.rooms} hab · ${p.bathrooms} baños`)}
                </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
                <h3 className="font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>Plan de Pago</h3>
                <div className="grid md:grid-cols-2 gap-x-8">
                    {field('Moneda', currency)}
                    {field('Precio Total', formatLegalCurrency(pay.totalPrice, currency))}
                    {!pay.isCash && field('Reserva', formatLegalCurrency(pay.reservationAmount, currency))}
                    {!pay.isCash && field('Inicial', formatLegalCurrency(pay.downPaymentAmount, currency))}
                    {!pay.isCash && field('Cuotas', String(pay.constructionInstallments) + ' cuotas mensuales')}
                    {field('Contra Entrega', formatLegalCurrency(pay.deliveryAmount, currency))}
                </div>
            </div>

            {rows.length > 0 && (
                <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid hsl(var(--border))' }}>
                    <div className="text-center py-2.5 text-xs font-bold tracking-widest uppercase"
                        style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}>
                        Plan de Pagos
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead style={{ background: 'hsl(var(--muted) / 0.5)', borderBottom: '1px solid hsl(var(--border))' }}>
                                <tr>
                                    <th className="px-3 py-2 text-left font-semibold" style={{ color: 'hsl(var(--muted-foreground))' }}>Concepto</th>
                                    <th className="px-3 py-2 text-center font-semibold" style={{ color: 'hsl(var(--muted-foreground))' }}>#</th>
                                    <th className="px-3 py-2 text-right font-semibold" style={{ color: 'hsl(var(--muted-foreground))' }}>Importe</th>
                                    <th className="px-3 py-2 text-left font-semibold hidden md:table-cell" style={{ color: 'hsl(var(--muted-foreground))' }}>En Letras</th>
                                    <th className="px-3 py-2 text-center font-semibold" style={{ color: 'hsl(var(--muted-foreground))' }}>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid hsl(var(--border))', background: idx % 2 === 1 ? 'hsl(var(--muted) / 0.3)' : 'transparent' }}>
                                        <td className="px-3 py-2 font-medium">{row.label}</td>
                                        <td className="px-3 py-2 text-center" style={{ color: 'hsl(var(--muted-foreground))' }}>{idx}</td>
                                        <td className="px-3 py-2 text-right font-mono">{new Intl.NumberFormat('es-DO', { minimumFractionDigits: 2 }).format(row.amount)}</td>
                                        <td className="px-3 py-2 hidden md:table-cell" style={{ color: 'hsl(var(--muted-foreground))' }}>{formatLegalCurrency(row.amount, currency)}</td>
                                        <td className="px-3 py-2 text-center" style={{ color: 'hsl(var(--muted-foreground))' }}>{formatPaymentDate(row.dueDate)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="rounded-2xl p-5" style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
                <h3 className="font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>Cláusulas Especiales</h3>
                <div className="flex flex-wrap gap-2">
                    {cl.earlyPaymentInterest && <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'hsl(40 90% 55% / 0.12)', color: 'hsl(40 90% 50%)', border: '1px solid hsl(40 90% 55% / 0.25)' }}>Interés Pago Anticipado</span>}
                    {cl.golfMembership && <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'hsl(140 70% 50% / 0.12)', color: 'hsl(140 60% 40%)', border: '1px solid hsl(140 70% 50% / 0.25)' }}>Membresía Golf</span>}
                    {cl.qualityMemory && <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'hsl(var(--primary) / 0.12)', color: 'hsl(var(--primary))', border: '1px solid hsl(var(--primary) / 0.25)' }}>Memoria de Calidades</span>}
                    {cl.vacationRental && <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'hsl(270 80% 65% / 0.12)', color: 'hsl(270 80% 60%)', border: '1px solid hsl(270 80% 65% / 0.25)' }}>Alquiler Vacacional</span>}
                    {!cl.earlyPaymentInterest && !cl.golfMembership && !cl.qualityMemory && !cl.vacationRental &&
                        <span className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Sin cláusulas adicionales</span>}
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NewContractPage() {
    const { addContract } = useContractStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [loadingFormat, setLoadingFormat] = useState<'pdf' | 'zip' | null>(null);
    const router = useRouter();

    const [payload, setPayload] = useState<Partial<ContractPayload>>({
        date: new Date().toISOString(),
        client: { type: 'Fisica', documentType: 'Pasaporte', documentNumber: '', civilStatus: 'Soltero', nationality: '', name: '', address: '' },
        property: { project: 'Prime Towers', unitNumber: '', level: 1, squareMeters: 0, rooms: 1, bathrooms: 1 },
        paymentPlan: {
            currency: 'USD',
            totalPrice: 0,
            isCash: false,
            reservationAmount: 0,
            reservationDate: '',
            downPaymentAmount: 0,
            downPaymentDate: '',
            constructionInstallments: 10,
            constructionStartDate: '',
            installments: [],
            deliveryAmount: 0
        },
        clauses: { earlyPaymentInterest: false, golfMembership: false, qualityMemory: true, vacationRental: false }
    });

    const validateStep = () => {
        if (currentStep === 0) {
            const client = payload.client;
            if (!client?.name || !client?.address) { alert('Por favor completa Nombre y Dirección.'); return false; }
            if (client.type === 'Fisica' && (!client.documentNumber || !client.nationality)) {
                alert('Completa el Número de Documento y Nacionalidad.'); return false;
            }
            if (client.type === 'Sociedad' && !client.rncCif) {
                alert('Completa el RNC / CIF.'); return false;
            }
        }
        if (currentStep === 1) {
            const { project, unitNumber, squareMeters } = payload.property || {};
            if (!project || !unitNumber || !squareMeters) {
                alert('Completa Proyecto, Número de Unidad y Superficie.'); return false;
            }
        }
        if (currentStep === 2) {
            const { totalPrice } = payload.paymentPlan || {};
            if (!totalPrice || totalPrice <= 0) { alert('Ingresa un Precio Total válido.'); return false; }
        }
        return true;
    };

    const handleNext = () => { if (!validateStep()) return; if (currentStep < STEPS.length - 1) setCurrentStep(p => p + 1); };
    const handlePrev = () => { if (currentStep > 0) setCurrentStep(p => p - 1); };

    const handleGenerate = async (format: 'pdf' | 'zip') => {
        setLoadingFormat(format);
        try {
            const endpoint = format === 'pdf' ? '/api/contracts/generate/pdf' : '/api/contracts/generate';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('API Error');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            // Extract filename from header or fallback
            const contentDisposition = res.headers.get('Content-Disposition');
            let filename = `Contrato_Larimar_${payload.property?.unitNumber || 'Unidad'}.${format}`;
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }

            const a = document.createElement('a');
            a.href = url; a.download = filename; a.click();
            addContract({ id: crypto.randomUUID(), generatedAt: new Date().toISOString(), payload: payload as ContractPayload, filename, format, blobUrl: url });

            router.push('/');
        } catch (e) {
            console.error(e);
            alert('Error generando documento. Por favor revise la consola.');
        } finally {
            setLoadingFormat(null);
        }
    };

    const isLastStep = currentStep === STEPS.length - 1;
    const isLoading = loadingFormat !== null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'hsl(var(--primary))' }}>
                        Contratos
                    </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'hsl(var(--foreground))' }}>Nuevo Contrato</h1>
                <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Completa los datos y revisa la vista previa antes de generar.
                </p>
            </div>

            {/* ── Stepper ─────────────────────────────────────────────── */}
            <div className="rounded-2xl p-5" style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
                {/* Step Circles + Connector Row */}
                <div className="relative flex items-center">
                    {STEPS.map((step, index) => {
                        const isCurrent = currentStep === index;
                        const isCompleted = currentStep > index;
                        const isLast = index === STEPS.length - 1;

                        return (
                            <div key={step.id} className="flex items-center" style={{ flex: isLast ? '0 0 auto' : '1 1 0' }}>
                                {/* Circle */}
                                <div className="relative z-10 shrink-0">
                                    <motion.div
                                        animate={{
                                            scale: isCurrent ? 1.1 : 1,
                                        }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300"
                                        style={
                                            isCompleted
                                                ? { background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', boxShadow: '0 0 12px hsl(var(--primary) / 0.4)' }
                                                : isCurrent
                                                    ? { background: 'hsl(var(--background))', color: 'hsl(var(--primary))', border: '2.5px solid hsl(var(--primary))', boxShadow: '0 0 16px hsl(var(--primary) / 0.35)' }
                                                    : { background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))', border: '2px solid hsl(var(--border))' }
                                        }
                                    >
                                        {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                                    </motion.div>
                                </div>

                                {/* Connector line (between steps) */}
                                {!isLast && (
                                    <div className="flex-1 mx-2 h-0.5 relative overflow-hidden rounded-full" style={{ background: 'hsl(var(--border))' }}>
                                        <motion.div
                                            className="absolute inset-y-0 left-0 rounded-full"
                                            style={{ background: 'hsl(var(--primary))' }}
                                            initial={{ width: 0 }}
                                            animate={{ width: isCompleted ? '100%' : '0%' }}
                                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Step Labels Row */}
                <div className="flex mt-3">
                    {STEPS.map((step, index) => {
                        const isCurrent = currentStep === index;
                        const isCompleted = currentStep > index;
                        const isLast = index === STEPS.length - 1;
                        return (
                            <div
                                key={step.id}
                                className="text-xs font-medium shrink-0 text-left"
                                style={{
                                    flex: isLast ? '0 0 auto' : '1 1 0',
                                    color: isCompleted || isCurrent ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                                    fontWeight: isCurrent ? 700 : 500,
                                }}
                            >
                                {step.label}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Form Area ─────────────────────────────────────────────── */}
            <div className={isLastStep ? '' : 'rounded-2xl p-6 sm:p-8'} style={isLastStep ? {} : {
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                minHeight: '400px',
            }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {currentStep === 0 && <PartyForm payload={payload} setPayload={setPayload} />}
                        {currentStep === 1 && <PropertyForm payload={payload} setPayload={setPayload} />}
                        {currentStep === 2 && <PaymentForm payload={payload} setPayload={setPayload} />}
                        {currentStep === 3 && <ClausesForm payload={payload} setPayload={setPayload} />}
                        {currentStep === 4 && <ContractPreview payload={payload} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Footer Controls ───────────────────────────────────────── */}
            <div className="flex items-center justify-between pb-6">
                <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="gap-2 rounded-xl"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Atrás
                </Button>

                {isLastStep ? (
                    <div className="flex gap-3">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                onClick={() => handleGenerate('pdf')}
                                disabled={isLoading}
                                className="gap-2 rounded-xl font-semibold"
                                style={{ background: 'hsl(0 72% 51%)', color: 'white', boxShadow: '0 4px 12px hsl(0 72% 51% / 0.3)' }}
                            >
                                {loadingFormat === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                                {loadingFormat === 'pdf' ? 'Generando...' : 'Generar PDF'}
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                variant="secondary"
                                onClick={() => handleGenerate('zip')}
                                disabled={isLoading}
                                className="gap-2 rounded-xl font-semibold"
                            >
                                {loadingFormat === 'zip' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                                {loadingFormat === 'zip' ? 'Empaquetando...' : 'Generar Paquete (ZIP)'}
                            </Button>
                        </motion.div>
                    </div>
                ) : (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            onClick={handleNext}
                            className="gap-2 rounded-xl font-semibold"
                            style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', boxShadow: '0 4px 14px hsl(var(--primary) / 0.35)' }}
                        >
                            {currentStep === STEPS.length - 2 ? (
                                <><Eye className="w-4 h-4" /> Vista Previa</>
                            ) : (
                                <>Siguiente <ArrowRight className="w-4 h-4" /></>
                            )}
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
