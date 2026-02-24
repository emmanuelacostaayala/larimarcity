'use client';

import { ContractPayload } from '@/types/contract';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface Props {
    payload: Partial<ContractPayload>;
    setPayload: React.Dispatch<React.SetStateAction<Partial<ContractPayload>>>;
}

export function ClausesForm({ payload, setPayload }: Props) {
    const clauses = payload.clauses;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;

        setPayload({
            ...payload,
            clauses: {
                ...payload.clauses,
                [name]: checked,
            } as any
        });
    };

    if (!clauses) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Special Clauses & Annexes</CardTitle>
                <CardDescription>Configure additional conditional clauses to inject into the contract.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <label className="flex items-start gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                    <input
                        type="checkbox"
                        name="earlyPaymentInterest"
                        checked={clauses.earlyPaymentInterest}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary accent-primary"
                    />
                    <div className="space-y-1">
                        <Label className="cursor-pointer">Early Payment Interest Clause</Label>
                        <p className="text-sm text-muted-foreground leading-snug">
                            Injects the "PAGO DE INTERESES POR PAGO ANTICIPADO" clause (7% annual interest) if the client chooses to pay ahead of the schedule.
                        </p>
                    </div>
                </label>

                <label className="flex items-start gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                    <input
                        type="checkbox"
                        name="golfMembership"
                        checked={clauses.golfMembership}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary accent-primary"
                    />
                    <div className="space-y-1">
                        <Label className="cursor-pointer">Golf Club Membership</Label>
                        <p className="text-sm text-muted-foreground leading-snug">
                            Injects the Golf Club terms and membership details. Applicable mainly for units bordering the golf course.
                        </p>
                    </div>
                </label>

                <label className="flex items-start gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                    <input
                        type="checkbox"
                        name="qualityMemory"
                        checked={clauses.qualityMemory}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary accent-primary"
                    />
                    <div className="space-y-1">
                        <Label className="cursor-pointer">Include Quality Memory Annex</Label>
                        <p className="text-sm text-muted-foreground leading-snug">
                            Automatically appends the standard "Memoria de Calidades" for the selected project model at the end of the PDF.
                        </p>
                    </div>
                </label>
            </CardContent>
        </Card>
    );
}
