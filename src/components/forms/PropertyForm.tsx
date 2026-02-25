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

const MAINTENANCE_RATE = 2; // $2 USD per interior m²

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
                unitNumber: '',
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
                    level: Number(selected.level) || 1,
                    squareMeters: selected.squareMeters,
                    interiorSqMeters: (prev.property as any)?.interiorSqMeters || 0,
                    terraceSqMeters: (prev.property as any)?.terraceSqMeters || 0,
                    rooms: selected.rooms,
                    bathrooms: selected.bathrooms,
                } as any,
                paymentPlan: {
                    ...(prev.paymentPlan as any),
                    basePrice: selected.basePrice,
                    totalPrice: selected.basePrice,
                }
            }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;
        const numericFields = ['level', 'squareMeters', 'interiorSqMeters', 'terraceSqMeters', 'rooms', 'bathrooms', 'airConditioners', 'parkingSpaces', 'loteSqMeters', 'level1SqMeters', 'level2SqMeters'];
        const parsedValue = numericFields.includes(name) ? Number(value) : value;

        setPayload({
            ...payload,
            property: {
                ...payload.property,
                [name]: parsedValue,
            } as any
        });
    };

    const handlePropertyTypeChange = (val: string) => {
        setPayload({
            ...payload,
            property: {
                ...payload.property,
                propertyType: val,
            } as any
        });
    };

    if (!property) return null;

    const interiorSqM = (property as any).interiorSqMeters || 0;
    const terraceSqM = (property as any).terraceSqMeters || 0;
    const maintenanceMensual = interiorSqM * MAINTENANCE_RATE;
    const propertyType = (property as any).propertyType || 'Apartamento';
    const isVilla = propertyType === 'Villa';

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Detalles del Inmueble
                    {loading && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />}
                </CardTitle>
                <CardDescription>
                    {loading ? 'Sincronizando con base de datos del CRM...' : 'Selecciona el proyecto y unidad directamente del inventario maestro.'}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Tipo de propiedad */}
                    <div className="space-y-2">
                        <Label>Tipo de Inmueble</Label>
                        <Select value={propertyType} onValueChange={handlePropertyTypeChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Apartamento">🏢 Apartamento</SelectItem>
                                <SelectItem value="Villa">🏡 Villa</SelectItem>
                                <SelectItem value="TownHouse">🏘️ Town House</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Proyecto */}
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

                    {/* Unidad */}
                    <div className="space-y-2">
                        <Label>Unidad</Label>
                        {property.project ? (
                            <Select
                                value={property.unitNumber}
                                onValueChange={handleUnitSelect}
                                disabled={availableUnits.length === 0}
                            >
                                <SelectTrigger className={property.unitNumber ? "border-emerald-500 ring-1 ring-emerald-500" : ""}>
                                    <SelectValue placeholder="Selecciona la unidad" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {availableUnits.map(u => (
                                        <SelectItem key={u.id} value={u.unitNumber}>
                                            {u.unitNumber} — ${u.basePrice?.toLocaleString()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input disabled placeholder="Selecciona un proyecto primero" />
                        )}
                    </div>

                    {/* Nivel */}
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

                    {/* Villa fields */}
                    {isVilla && (
                        <>
                            <div className="space-y-2">
                                <Label>Número de Lote</Label>
                                <Input
                                    type="text"
                                    name="loteNumber"
                                    value={(property as any).loteNumber || ''}
                                    onChange={handleChange}
                                    placeholder="Ej. Lote 8"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>m² del Lote (Parcela)</Label>
                                <Input
                                    type="number"
                                    name="loteSqMeters"
                                    value={(property as any).loteSqMeters || ''}
                                    onChange={handleChange}
                                    placeholder="450"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>m² Primer Nivel</Label>
                                <Input
                                    type="number"
                                    name="level1SqMeters"
                                    value={(property as any).level1SqMeters || ''}
                                    onChange={handleChange}
                                    placeholder="m² planta baja"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>m² Segundo Nivel (si aplica)</Label>
                                <Input
                                    type="number"
                                    name="level2SqMeters"
                                    value={(property as any).level2SqMeters || ''}
                                    onChange={handleChange}
                                    placeholder="m² piso 2"
                                />
                            </div>
                        </>
                    )}

                    {/* m² breakdown */}
                    <div className="space-y-2">
                        <Label>m² Totales (construidos)</Label>
                        <Input
                            type="number"
                            name="squareMeters"
                            value={property.squareMeters || ''}
                            onChange={handleChange}
                            className="bg-muted"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>m² Terraza / Balcón</Label>
                        <Input
                            type="number"
                            name="terraceSqMeters"
                            value={(property as any).terraceSqMeters || ''}
                            onChange={handleChange}
                            placeholder="Ej. 17.43"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>m² Interior (para mantenimiento)</Label>
                        <Input
                            type="number"
                            name="interiorSqMeters"
                            value={(property as any).interiorSqMeters || ''}
                            onChange={handleChange}
                            placeholder="Ej. 53.53"
                        />
                    </div>

                    {/* Rooms / Bathrooms / AC */}
                    <div className="space-y-2">
                        <Label>Habitaciones</Label>
                        <Input
                            type="number"
                            name="rooms"
                            value={property.rooms || ''}
                            onChange={handleChange}
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
                            className="bg-muted"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Aires Acondicionados</Label>
                        <Input
                            type="number"
                            name="airConditioners"
                            value={(property as any).airConditioners || ''}
                            onChange={handleChange}
                            placeholder="Ej. 2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Parqueos</Label>
                        <Input
                            type="number"
                            name="parkingSpaces"
                            value={(property as any).parkingSpaces || ''}
                            onChange={handleChange}
                            placeholder="Ej. 1"
                        />
                    </div>

                    {/* Maintenance summary */}
                    {interiorSqM > 0 && (
                        <div className="md:col-span-2 p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 space-y-1">
                            <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">🏠 Mantenimiento estimado (Art. UNDÉCIMO)</p>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{interiorSqM} m² interiores × ${MAINTENANCE_RATE} USD</span>
                                <span className="font-bold text-sky-700 dark:text-sky-300">${maintenanceMensual.toLocaleString('es-DO', { minimumFractionDigits: 2 })}/mes + impuestos</span>
                            </div>
                            {terraceSqM > 0 && (
                                <p className="text-xs text-muted-foreground">Terraza ({terraceSqM} m²) no incluida en la base de mantenimiento.</p>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
