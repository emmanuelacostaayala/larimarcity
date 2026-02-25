'use client';

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

    if (!plan) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Plan de Pago</CardTitle>
                <CardDescription>Define the financial terms. The construction installments are auto-calculated.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Moneda / Currency</Label>
                        <Select
                            value={plan.currency}
                            onValueChange={(val) => handleSelectChange('currency', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a currency" />
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

                    <div className="space-y-2">
                        <Label>Precio de Lista (Base Price)</Label>
                        <Input
                            type="number"
                            name="basePrice"
                            min="0"
                            value={plan.basePrice || ''}
                            onChange={handleChange}
                            placeholder="e.g. 260000"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Precio Total (Negociado) {plan.basePrice && plan.totalPrice ? <span className="text-emerald-600 text-xs ml-2 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">-{((1 - (plan.totalPrice / plan.basePrice)) * 100).toFixed(2)}% DESC</span> : null}</Label>
                        <Input
                            type="number"
                            name="totalPrice"
                            min="0"
                            value={plan.totalPrice || ''}
                            onChange={handleChange}
                            placeholder="e.g. 250000"
                        />
                    </div>

                    {plan.currency === 'EUR' && (
                        <div className="space-y-2 md:col-span-2">
                            <Label>Tipo de Cambio (EUR a USD) para Fianza Seguros</Label>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="number"
                                    name="exchangeRate"
                                    step="0.0001"
                                    min="0"
                                    value={plan.exchangeRate || ''}
                                    onChange={handleChange}
                                    placeholder="Ej. 1.05"
                                    className="max-w-[200px]"
                                />
                                <span className="text-xs text-muted-foreground">Congela la tasa del BC para que la aseguradora reciba el contrato en Dólares.</span>
                            </div>
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
                                        placeholder="e.g. 2500"
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
                                        placeholder="e.g. 65000"
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
                                <Label>Número de Cuotas de Construcción</Label>
                                <Input
                                    type="number"
                                    name="constructionInstallments"
                                    min="0"
                                    max="60"
                                    value={plan.constructionInstallments || ''}
                                    onChange={handleChange}
                                    placeholder="e.g. 10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Inicio Cuotas Construcción</Label>
                                <Input
                                    type="date"
                                    name="constructionStartDate"
                                    value={plan.constructionStartDate || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    <div className="space-y-2 md:col-span-2 text-primary">
                        <Label>Saldo Contra Entrega</Label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                name="deliveryAmount"
                                min="0"
                                value={plan.deliveryAmount || ''}
                                onChange={handleChange}
                                placeholder="e.g. 170000"
                            />
                            {plan.totalPrice > 0 && (
                                <div className="w-16 flex items-center justify-center text-xs font-medium bg-muted rounded-md border text-muted-foreground mr-2">
                                    {((plan.deliveryAmount / plan.totalPrice) * 100).toFixed(1)}%
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    const remaining = Math.max(0, plan.totalPrice - (plan.reservationAmount || 0) - (plan.downPaymentAmount || 0));
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
                </div>
            </CardContent>
        </Card>
    );
}
