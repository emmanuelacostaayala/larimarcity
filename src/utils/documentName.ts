import { ContractPayload } from '../types/contract';

export function getDocumentFilename(payload: ContractPayload, ext: 'pdf' | 'docx'): string {
    const currencyStr = payload.paymentPlan.currency === 'EUR' ? 'EUROS' : 'USD';
    const baseName = 'CONTRATO_OPCION_COMPRA_LARIMAR';

    // Parse Project
    let projAbbr = payload.property.project.toUpperCase();
    if (projAbbr.includes('BREEZE') || projAbbr === 'BT') projAbbr = 'BT';
    else if (projAbbr.includes('PRIME') || projAbbr === 'PT') projAbbr = 'PT';
    else if (projAbbr.includes('PARADISE') || projAbbr === 'PP') projAbbr = 'PP';
    else if (projAbbr.includes('HILLS') || projAbbr === 'TH') projAbbr = 'TH';
    else projAbbr = projAbbr.substring(0, 3).toUpperCase(); // Fallback

    // Parse Unit Number
    let unit = payload.property.unitNumber.toUpperCase();
    if (!unit.startsWith('AP')) {
        unit = `AP${unit}`;
    }

    // Check if Vacation Rental Clause is active
    const isRent = payload.clauses?.vacationRental === true;

    // Build final name: ESPAÑOL_EUROS_CONTRATO_OPCION_COMPRA_LARIMAR_PXX_APXXXX_RENT
    let fileName = `ESPAÑOL_${currencyStr}_${baseName}_${projAbbr}_${unit}`;

    if (isRent) {
        fileName += '_RENT';
    }

    return `${fileName}.${ext}`;
}
