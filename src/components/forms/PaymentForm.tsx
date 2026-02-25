'use client';

import { useState } from 'react';
import { ContractPayload } from '@/types/contract';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Props {
    payload: Partial<ContractPayload>;
    setPayload: React.Dispatch<React.SetStateAction<Partial<ContractPayload>>>;
}

export function PaymentForm({ payload, setPayload }: Props) {
    const plan = payload.paymentPlan;
    const [fetchingRate, setFetchingRate] = useState(false);
    const [rateDate, setRateDate] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value, type, checked } = e.target;
        const numericFields = ['basePrice', 'totalPrice', 'exchangeRate', 'reservationAmount', 'downPaymentAmount', 'deliveryAmount', 'constructionInstallments'];
        const finalValue = type === 'checkbox' ? checked : (numericFields.includes(name) ? Number(value) : value);

        setPayload({
            ...payload,
            paymentPlan: {
                ...payload.paymentPlan,
                [name]: finalValue,
            } as any
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        setPayload({
            ...payload,
            paymentPlan: {
                ...payload.paymentPlan,
                [name]: value,
            } as any
        });
    };

    const fetchBCERate = async () => {
        setFetchingRate(true);
        try {
            const res = await fetch('/api/exchange-rate');
            const data = await res.json();
            if (data.rate) {
                setRateDate(data.date);
                setPayload(prev => ({
                    ...prev,
                    paymentPlan: {
                        ...prev.paymentPlan,
                        exchangeRate: Number(data.rate.toFixed(4))
                    } as any
                }));
            }
        } catch (e) {
            console.error('Could not fetch BCE rate', e);
        } finally {
            setFetchingRate(false);
        }
    };

    if (!plan) return null;

    const currency = plan.currency || 'USD';
    const sym = currency === 'EUR' ? '€' : '$';

    // Compute fianza amount: Reserva + Inicial + Cuotas (NOT contra-entrega)
    const constructionTotal = Math.max(0, plan.totalPrice - (plan.reservationAmount || 0) - (plan.downPaymentAmount || 0) - (plan.deliveryAmount || 0));
    const fianzaEUR = (plan.reservationAmount || 0) + (plan.downPaymentAmount || 0) + constructionTotal;
    const fianzaUSD = fianzaEUR * (plan.exchangeRate || 1.05);

    const cuotaMonto = plan.constructionInstallments > 0
        ? constructionTotal / plan.constructionInstallments
        : 0;

    const periodLabel: Record<string, string> = {
        Mensual: 'mes',
        Trimestral: 'trimestre',
        Semestral: 'semestre',
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Plan de Pago</CardTitle>
                <CardDescription>Define los términos financieros. Las cuotas de construcción se calculan automáticamente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Currency + Cash */}
                    <div className="space-y-2">
                        <Label>Moneda / Currency</Label>
                        <Select
                            value={plan.currency}
                            onValueChange={(val) => handleSelectChange('currency', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione moneda" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EUR">Euros (€)</SelectItem>
                                <SelectItem value="USD">US Dollars ($)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 flex items-center h-full pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isCash"
                                checked={plan.isCash}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm font-medium">Pago 100% al Contado (sin cuotas)</span>
                        </label>
                    </div>

                    {/* Precios */}
                    <div className="space-y-2">
                        <Label>Precio de Lista (Base)</Label>
                        <Input
                            type="number"
                            name="basePrice"
                            min="0"
                            value={plan.basePrice || ''}
                            onChange={handleChange}
                            placeholder={`${sym}260,000`}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Precio Total (Negociado)
                            {plan.basePrice && plan.totalPrice && plan.totalPrice < plan.basePrice ? (
                                <span className="text-emerald-600 text-xs ml-2 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                                    -{((1 - (plan.totalPrice / plan.basePrice)) * 100).toFixed(2)}% DESC
                                </span>
                            ) : null}
                        </Label>
                        <Input
                            type="number"
                            name="totalPrice"
                            min="0"
                            value={plan.totalPrice || ''}
                            onChange={handleChange}
                            placeholder={`${sym}250,000`}
                        />
                    </div>

                    {/* Exchange rate — only for EUR */}
                    {currency === 'EUR' && (
                        <div className="space-y-2 md:col-span-2">
                            <Label>Tipo de Cambio EUR → USD</Label>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="number"
                                    name="exchangeRate"
                                    step="0.0001"
                                    min="0"
                                    value={plan.exchangeRate || ''}
                                    onChange={handleChange}
                                    placeholder="Ej. 1.0500"
                                    className="max-w-[180px]"
                                />
                                <button
                                    type="button"
                                    onClick={fetchBCERate}
                                    disabled={fetchingRate}
                                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition"
                                >
                                    {fetchingRate ? 'Cargando...' : '🔄 Obtener del BCE'}
                                </button>
                                {rateDate && (
                                    <span className="text-xs text-muted-foreground">
                                        Tasa del {rateDate} — quedará congelada en el contrato
                                    </span>
                                )}
                            </div>
                            {plan.exchangeRate && plan.totalPrice ? (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Precio en USD: <strong>${(plan.totalPrice * plan.exchangeRate).toLocaleString('es-DO', { minimumFractionDigits: 2 })}</strong>
                                </p>
                            ) : null}
                        </div>
                    )}

                    {!plan.isCash && (
                        <>
                            {/* Reserva */}
                            <div className="space-y-2">
                                <Label>Monto de Reserva</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        name="reservationAmount"
                                        min="0"
                                        value={plan.reservationAmount || ''}
                                        onChange={handleChange}
                                        placeholder={`${sym}2,500`}
                                    />
                                    {plan.totalPrice > 0 && (
                                        <div className="w-16 flex items-center justify-center text-xs font-medium bg-muted rounded-md border text-muted-foreground">
                                            {((plan.reservationAmount / plan.totalPrice) * 100).toFixed(1)}%
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Fecha de Reserva</Label>
                                <Input
                                    type="date"
                                    name="reservationDate"
                                    value={plan.reservationDate || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Inicial */}
                            <div className="space-y-2">
                                <Label>Monto Inicial (Down Payment)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        name="downPaymentAmount"
                                        min="0"
                                        value={plan.downPaymentAmount || ''}
                                        onChange={handleChange}
                                        placeholder={`${sym}20,000`}
                                    />
                                    {plan.totalPrice > 0 && (
                                        <div className="w-16 flex items-center justify-center text-xs font-medium bg-muted rounded-md border text-muted-foreground">
                                            {((plan.downPaymentAmount / plan.totalPrice) * 100).toFixed(1)}%
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Fecha del Inicial</Label>
                                <Input
                                    type="date"
                                    name="downPaymentDate"
                                    value={plan.downPaymentDate || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Construction installments */}
                            <div className="space-y-2">
                                <Label>N° de Cuotas de Construcción</Label>
                                <Input
                                    type="number"
                                    name="constructionInstallments"
                                    min="0"
                                    max="120"
                                    value={plan.constructionInstallments || ''}
                                    onChange={handleChange}
                                    placeholder="10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Periodicidad de Cuotas</Label>
                                <Select
                                    value={(plan as any).installmentPeriodicity || 'Mensual'}
                                    onValueChange={(val) => handleSelectChange('installmentPeriodicity', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Mensual">Mensual</SelectItem>
                                        <SelectItem value="Trimestral">Trimestral</SelectItem>
                                        <SelectItem value="Semestral">Semestral</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Inicio Cuotas de Construcción</Label>
                                <Input
                                    type="date"
                                    name="constructionStartDate"
                                    value={plan.constructionStartDate || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Computed installment amount display */}
                            {cuotaMonto > 0 && plan.constructionInstallments > 0 && (
                                <div className="space-y-1 p-3 rounded-lg bg-muted/50 border border-border md:col-span-2">
                                    <p className="text-sm font-medium text-muted-foreground">Cuota calculada</p>
                                    <p className="text-lg font-bold text-primary">
                                        {plan.constructionInstallments}× {sym}{cuotaMonto.toLocaleString('es-DO', { minimumFractionDigits: 2 })} / {periodLabel[(plan as any).installmentPeriodicity || 'Mensual']}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Total cuotas: {sym}{constructionTotal.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Contra entrega */}
                    <div className="space-y-2 md:col-span-2 text-primary">
                        <Label>Saldo Contra Entrega</Label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                name="deliveryAmount"
                                min="0"
                                value={plan.deliveryAmount || ''}
                                onChange={handleChange}
                                placeholder={`${sym}57,000`}
                            />
                            {plan.totalPrice > 0 && (
                                <div className="w-16 flex items-center justify-center text-xs font-medium bg-muted rounded-md border text-muted-foreground mr-2">
                                    {((plan.deliveryAmount / plan.totalPrice) * 100).toFixed(1)}%
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    const remaining = Math.max(0, plan.totalPrice - (plan.reservationAmount || 0) - (plan.downPaymentAmount || 0) - constructionTotal);
                                    setPayload({
                                        ...payload,
                                        paymentPlan: {
                                            ...plan,
                                            deliveryAmount: remaining
                                        } as any
                                    });
                                }}
                                className="px-3 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 focus:ring-2 focus:outline-none"
                            >
                                Calcular (Restante)
                            </button>
                        </div>
                    </div>

                    {/* Fianza Summary — shows when EUR */}
                    {currency === 'EUR' && plan.totalPrice > 0 && plan.exchangeRate && (
                        <div className="md:col-span-2 p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                            <p className="text-sm font-semibold text-primary">📋 Resumen Fianza Alliance Seguros</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Monto asegurado (sin contra-entrega):</span>
                                <span className="font-bold">€{fianzaEUR.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
                                <span className="text-muted-foreground">Convertido a USD (tasa {plan.exchangeRate}):</span>
                                <span className="font-bold text-primary">${fianzaUSD.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">La fianza se emite siempre en USD, usando el tipo de cambio bloqueado del contrato.</p>
                        </div>
                    )}

                </div>
            </CardContent>
        </Card>
    );
}
