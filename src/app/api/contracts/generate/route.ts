import { NextRequest, NextResponse } from 'next/server';
import { ContractPayload } from '@/types/contract';
import { getDocumentFilename } from '@/utils/documentName';
import { generateDocxBuffer } from '@/utils/docxGenerator';
import JSZip from 'jszip';
import * as xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

async function generateFianzaBuffer(payload: ContractPayload): Promise<Uint8Array> {
    const templatePath = path.join(process.cwd(), 'src', 'templates', 'Fianza_Base.xls');

    if (!fs.existsSync(templatePath)) {
        console.warn('Fianza Excel template not found at', templatePath);
        return new Uint8Array();
    }

    const workbook = xlsx.readFile(templatePath);
    const sheetName = 'SOLICITUD FIANZA SF';
    const worksheet = workbook.Sheets[sheetName];

    if (worksheet) {
        const c = payload.client as any;
        const clientName = payload.client.type === 'Fisica' ? c.name : c.companyName;
        const clientId = payload.client.type === 'Fisica' ? c.documentNumber : c.rncCif;

        // Beneficiary Name and ID
        worksheet['D47'] = { t: 's', v: `${clientName} / ${clientId}` };

        // Calculate USD Insurance Value
        const pay = payload.paymentPlan;
        const cuotaBase = pay.totalPrice - (pay.reservationAmount || 0) - (pay.downPaymentAmount || 0) - (pay.deliveryAmount || 0);
        const calcCuotas = pay.constructionInstallments > 0 ? cuotaBase : 0;

        const construccionAmount = (pay.reservationAmount || 0) + (pay.downPaymentAmount || 0) + calcCuotas;
        const exchangeRate = pay.currency === 'EUR' ? (pay.exchangeRate || 1.05) : 1;

        const fianzaUsd = construccionAmount * exchangeRate;
        worksheet['D49'] = { t: 'n', v: Number(fianzaUsd.toFixed(2)) };

        // Total Value in USD
        const totalUsd = pay.totalPrice * exchangeRate;
        worksheet['H49'] = { t: 'n', v: Number(totalUsd.toFixed(2)) };

        // Property Description
        const desc = `${payload.property.project}, Unidad ${payload.property.unitNumber}, Nivel ${payload.property.level}, ${payload.property.squareMeters} Mts2, Valor ${Number(totalUsd.toFixed(2))} USD, Ubicado en Proyecto LARIMAR CITY & RESORT`;
        worksheet['A54'] = { t: 's', v: desc };
    }

    // Free sheetjs doesn't write .xls, so we write .xlsx
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return buffer;
}

export async function POST(req: NextRequest) {
    try {
        const payload: ContractPayload = await req.json();

        if (!payload.client || !payload.property || !payload.paymentPlan || !payload.clauses) {
            return NextResponse.json({ error: 'Invalid Payload' }, { status: 400 });
        }

        // 1. Generate DOCX
        let docxBuffer: Uint8Array;
        try {
            docxBuffer = await generateDocxBuffer(payload);
        } catch (docxErr: any) {
            console.error('DOCX Generation Error:', docxErr);
            return NextResponse.json({ error: 'Failed to generate DOCX', details: docxErr.message }, { status: 500 });
        }

        // 2. Generate Excel Fianza (optional, silently skip if missing)
        let fianzaBuffer: Uint8Array = new Uint8Array();
        try {
            fianzaBuffer = await generateFianzaBuffer(payload);
        } catch (fianzaErr: any) {
            console.warn('Fianza Excel generation skipped:', fianzaErr.message);
        }

        // 3. Create ZIP archive
        const zip = new JSZip();

        const docxName = getDocumentFilename(payload, 'docx');
        const fianzaName = `Fianza_Alliance_${payload.property.unitNumber}.xlsx`;

        zip.file(docxName, docxBuffer);

        if (fianzaBuffer.length > 0) {
            zip.file(fianzaName, fianzaBuffer);
        }

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        const zipFilename = `Contrato_Larimar_${payload.property.unitNumber}.zip`;

        return new NextResponse(zipBuffer as unknown as BodyInit, {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${zipFilename}"`
            }
        });
    } catch (error: any) {
        console.error('ZIP Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate contract ZIP', details: error.message },
            { status: 500 }
        );
    }
}
