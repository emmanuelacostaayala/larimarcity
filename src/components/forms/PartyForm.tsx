'use client';

import { useState } from 'react';
import { ContractPayload, PhysicalPerson } from '@/types/contract';
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
    const [hasCoSigner, setHasCoSigner] = useState(!!(payload.coSigner));

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

    const handleRepresentativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPayload({
            ...payload,
            client: {
                ...payload.client,
                legalRepresentative: {
                    ...(payload.client as any).legalRepresentative,
                    [name]: value
                }
            } as any
        });
    };

    const handleRepresentativeSelectChange = (name: string, value: string) => {
        setPayload({
            ...payload,
            client: {
                ...payload.client,
                legalRepresentative: {
                    ...(payload.client as any).legalRepresentative,
                    [name]: value
                }
            } as any
        });
    };

    const handleCoSignerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPayload({
            ...payload,
            coSigner: {
                ...(payload.coSigner as any),
                [name]: value,
            } as any
        });
    };

    const handleCoSignerSelectChange = (name: string, value: string) => {
        setPayload({
            ...payload,
            coSigner: {
                ...(payload.coSigner as any),
                [name]: value,
            } as any
        });
    };

    const handleTopLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPayload({ ...payload, [name]: value });
    };

    const toggleCoSigner = (enabled: boolean) => {
        setHasCoSigner(enabled);
        if (!enabled) {
            setPayload({ ...payload, coSigner: undefined });
        } else {
            setPayload({
                ...payload,
                coSigner: {
                    type: 'Fisica',
                    name: '',
                    documentType: 'Pasaporte',
                    documentNumber: '',
                    civilStatus: 'Soltero',
                    nationality: '',
                    address: '',
                } as PhysicalPerson
            });
        }
    };

    if (!client) return null;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Datos del Beneficiario (Cliente)</CardTitle>
                    <CardDescription>Datos personales o de empresa del comprador.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Type selector */}
                        <div className="space-y-2">
                            <Label>Tipo de Parte</Label>
                            <Select
                                value={client.type}
                                onValueChange={(val) => handleSelectChange('type', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Fisica">Persona Física</SelectItem>
                                    <SelectItem value="Sociedad">Sociedad / Empresa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Nombre Completo {client.type === 'Sociedad' ? '/ Razón Social' : ''}</Label>
                            <Input
                                type="text"
                                name="name"
                                value={client.name || ''}
                                onChange={handleChange}
                                placeholder="Ej. Juan García López"
                            />
                        </div>

                        {client.type === 'Fisica' ? (
                            <>
                                <div className="space-y-2">
                                    <Label>Tipo de Documento</Label>
                                    <Select
                                        value={(client as any).documentType || 'Pasaporte'}
                                        onValueChange={(val) => handleSelectChange('documentType', val)}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                                            <SelectItem value="DNI">DNI</SelectItem>
                                            <SelectItem value="Cedula">Cédula</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Número de Documento</Label>
                                    <Input
                                        type="text"
                                        name="documentNumber"
                                        value={(client as any).documentNumber || ''}
                                        onChange={handleChange}
                                        placeholder="Ej. PAU657213"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Nacionalidad</Label>
                                    <Input
                                        type="text"
                                        name="nationality"
                                        value={(client as any).nationality || ''}
                                        onChange={handleChange}
                                        placeholder="Ej. Española, Dominicana"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Estado Civil</Label>
                                    <Select
                                        value={(client as any).civilStatus || 'Soltero'}
                                        onValueChange={(val) => handleSelectChange('civilStatus', val)}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Soltero">Soltero/a</SelectItem>
                                            <SelectItem value="Casado">Casado/a</SelectItem>
                                            <SelectItem value="Divorciado">Divorciado/a</SelectItem>
                                            <SelectItem value="Viudo">Viudo/a</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label>RNC / CIF</Label>
                                    <Input
                                        type="text"
                                        name="rncCif"
                                        value={(client as any).rncCif || ''}
                                        onChange={handleChange}
                                        placeholder="RNC de la Empresa"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2 mt-2 pt-4 border-t border-border/50">
                                    <Label className="text-muted-foreground text-xs uppercase tracking-wider block mb-2">Datos del Representante Legal</Label>
                                </div>

                                <div className="space-y-2">
                                    <Label>Nombre del Representante</Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={(client as any).legalRepresentative?.name || ''}
                                        onChange={handleRepresentativeChange}
                                        placeholder="Nombre de quien firma"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Tipo Doc. Representante</Label>
                                    <Select
                                        value={(client as any).legalRepresentative?.documentType || 'Pasaporte'}
                                        onValueChange={(val) => handleRepresentativeSelectChange('documentType', val)}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                                            <SelectItem value="DNI">DNI</SelectItem>
                                            <SelectItem value="Cedula">Cédula</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>N° Documento Representante</Label>
                                    <Input
                                        type="text"
                                        name="documentNumber"
                                        value={(client as any).legalRepresentative?.documentNumber || ''}
                                        onChange={handleRepresentativeChange}
                                        placeholder="Número de identidad"
                                    />
                                </div>
                            </>
                        )}

                        {/* Contact */}
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                name="email"
                                value={client.email || ''}
                                onChange={handleChange}
                                placeholder="cliente@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>WhatsApp / Teléfono</Label>
                            <Input
                                type="tel"
                                name="phone"
                                value={client.phone || ''}
                                onChange={handleChange}
                                placeholder="+34 600 000 000"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label>Domicilio</Label>
                            <Input
                                type="text"
                                name="address"
                                value={client.address || ''}
                                onChange={handleChange}
                                placeholder="Calle, Ciudad, País"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Co-signer section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Segundo Firmante (Co-Beneficiario)</CardTitle>
                            <CardDescription>Pareja, cónyuge o co-comprador. Aparecerá junto al cliente en el contrato.</CardDescription>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={hasCoSigner}
                                onChange={e => toggleCoSigner(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary"
                            />
                            <span className="text-sm font-medium">Agregar 2° firmante</span>
                        </label>
                    </div>
                </CardHeader>
                {hasCoSigner && payload.coSigner && (
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Nombre Completo</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={payload.coSigner.name || ''}
                                    onChange={handleCoSignerChange}
                                    placeholder="Ej. María Torres"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tipo de Documento</Label>
                                <Select
                                    value={payload.coSigner.documentType || 'Pasaporte'}
                                    onValueChange={(val) => handleCoSignerSelectChange('documentType', val)}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                                        <SelectItem value="DNI">DNI</SelectItem>
                                        <SelectItem value="Cedula">Cédula</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Número de Documento</Label>
                                <Input
                                    type="text"
                                    name="documentNumber"
                                    value={payload.coSigner.documentNumber || ''}
                                    onChange={handleCoSignerChange}
                                    placeholder="Ej. PAU657213"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Nacionalidad</Label>
                                <Input
                                    type="text"
                                    name="nationality"
                                    value={payload.coSigner.nationality || ''}
                                    onChange={handleCoSignerChange}
                                    placeholder="Ej. Española"
                                />
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Broker / Seller */}
            <Card>
                <CardHeader>
                    <CardTitle>Comercial</CardTitle>
                    <CardDescription>Broker y vendedor responsable de esta venta (para el registro interno).</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Broker</Label>
                            <Input
                                type="text"
                                name="broker"
                                value={payload.broker || ''}
                                onChange={handleTopLevelChange}
                                placeholder="Nombre del broker"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Vendedor / Closer</Label>
                            <Input
                                type="text"
                                name="seller"
                                value={payload.seller || ''}
                                onChange={handleTopLevelChange}
                                placeholder="Nombre del closer"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
