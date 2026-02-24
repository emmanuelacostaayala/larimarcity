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
        const numericFields = ['totalPrice', 'reservationAmount', 'downPaymentAmount', 'deliveryAmount', 'constructionInstallments'];
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

                    <div className="space-y-2 md:col-span-2">
                        <Label>Precio Total del Contrato</Label>
                        <Input
                            type="number"
                            name="totalPrice"
                            min="0"
                            value={plan.totalPrice || ''}
                            onChange={handleChange}
                            placeholder="e.g. 250000"
                        />
                    </div>

                    {!plan.isCash && (
                        <>
                            {/* Reserva */}
                            <div className="space-y-2">
                                <Label>Monto de Reserva</Label>
                                <Input
                                    type="number"
                                    name="reservationAmount"
                                    min="0"
                                    value={plan.reservationAmount || ''}
                                    onChange={handleChange}
                                    placeholder="e.g. 2500"
                                />
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
                                <Input
                                    type="number"
                                    name="downPaymentAmount"
                                    min="0"
                                    value={plan.downPaymentAmount || ''}
                                    onChange={handleChange}
                                    placeholder="e.g. 65000"
                                />
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

                    <div className="space-y-2 md:col-span-2">
                        <Label>Saldo Contra Entrega</Label>
                        <Input
                            type="number"
                            name="deliveryAmount"
                            min="0"
                            value={plan.deliveryAmount || ''}
                            onChange={handleChange}
                            placeholder="e.g. 170000"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
