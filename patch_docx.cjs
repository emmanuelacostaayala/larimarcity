/**
 * COMPREHENSIVE FINAL patch_docx.cjs
 * Applies ALL 6 docxGenerator changes to the clean git-restored file (842 lines).
 * Must be run ONCE on the clean file. All subsequent runs will fail the line count check.
 */
const fs = require('fs');
const filePath = 'src/utils/docxGenerator.ts';
const raw = fs.readFileSync(filePath, 'utf8');
const lines = raw.split('\r\n');

console.log('Input file lines:', lines.length, '(must be 842)');
if (lines.length !== 842) {
    console.error('Aborting: expected 842 clean git lines, got', lines.length);
    process.exit(1);
}

// PATCH MAP (all 0-indexed line numbers pointing to the clean file):
//
// A: Lines 70-100 → coSigner variable + renderBeneficiarioParagraph
// B: Line 212 → single property description TextRun → 3 TextRuns
// C: Line 502 → p.squareMeters in TextRun → interiorSqMeters
// D: Lines 356-363 → insert EUR bank info before TERCERO_PARRAFO_VIII para
// E: Lines 566-574 → replace D_QUINTO Paragraph with IIFE at section level
// F: Line ~749 → insert coSigner spread into signature TableCell children

// ─── PATCH A: coSigner variable + renderBeneficiarioParagraph ────────────────
// Replace lines 70-100 (0-indexed)
lines.splice(70, 31,
    '        const coSigner = payload.coSigner;',
    '',
    '        const renderBeneficiarioParagraph = () => {',
    "            if (c.type === 'Fisica') {",
    '                const coSignerRuns = coSigner ? [',
    '                    new TextRun(", y "),',
    '                    new TextRun({ text: coSigner.name, bold: true }),',
    "                    new TextRun(`, de nacionalidad ${coSigner.nationality}, mayor de edad, con ${coSigner.documentType} N\\u00ba `),",
    '                    new TextRun({ text: coSigner.documentNumber, bold: true }),',
    '                ] : [];',
    '                return new Paragraph({',
    '                    alignment: AlignmentType.JUSTIFIED,',
    '                    spacing: { after: 200 },',
    '                    children: [',
    '                        new TextRun("Y por la otra parte, "),',
    '                        new TextRun({ text: c.name, bold: true }),',
    "                        new TextRun(`, de nacionalidad ${c.nationality}, mayor de edad, con ${c.documentType} N\\u00ba `),",
    '                        new TextRun({ text: c.documentNumber, bold: true }),',
    '                        ...coSignerRuns,',
    "                        new TextRun(`, domiciliados en ${c.address}, y quienes en lo sucesivo para el presente contrato se denominar\\u00e1n \"EL BENEFICIARIO\" o por su propio nombre.`)",
    '                    ]',
    '                });',
    '            } else {',
    '                return new Paragraph({',
    '                    alignment: AlignmentType.JUSTIFIED,',
    '                    spacing: { after: 200 },',
    '                    children: [',
    '                        new TextRun("Y por la otra parte, "),',
    '                        new TextRun({ text: c.name, bold: true }),',
    "                        new TextRun(`, sociedad mercantil organizada bajo las leyes, RNC/CIF N\\u00ba `),",
    '                        new TextRun({ text: c.rncCif, bold: true }),',
    '                        new TextRun(`, con domicilio en ${c.address}, representada por `),',
    "                        new TextRun({ text: c.legalRepresentative?.name || \"\", bold: true }),",
    "                        new TextRun(`, provisto de ${c.legalRepresentative?.documentType} N\\u00ba `),",
    "                        new TextRun({ text: c.legalRepresentative?.documentNumber || \"\", bold: true }),",
    "                        new TextRun(`, y quienes en lo sucesivo para el presente contrato se denominar\\u00e1n \"EL BENEFICIARIO\" o por su propio nombre.`)",
    '                    ]',
    '                });',
    '            }',
    '        };'
);
console.log('OK A: coSigner var + renderBeneficiarioParagraph');

// After A: replaced 31 lines with 38 → net +7 shift
const shiftA = 38 - 31; // +7

// ─── PATCH B: Property description — split TextRun (line 212+shiftA = 219 in new) ─
// Original line 212 (0-indexed) was the single long TextRun inside the project/unit Paragraph
const lineBIdx = 212 + shiftA; // 219
const lineB = lines[lineBIdx];
if (lineB && lineB.includes('m2 de construcci')) {
    lines.splice(lineBIdx, 1,
        '                            new TextRun(`, ubicado en el nivel ${p.level} con una extensi\u00f3n superficial total de `),',
        '                            new TextRun({ text: `${p.squareMeters} m\u00b2`, bold: true }),',
        '                            new TextRun(` de construcci\u00f3n.${(p as any).terraceSqMeters ? ` La superficie construida incluye una terraza de ${(p as any).terraceSqMeters} m\u00b2.` : \'\'} Dicho inmueble consta de ${p.rooms} habitaci\u00f3n(es), ${p.bathrooms} ba\u00f1o(s)${(p as any).airConditioners ? `, ${(p as any).airConditioners} aire(s) acondicionado(s)` : \'\'}, \u00e1rea de cocina, \u00e1rea de lavado, dentro del Proyecto denominado "LARIMAR CITY & RESORT".\`)'
    );
    console.log('OK B: Property description m\u00b2 split');
} else {
    console.log('SKIP B: line', lineBIdx + 1, 'content:', JSON.stringify((lineB || '').substring(0, 80)));
}
const shiftB = 2; // added 2 extra lines

// ─── PATCH C: UNDECIMO interiorSqMeters (line 502+7+2 = 511) ─────────────────
const lineCIdx = 502 + shiftA + shiftB; // 511
const lineC = lines[lineCIdx];
if (lineC && lineC.includes('p.squareMeters')) {
    lines[lineCIdx] = lineC.replace(
        'new TextRun(` ${p.squareMeters} `)',
        'new TextRun({ text: ` ${((p as any).interiorSqMeters || p.squareMeters)} `, bold: true })'
    );
    console.log('OK C: UNDECIMO interiorSqMeters');
} else {
    // brute-force search around expected area
    let found = false;
    for (let i = 505; i < 525; i++) {
        if (lines[i] && lines[i].includes('p.squareMeters') && lines[i].includes('TextRun(')) {
            lines[i] = lines[i].replace(
                'new TextRun(` ${p.squareMeters} `)',
                'new TextRun({ text: ` ${((p as any).interiorSqMeters || p.squareMeters)} `, bold: true })'
            );
            console.log('OK C (shifted): UNDECIMO interiorSqMeters at line', i + 1);
            found = true;
            break;
        }
    }
    if (!found) console.log('SKIP C: squareMeters in UNDECIMO not found');
}

// ─── PATCH D: EUR Santander bank info (insert before TERCERO_PARRAFO_VIII) ────
// Clean line index for TERCERO_PARRAFO_VIII:  approx 357-362 range
// After A+B shifts: approx 357+7+2 = 366
{
    let insertAt = -1;
    for (let i = 360; i < 380; i++) {
        if (lines[i] && lines[i].includes('TERCERO_PARRAFO_VIII')) {
            for (let j = i - 1; j >= i - 6; j--) {
                if (lines[j] && lines[j].trimStart().startsWith('new Paragraph(')) {
                    insertAt = j;
                    break;
                }
            }
            break;
        }
    }
    if (insertAt === -1) {
        console.log('SKIP D: TERCERO_PARRAFO_VIII not found in range 360-380');
    } else {
        const bankLines = [
            '                    ...(pay.currency === \'EUR\' ? [',
            '                        new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 100 }, children: [new TextRun({ text: "Banco beneficiario:", bold: true })] }),',
            '                        new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 }, children: [new TextRun("Banco SANTANDER, S. A.")] }),',
            '                        new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 }, children: [new TextRun("C. de Ferraz, 43, Moncloa \u2013 Aravaca, 28008 Madrid, Espa\u00f1a")] }),',
            '                        new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 }, children: [new TextRun("SWIFT: BSCHESMMXXX")] }),',
            '                        new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 }, children: [new TextRun("IBAN: ES27 0049 6660 7827 1630 0554")] }),',
            '                        new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 }, children: [new TextRun({ text: "Beneficiario: INGENIERIA Y ESTRUCTURAS DEL CARIBE, INECAR, S.R.L.", bold: true })] }),',
            '                        new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200 }, children: [new TextRun("RNC: 1-32-43471-4 | Boulevard 1\u00ba de Noviembre No. 801, Aqua Business Center, Punta Cana Village, Punta Cana, La Altagracia, Rep\u00fablica Dominicana.")] }),',
            '                    ] : []),',
        ];
        lines.splice(insertAt, 0, ...bankLines);
        console.log('OK D: Santander EUR bank info inserted at line', insertAt + 1);
    }
}
const shiftD = 9;

// ─── PATCH E: D_QUINTO Paragraph → IIFE at section level ─────────────────────
// Clean file: D_QUINTO Paragraph starts at 566 (0-indexed)
// After all shifts: 566 + 7 + 2 + 9 = 584
{
    let paraStart = -1, paraEnd = -1;
    for (let i = 580; i < 600; i++) {
        if (lines[i] && lines[i].includes('D_QUINTO_BODY_1')) {
            for (let j = i - 1; j >= i - 5; j--) {
                if (lines[j] && lines[j].trimStart().startsWith('new Paragraph(')) { paraStart = j; break; }
            }
            // Find the ]), that closes THIS paragraph's children array
            for (let j = i + 1; j <= i + 6; j++) {
                if (lines[j] && lines[j].trim() === ']),') { paraEnd = j; break; }
            }
            break;
        }
    }
    if (paraStart === -1 || paraEnd === -1) {
        console.log('SKIP E: D_QUINTO Paragraph range not found. paraStart:', paraStart, 'paraEnd:', paraEnd);
    } else {
        const count = paraEnd - paraStart + 1;
        const iife = [
            '                    (() => {',
            '                        const fianzaBase = pay.totalPrice - pay.deliveryAmount;',
            '                        const rate = pay.exchangeRate || 1.05;',
            '                        const fianzaUSD = fianzaBase * rate;',
            "                        if (pay.currency === 'EUR') {",
            '                            return new Paragraph({',
            '                                alignment: AlignmentType.JUSTIFIED,',
            '                                spacing: { after: 200 },',
            '                                children: [',
            '                                    new TextRun(t.D_QUINTO_BODY_1),',
            '                                    new TextRun({ text: legalAmount(fianzaBase), bold: true }),',
            '                                    new TextRun(t.D_QUINTO_BODY_2),',
            "                                    new TextRun(` Esta fianza ser\\u00e1 emitida en d\\u00f3lares. Tipo de cambio del contrato: 1 EUR = ${rate} USD. Monto asegurado en USD: `),",
            "                                    new TextRun({ text: formatLegalCurrency(fianzaUSD, 'USD'), bold: true }),",
            '                                    new TextRun(".")',
            '                                ]',
            '                            });',
            '                        }',
            '                        return new Paragraph({',
            '                            alignment: AlignmentType.JUSTIFIED,',
            '                            spacing: { after: 200 },',
            '                            children: [',
            '                                new TextRun(t.D_QUINTO_BODY_1),',
            '                                new TextRun({ text: legalAmount(pay.totalPrice * 0.20), bold: true }),',
            '                                new TextRun(t.D_QUINTO_BODY_2)',
            '                            ]',
            '                        });',
            '                    })(),',
        ];
        lines.splice(paraStart, count, ...iife);
        console.log('OK E: D_QUINTO IIFE at section level. Replaced', count, 'lines with', iife.length);
    }
}

// ─── PATCH F: Co-signer in signature block ────────────────────────────────────
{
    let anchorIdx = -1;
    for (let i = 770; i < 840; i++) {
        if (lines[i] && lines[i].includes("c.type === 'Fisica' ? c.name")) {
            anchorIdx = i;
            break;
        }
    }
    if (anchorIdx === -1) {
        console.log('SKIP F: co-signer signature anchor not found');
    } else {
        let closeIdx = -1;
        for (let i = anchorIdx + 1; i <= anchorIdx + 8; i++) {
            if (lines[i] && lines[i].trim() === ']') { closeIdx = i; break; }
        }
        if (closeIdx === -1) {
            console.log('SKIP F: closing ] not found after anchor at', anchorIdx + 1);
        } else {
            lines.splice(closeIdx, 0,
                '                                             ...(coSigner ? [',
                '                                                 new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600 }, children: [new TextRun({ text: "_________________________________________________" })] }),',
                '                                                 new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: \'Por "EL BENEFICIARIO"\', bold: true })] }),',
                '                                                 new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: coSigner.name, bold: true })] }),',
                '                                             ] : [])'
            );
            console.log('OK F: Co-signer in signature block at line', closeIdx + 1);
        }
    }
}

// ─── Write ────────────────────────────────────────────────────────────────────
const result = lines.join('\r\n');
fs.writeFileSync(filePath, result, 'utf8');
console.log('\nDone. Total lines:', lines.length, '| Size:', result.length, 'bytes');
