'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Loader2 } from 'lucide-react';

interface Props {
    payload: Partial<ContractPayload>;
    setPayload: React.Dispatch<React.SetStateAction<Partial<ContractPayload>>>;
}

interface ApiProperty {
    id: number;
    project: string;
    projectId: number;
    unitNumber: string;
    level: string;
    squareMeters: number;
    rooms: number;
    bathrooms: number;
    basePrice: number;
    type: string;
}

export function PropertyForm({ payload, setPayload }: Props) {
    const property = payload.property;

    const [properties, setProperties] = useState<ApiProperty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/properties')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setProperties(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load CRM properties:', err);
                setLoading(false);
            });
    }, []);

    const projects = useMemo(() => {
        const unique = new Set(properties.map(p => p.project));
        return Array.from(unique).sort();
    }, [properties]);

    const availableUnits = useMemo(() => {
        if (!property?.project) return [];
        return properties.filter(p => p.project === property.project).sort((a, b) => a.unitNumber.localeCompare(b.unitNumber));
    }, [properties, property?.project]);

    const handleProjectChange = (val: string) => {
        setPayload(prev => ({
            ...prev,
            property: {
                ...prev.property,
                project: val,
                unitNumber: '', // Reset unit when project changes
            } as any
        }));
    };

    const handleUnitSelect = (unitNumber: string) => {
        const selected = availableUnits.find(u => u.unitNumber === unitNumber);
        if (selected) {
            setPayload(prev => ({
                ...prev,
                property: {
                    ...prev.property,
                    unitNumber: selected.unitNumber,
                    level: Number(selected.level) || 1, // Fallback safely
                    squareMeters: selected.squareMeters,
                    rooms: selected.rooms,
                    bathrooms: selected.bathrooms,
                } as any,
                // Automatically set the price in the payment plan as well!
                paymentPlan: {
                    ...(prev.paymentPlan as any),
                    basePrice: selected.basePrice,
                    totalPrice: selected.basePrice, // default total to base price initially
                }
            }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;
        const parsedValue = ['level', 'squareMeters', 'rooms', 'bathrooms'].includes(name) ? Number(value) : value;

        setPayload({
            ...payload,
            property: {
                ...payload.property,
                [name]: parsedValue,
            } as any
        });
    };

    if (!property) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Detalles del Inmueble
                    {loading && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />}
                </CardTitle>
                <CardDescription>
                    {loading ? 'Sincronizando con base de datos del CRM (SQLite)...' : 'Selecciona el proyecto y unidad directamente del inventario maestro.'}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Proyecto</Label>
                        <Select
                            value={property.project}
                            onValueChange={handleProjectChange}
                            disabled={loading || projects.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un proyecto" />
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map(p => (
                                    <SelectItem key={p} value={p}>{p}</SelectItem>
                                ))}
                                {projects.length === 0 && !loading && (
                                    <SelectItem value="MOCK">MOCK Project</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Unidad</Label>
                        {property.project ? (
                            <Select
                                value={property.unitNumber}
                                onValueChange={handleUnitSelect}
                                disabled={availableUnits.length === 0}
                            >
                                <SelectTrigger className={property.unitNumber ? "border-emerald-500 ring-1 ring-emerald-500" : ""}>
                                    <SelectValue placeholder="Selecciona la unidad (Ej. A-402)" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {availableUnits.map(u => (
                                        <SelectItem key={u.id} value={u.unitNumber}>
                                            {u.unitNumber} ({u.type}) - ${u.basePrice?.toLocaleString()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input disabled placeholder="Selecciona un proyecto primero" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Nivel / Piso</Label>
                        <Input
                            type="number"
                            name="level"
                            value={property.level || ''}
                            onChange={handleChange}
                            readOnly
                            className="bg-muted"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Metros Cuadrados (Totales)</Label>
                        <Input
                            type="number"
                            name="squareMeters"
                            value={property.squareMeters || ''}
                            onChange={handleChange}
                            readOnly
                            className="bg-muted"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Habitaciones</Label>
                        <Input
                            type="number"
                            name="rooms"
                            value={property.rooms || ''}
                            onChange={handleChange}
                            readOnly
                            className="bg-muted"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Baños</Label>
                        <Input
                            type="number"
                            name="bathrooms"
                            value={property.bathrooms || ''}
                            onChange={handleChange}
                            readOnly
                            className="bg-muted tracking-wide font-medium"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
