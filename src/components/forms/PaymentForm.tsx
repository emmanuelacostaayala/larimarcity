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
        const finalValue = type === 'checkbox' ? checked : (['totalPrice', 'reservationAmount', 'downPaymentAmount', 'deliveryAmount'].includes(name) ? Number(value) : value);

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
                <CardTitle>Payment Plan</CardTitle>
                <CardDescription>Define the financial terms of the contract.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Currency</Label>
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
                            <span className="text-sm font-medium">100% Cash Payment (No installments)</span>
                        </label>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label>Total Price</Label>
                        <Input
                            type="number"
                            name="totalPrice"
                            min="0"
                            value={plan.totalPrice || ''}
                            onChange={handleChange}
                        />
                    </div>

                    {!plan.isCash && (
                        <>
                            <div className="space-y-2">
                                <Label>Reservation Amount</Label>
                                <Input
                                    type="number"
                                    name="reservationAmount"
                                    min="0"
                                    value={plan.reservationAmount || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Down Payment Amount (Inicial)</Label>
                                <Input
                                    type="number"
                                    name="downPaymentAmount"
                                    min="0"
                                    value={plan.downPaymentAmount || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    <div className="space-y-2 md:col-span-2">
                        <Label>Balance Against Delivery (Saldo Contra Entrega)</Label>
                        <Input
                            type="number"
                            name="deliveryAmount"
                            min="0"
                            value={plan.deliveryAmount || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
