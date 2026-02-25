import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const properties = await prisma.data_entry_propiedad.findMany({
            where: {
                estado: 'libre' // Only fetch available units
            },
            select: {
                id: true,
                proyecto_id: true,
                apartamento: true,
                codigo: true,
                nivel: true,
                m2_totales: true,
                area: true,
                habitaciones: true,
                banos: true,
                precio: true,
                tipo: true,
                data_entry_proyecto: {
                    select: {
                        nombre: true
                    }
                }
            }
        });

        const formatted = properties.map(p => ({
            id: p.id,
            project: p.data_entry_proyecto?.nombre || 'General',
            projectId: p.proyecto_id,
            unitNumber: p.apartamento || p.codigo || '',
            level: p.nivel || '',
            squareMeters: Number(p.m2_totales) || Number(p.area) || 0, // Fallback to area if m2_totales is null
            rooms: p.habitaciones || 0,
            bathrooms: p.banos || 0,
            basePrice: Number(p.precio) || 0,
            type: p.tipo || 'Apartamento',
        }));

        // Group by project for easier frontend rendering if needed
        // Or just return the flat list and let frontend handle it.

        return NextResponse.json(formatted);
    } catch (error: any) {
        console.error('Failed to fetch properties:', error);
        return NextResponse.json({ error: 'Failed to fetch properties', details: error.message }, { status: 500 });
    }
}
