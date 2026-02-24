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

export function PartyForm({ payload, setPayload }: Props) {
    const client = payload.client;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPayload({
            ...payload,
            client: {
                ...payload.client,
                [name]: value,
            } as any
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        setPayload({
            ...payload,
            client: {
                ...payload.client,
                [name]: value,
            } as any
        });
    };

    if (!client) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Client Details</CardTitle>
                <CardDescription>Enter the personal or company details for the contract.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Party Type</Label>
                        <Select
                            value={client.type}
                            onValueChange={(val) => handleSelectChange('type', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select party type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Fisica">Physical Person</SelectItem>
                                <SelectItem value="Sociedad">Company</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Full Name / Company Name</Label>
                        <Input
                            type="text"
                            name="name"
                            value={client.name || ''}
                            onChange={handleChange}
                            placeholder="John Doe or Acme Corp"
                        />
                    </div>

                    {client.type === 'Fisica' ? (
                        <>
                            <div className="space-y-2">
                                <Label>Document Type</Label>
                                <Select
                                    value={(client as any).documentType || 'Pasaporte'}
                                    onValueChange={(val) => handleSelectChange('documentType', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select document type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                                        <SelectItem value="DNI">DNI</SelectItem>
                                        <SelectItem value="Cedula">Cédula</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Document Number</Label>
                                <Input
                                    type="text"
                                    name="documentNumber"
                                    value={(client as any).documentNumber || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Nationality</Label>
                                <Input
                                    type="text"
                                    name="nationality"
                                    value={(client as any).nationality || ''}
                                    onChange={handleChange}
                                    placeholder="Dominican, Spanish..."
                                />
                            </div>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <Label>RNC / CIF</Label>
                            <Input
                                type="text"
                                name="rncCif"
                                value={(client as any).rncCif || ''}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="space-y-2 md:col-span-2">
                        <Label>Address</Label>
                        <Input
                            type="text"
                            name="address"
                            value={client.address || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
