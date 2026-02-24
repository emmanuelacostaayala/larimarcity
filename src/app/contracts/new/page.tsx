'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Loader2, ArrowLeft, ArrowRight, Check, FileText, Eye } from 'lucide-react';
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

const STEPS = [
    { id: 'client', title: 'Datos del Cliente' },
    { id: 'property', title: 'Propiedad' },
    { id: 'payment', title: 'Plan de Pago' },
    { id: 'clauses', title: 'Cláusulas' },
    { id: 'preview', title: 'Vista Previa' },
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
        <div className="flex justify-between py-2 border-b border-border last:border-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{value ?? '—'}</span>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary font-semibold">
                <Eye className="w-5 h-5" />
                <span>Vista Previa del Contrato</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* Client */}
                <div className="rounded-xl border border-border bg-card/50 p-5 shadow-sm">
                    <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider opacity-60">Beneficiario</h3>
                    {field('Nombre', c.name)}
                    {field('Tipo', c.type === 'Fisica' ? 'Persona Física' : 'Sociedad')}
                    {c.type === 'Fisica' && field('Documento', `${c.documentType} · ${c.documentNumber}`)}
                    {c.type === 'Fisica' && field('Nacionalidad', c.nationality)}
                    {c.type === 'Sociedad' && field('RNC / CIF', c.rncCif)}
                    {field('Domicilio', c.address)}
                </div>

                {/* Property */}
                <div className="rounded-xl border border-border bg-card/50 p-5 shadow-sm">
                    <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider opacity-60">Propiedad</h3>
                    {field('Proyecto', p.project)}
                    {field('Unidad', p.unitNumber)}
                    {field('Nivel', String(p.level))}
                    {field('Superficie', `${p.squareMeters} m²`)}
                    {field('Habitaciones', `${p.rooms} hab · ${p.bathrooms} baños`)}
                </div>
            </div>

            {/* Payment summary */}
            <div className="rounded-xl border border-border bg-card/50 p-5 shadow-sm">
                <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider opacity-60">Plan de Pago</h3>
                <div className="grid md:grid-cols-2 gap-x-8">
                    {field('Moneda', currency)}
                    {field('Precio Total', formatLegalCurrency(pay.totalPrice, currency))}
                    {!pay.isCash && field('Reserva', formatLegalCurrency(pay.reservationAmount, currency))}
                    {!pay.isCash && field('Inicial', formatLegalCurrency(pay.downPaymentAmount, currency))}
                    {!pay.isCash && field('Cuotas Construcción', String(pay.constructionInstallments) + ' cuotas mensuales')}
                    {field('Contra Entrega', formatLegalCurrency(pay.deliveryAmount, currency))}
                </div>
            </div>

            {/* Payment Table */}
            {rows.length > 0 && (
                <div className="rounded-xl border border-border bg-card/50 overflow-hidden shadow-sm">
                    <div className="bg-[#1a1a2e] text-white text-center py-2.5 text-xs font-bold tracking-widest uppercase">
                        Plan de Pagos
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-muted/70 border-b border-border">
                                <tr>
                                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Concepto</th>
                                    <th className="px-3 py-2 text-center font-semibold text-muted-foreground">#</th>
                                    <th className="px-3 py-2 text-right font-semibold text-muted-foreground">Importe</th>
                                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground hidden md:table-cell">En Letras</th>
                                    <th className="px-3 py-2 text-center font-semibold text-muted-foreground">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {rows.map((row, idx) => (
                                    <tr key={idx} className={idx % 2 === 1 ? 'bg-muted/30' : ''}>
                                        <td className="px-3 py-2 font-medium">{row.label}</td>
                                        <td className="px-3 py-2 text-center text-muted-foreground">{idx}</td>
                                        <td className="px-3 py-2 text-right font-mono">{new Intl.NumberFormat('es-DO', { minimumFractionDigits: 2 }).format(row.amount)}</td>
                                        <td className="px-3 py-2 text-muted-foreground hidden md:table-cell">{formatLegalCurrency(row.amount, currency)}</td>
                                        <td className="px-3 py-2 text-center text-muted-foreground">{formatPaymentDate(row.dueDate)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Clauses */}
            <div className="rounded-xl border border-border bg-card/50 p-5 shadow-sm">
                <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider opacity-60">Cláusulas Especiales</h3>
                <div className="flex flex-wrap gap-2">
                    {cl.earlyPaymentInterest && <span className="px-2 py-1 rounded-full text-xs bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20">Interés Pago Anticipado</span>}
                    {cl.golfMembership && <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">Membresía Golf</span>}
                    {cl.qualityMemory && <span className="px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20">Memoria de Calidades</span>}
                    {cl.vacationRental && <span className="px-2 py-1 rounded-full text-xs bg-purple-500/10 text-purple-500 ring-1 ring-purple-500/20">Alquiler Vacacional</span>}
                    {!cl.earlyPaymentInterest && !cl.golfMembership && !cl.qualityMemory && !cl.vacationRental &&
                        <span className="text-sm text-muted-foreground">Sin cláusulas adicionales</span>}
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NewContractPage() {
    const { addContract } = useContractStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [loadingFormat, setLoadingFormat] = useState<'pdf' | 'docx' | null>(null);

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
            if (!client?.name || !client?.address) {
                alert('Por favor completa Nombre y Dirección.'); return false;
            }
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
            if (!totalPrice || totalPrice <= 0) {
                alert('Ingresa un Precio Total válido.'); return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (!validateStep()) return;
        if (currentStep < STEPS.length - 1) setCurrentStep((p) => p + 1);
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep((p) => p - 1);
    };

    const handleGenerate = async (format: 'pdf' | 'docx') => {
        setLoadingFormat(format);
        try {
            const endpoint = format === 'pdf' ? '/api/contracts/generate/pdf' : '/api/contracts/generate/docx';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('API Error');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const { getDocumentFilename: gdf } = await import('@/utils/documentName');
            const filename = gdf(payload as ContractPayload, format);

            // Trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();

            // Save to contract store
            addContract({
                id: crypto.randomUUID(),
                generatedAt: new Date().toISOString(),
                payload: payload as ContractPayload,
                filename,
                format,
                blobUrl: url,
            });

        } catch (err) {
            console.error(err);
            alert(`Error al generar ${format.toUpperCase()}`);
        } finally {
            setLoadingFormat(null);
        }
    };

    const isLastStep = currentStep === STEPS.length - 1;
    const isLoading = loadingFormat !== null;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Nuevo Contrato</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Completa los datos y revisa la vista previa antes de generar.
                </p>
            </div>

            {/* Stepper Header */}
            <nav aria-label="Progress" className="mb-12">
                <ol role="list" className="flex items-center">
                    {STEPS.map((step, index) => {
                        const isCurrent = currentStep === index;
                        const isCompleted = currentStep > index;

                        return (
                            <li key={step.id} className={`relative ${index !== STEPS.length - 1 ? 'pr-6 sm:pr-16 flex-1' : ''}`}>
                                <div className="flex items-center">
                                    <div
                                        className={`${isCompleted
                                            ? 'bg-primary'
                                            : isCurrent
                                                ? 'border-2 border-primary bg-background'
                                                : 'border-2 border-border bg-background'
                                            } flex h-8 w-8 items-center justify-center rounded-full transition-colors shrink-0`}
                                    >
                                        {isCompleted ? (
                                            <Check className="h-5 w-5 text-primary-foreground" />
                                        ) : (
                                            <span className={`${isCurrent ? 'text-primary' : 'text-muted-foreground'} text-sm font-medium`}>
                                                {index + 1}
                                            </span>
                                        )}
                                    </div>
                                    <div className="ml-3 hidden sm:block font-medium">
                                        <span className={`${isCurrent ? 'text-primary font-semibold' : 'text-muted-foreground'} text-xs`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {index !== STEPS.length - 1 && (
                                        <div className={`absolute top-4 left-8 right-0 h-0.5 hidden sm:block ${isCompleted ? 'bg-primary' : 'bg-border'} transition-colors`} style={{ marginLeft: '8px' }} />
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </nav>

            {/* Form Area */}
            <div className={`${isLastStep ? '' : 'bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8'} min-h-[400px]`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {currentStep === 0 && <PartyForm payload={payload} setPayload={setPayload} />}
                        {currentStep === 1 && <PropertyForm payload={payload} setPayload={setPayload} />}
                        {currentStep === 2 && <PaymentForm payload={payload} setPayload={setPayload} />}
                        {currentStep === 3 && <ClausesForm payload={payload} setPayload={setPayload} />}
                        {currentStep === 4 && <ContractPreview payload={payload} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Controls */}
            <div className="mt-8 flex items-center justify-between">
                <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Atrás
                </Button>

                {isLastStep ? (
                    <div className="flex gap-3">
                        <Button
                            onClick={() => handleGenerate('pdf')}
                            disabled={isLoading}
                            className="gap-2 bg-red-600 hover:bg-red-700 text-white"
                        >
                            {loadingFormat === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                            {loadingFormat === 'pdf' ? 'Generando...' : 'Generar PDF'}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => handleGenerate('docx')}
                            disabled={isLoading}
                            className="gap-2"
                        >
                            {loadingFormat === 'docx' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {loadingFormat === 'docx' ? 'Generando...' : 'Generar DOCX'}
                        </Button>
                    </div>
                ) : (
                    <Button onClick={handleNext} className="gap-2">
                        {currentStep === STEPS.length - 2 ? (
                            <><Eye className="w-4 h-4" /> Vista Previa</>
                        ) : (
                            <>Siguiente <ArrowRight className="w-4 h-4" /></>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
