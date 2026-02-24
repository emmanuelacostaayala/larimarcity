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

export function PropertyForm({ payload, setPayload }: Props) {
    const property = payload.property;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;
        // Parse numbers
        const parsedValue = ['level', 'squareMeters', 'rooms', 'bathrooms'].includes(name) ? Number(value) : value;

        setPayload({
            ...payload,
            property: {
                ...payload.property,
                [name]: parsedValue,
            } as any
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        setPayload({
            ...payload,
            property: {
                ...payload.property,
                [name]: value,
            } as any
        });
    };

    if (!property) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>Specify the unit information within Larimar City.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Project</Label>
                        <Select
                            value={property.project}
                            onValueChange={(val) => handleSelectChange('project', val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Prime Towers">Prime Towers</SelectItem>
                                <SelectItem value="Breeze Towers">Breeze Towers</SelectItem>
                                <SelectItem value="Townhouses">Townhouses</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Unit Number</Label>
                        <Input
                            type="text"
                            name="unitNumber"
                            value={property.unitNumber || ''}
                            onChange={handleChange}
                            placeholder="e.g. A-401"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Level / Floor</Label>
                        <Input
                            type="number"
                            name="level"
                            value={property.level || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Square Meters</Label>
                        <Input
                            type="number"
                            name="squareMeters"
                            min="1"
                            value={property.squareMeters || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Rooms</Label>
                        <Input
                            type="number"
                            name="rooms"
                            value={property.rooms || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Bathrooms</Label>
                        <Input
                            type="number"
                            name="bathrooms"
                            value={property.bathrooms || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
