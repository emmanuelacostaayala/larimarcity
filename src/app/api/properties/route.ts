import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const properties = await prisma.data_entry_propiedad.findMany({
            where: {
                estado: 'libre'
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
            squareMeters: Number(p.m2_totales) || Number(p.area) || 0,
            rooms: p.habitaciones || 0,
            bathrooms: p.banos || 0,
            basePrice: Number(p.precio) || 0,
            type: p.tipo || 'Apartamento',
        }));

        return NextResponse.json(formatted);

    } catch (error: any) {
        // Detailed logging — check Vercel Functions → Logs after deploying
        console.error('[/api/properties] PRODUCTION ERROR:', {
            message: error.message,
            code: error.code,              // P1001 = can't connect to DB, P1003 = schema missing
            hasDatabaseUrl: !!process.env.DATABASE_URL,
            databaseUrlPreview: process.env.DATABASE_URL?.substring(0, 30) + '...',
            nodeEnv: process.env.NODE_ENV,
        });
        return NextResponse.json(
            { error: 'Failed to fetch properties', details: error.message, code: error.code },
            { status: 500 }
        );
    }
}
