import { NextRequest, NextResponse } from 'next/server';
import { ContractPayload } from '@/types/contract';
import { renderToBuffer } from '@react-pdf/renderer';
import { ContractPDF } from '@/components/pdf/ContractPDF';
import { getDocumentFilename } from '@/utils/documentName';
import React from 'react';

export async function POST(req: NextRequest) {
    try {
        const payload: ContractPayload = await req.json();

        if (!payload.client || !payload.property || !payload.paymentPlan || !payload.clauses) {
            return NextResponse.json({ error: 'Invalid Payload' }, { status: 400 });
        }

        // Render the React component to a PDF buffer
        const pdfBuffer = await renderToBuffer(React.createElement(ContractPDF, { payload }) as any);

        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${getDocumentFilename(payload, 'pdf')}"`
            }
        });
    } catch (error: any) {
        console.error('PDF Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate contract PDF', details: error.message },
            { status: 500 }
        );
    }
}
