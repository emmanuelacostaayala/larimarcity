import { NextRequest, NextResponse } from 'next/server';
import { ContractPayload } from '@/types/contract';
import { Document, Paragraph, TextRun, Packer, AlignmentType, Header, Footer, PageNumber, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle } from 'docx';
import { contractTemplates as t } from '@/constants/contractTemplates';
import { getDocumentFilename } from '@/utils/documentName';
import { formatLegalCurrency } from '@/utils/numberToWords';
import { buildInstallmentTable, formatPaymentDate } from '@/utils/paymentTable';

export async function POST(req: NextRequest) {
    try {
        const payload: ContractPayload = await req.json();

        if (!payload.client || !payload.property || !payload.paymentPlan || !payload.clauses) {
            return NextResponse.json({ error: 'Invalid Payload' }, { status: 400 });
        }

        const legalAmount = (amount: number) => formatLegalCurrency(amount, payload.paymentPlan.currency);
        const formatNumeric = (amount: number) => new Intl.NumberFormat('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

        const c = payload.client;
        const p = payload.property;
        const pay = payload.paymentPlan;
        const contractDate = new Date(payload.date || new Date()).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

        // Build payment plan table rows
        const buildPaymentTable = () => {
            const rows = buildInstallmentTable(pay);
            const headerBg = { fill: '1a1a2e', color: 'FFFFFF', type: ShadingType.SOLID };
            const altBg = { fill: 'f9f9f9', color: 'auto', type: ShadingType.SOLID };
            const lastBg = { fill: 'e8e8e8', color: 'auto', type: ShadingType.SOLID };

            return new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    // Title row
                    new TableRow({
                        children: [
                            new TableCell({
                                columnSpan: 5,
                                shading: headerBg,
                                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'PLAN DE PAGOS', bold: true, color: 'FFFFFF', size: 20 })] })],
                            })
                        ]
                    }),
                    // Header row
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'CONCEPTO', bold: true, size: 16 })] })] }),
                            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '#', bold: true, size: 16 })] })] }),
                            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'IMPORTE', bold: true, size: 16 })] })] }),
                            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'IMPORTE EN LETRAS', bold: true, size: 16 })] })] }),
                            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'FECHA PAGO', bold: true, size: 16 })] })] }),
                        ]
                    }),
                    // Data rows
                    ...rows.map((row, idx) => {
                        const isLast = idx === rows.length - 1;
                        const isAlt = idx % 2 === 1;
                        const bg = isLast ? lastBg : isAlt ? altBg : undefined;
                        const cellOpts = (content: Paragraph) => ({ shading: bg, children: [content] });
                        return new TableRow({
                            children: [
                                new TableCell(cellOpts(new Paragraph({ children: [new TextRun({ text: row.label, bold: true, size: 16 })] }))),
                                new TableCell(cellOpts(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(idx), size: 16 })] }))),
                                new TableCell(cellOpts(new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: formatNumeric(row.amount), size: 16 })] }))),
                                new TableCell(cellOpts(new Paragraph({ children: [new TextRun({ text: legalAmount(row.amount), size: 14 })] }))),
                                new TableCell(cellOpts(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: formatPaymentDate(row.dueDate), size: 16 })] }))),
                            ]
                        });
                    })
                ]
            });
        };

        const renderBeneficiarioParagraph = () => {
            if (c.type === 'Fisica') {
                return new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 200 },
                    children: [
                        new TextRun("Y por la otra parte, "),
                        new TextRun({ text: c.name, bold: true }),
                        new TextRun(`, de nacionalidad ${c.nationality}, mayor de edad, con estado civil ${c.civilStatus}, con ${c.documentType} Nº `),
                        new TextRun({ text: c.documentNumber, bold: true }),
                        new TextRun(`, domiciliado en ${c.address}, y quienes en lo sucesivo para el presente contrato se denominarán "EL BENEFICIARIO" o por su propio nombre.`)
                    ]
                });
            } else {
                return new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 200 },
                    children: [
                        new TextRun("Y por la otra parte, "),
                        new TextRun({ text: c.name, bold: true }),
                        new TextRun(`, sociedad mercantil organizada bajo las leyes, RNC/CIF Nº `),
                        new TextRun({ text: c.rncCif, bold: true }),
                        new TextRun(`, con domicilio en ${c.address}, representada por `),
                        new TextRun({ text: c.legalRepresentative?.name || "", bold: true }),
                        new TextRun(`, provisto de ${c.legalRepresentative?.documentType} Nº `),
                        new TextRun({ text: c.legalRepresentative?.documentNumber || "", bold: true }),
                        new TextRun(`, y quienes en lo sucesivo para el presente contrato se denominarán "EL BENEFICIARIO" o por su propio nombre.`)
                    ]
                });
            }
        };

        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
                    }
                },
                headers: {
                    default: new Header({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.RIGHT,
                                children: [
                                    new TextRun({ text: `Larimar City - ${p.project} - ${p.unitNumber}`, size: 16, color: "666666" })
                                ]
                            })
                        ]
                    })
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: "Larimar City & Resort | Contrato de Opcion de Compraventa | Pág. ", size: 16, color: "666666" }),
                                    new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "666666" }),
                                    new TextRun({ text: " de ", size: 16, color: "666666" }),
                                    new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: "666666" })
                                ]
                            })
                        ]
                    })
                },
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 400, after: 400 },
                        children: [
                            new TextRun({ text: t.TITLE, bold: true, size: 24 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun({ text: t.PARTIES_INTRO })
                        ]
                    }),
                    renderBeneficiarioParagraph(),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.DEFINITIONS)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.PREAMBULO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.POR_CUANTO_1),
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.POR_CUANTO_2A),
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.POR_CUANTO_3),
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.POR_CUANTO_4),
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.PRIMERO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.PRIMERO_BODY)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun({ text: `“${p.project.toUpperCase()} - Unidad ${p.unitNumber}”`, bold: true }),
                            new TextRun(`, ubicado en el nivel ${p.level} con una extensión superficial total de ${p.squareMeters} m2 de construcción. Dicho apartamento consta de ${p.rooms} habitación(es), ${p.bathrooms} baño(s), área de cocina, área de lavado, dentro del Proyecto denominado “LARIMAR CITY & RESORT”.`)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.PRIMERO_PARRAFO_I)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.PRIMERO_PARRAFO_II)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.PRIMERO_PARRAFO_III)
                        ]
                    }),
                    ...(payload.clauses.golfMembership ? [
                        new Paragraph({
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 200 },
                            children: [
                                new TextRun(t.PRIMERO_PARRAFO_IV_GOLF)
                            ]
                        })
                    ] : []),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.SEGUNDO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.SEGUNDO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.TERCERO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.TERCERO_BODY_1),
                            new TextRun({ text: legalAmount(pay.totalPrice), bold: true }),
                            new TextRun(t.TERCERO_BODY_2)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 100 },
                        children: [
                            new TextRun({ text: "PAGO DE RESERVA: ", bold: true }),
                            new TextRun(`${legalAmount(pay.reservationAmount)}, ${t.TERCERO_RESERVA}`)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 100 },
                        children: [
                            new TextRun({ text: "PAGO INICIAL: ", bold: true }),
                            new TextRun(`${legalAmount(pay.downPaymentAmount)}, ${t.TERCERO_INICIAL}`)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.TERCERO_WARNING)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun({ text: "SALDO CONTRA ENTREGA: ", bold: true }),
                            new TextRun(`${legalAmount(pay.deliveryAmount)}, ${t.TERCERO_ENTREGA}`)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.TERCERO_PARRAFO_I)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.TERCERO_PARRAFO_II)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.TERCERO_PARRAFO_III)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.TERCERO_PARRAFO_IV)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.TERCERO_PARRAFO_V)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.TERCERO_PARRAFO_VI)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.TERCERO_PARRAFO_VII_A),
                            new TextRun(pay.currency === 'EUR' ? 'euros (€)' : 'Dólares (USD)'),
                            new TextRun(t.TERCERO_PARRAFO_VII_B)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.TERCERO_PARRAFO_VIII)
                        ]
                    }),
                    // PLAN DE PAGOS TABLE
                    buildPaymentTable(),
                    new Paragraph({ children: [], spacing: { after: 200 } }), // spacer
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.CUARTO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.CUARTO_BODY)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.CUARTO_PARRAFO_I)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.CUARTO_PARRAFO_II)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.CUARTO_PARRAFO_III)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.CUARTO_PARRAFO_IV)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.CUARTO_PARRAFO_V)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.QUINTO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.QUINTO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.SEXTO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.SEXTO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.SEPTIMO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.SEPTIMO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.OCTAVO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.OCTAVO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.NOVENO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.NOVENO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.DECIMO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.DECIMO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.UNDECIMO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.UNDECIMO_BODY),
                            new TextRun(` ${p.squareMeters} `),
                            new TextRun(t.UNDECIMO_BODY_B)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.DUODECIMO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.DUODECIMO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.D_TERCERO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.D_TERCERO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.D_CUARTO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.D_CUARTO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.D_QUINTO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    ...(payload.clauses.earlyPaymentInterest ? [
                        new Paragraph({
                            spacing: { before: 200, after: 200 },
                            children: [
                                new TextRun({ text: "DÉCIMO QUINTO: PAGO ANTICIPADO DE INTERESES.", bold: true, size: 20 })
                            ]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.JUSTIFIED,
                            spacing: { after: 200 },
                            children: [
                                new TextRun("LAS PARTES acuerdan que EL BENEFICIARIO recibirá un interés equivalente al siete por ciento (7%) anual sobre los montos que decida abonar de manera anticipada al cronograma de construcción, hasta el momento de la entrega formal de la unidad.")
                            ]
                        })
                    ] : []),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.D_QUINTO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.D_QUINTO_BODY_1),
                            new TextRun({ text: legalAmount(pay.totalPrice * 0.20), bold: true }),
                            new TextRun(t.D_QUINTO_BODY_2)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.D_SEXTO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.D_SEXTO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.D_SEPTIMO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.D_SEPTIMO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.D_OCTAVO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.D_OCTAVO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.D_NOVENO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.D_NOVENO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.VIGESIMO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.VIGESIMO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.VIGESIMO_PRIMERO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.VIGESIMO_PRIMERO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.VIGESIMO_SEGUNDO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.VIGESIMO_SEGUNDO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.VIGESIMO_TERCERO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.VIGESIMO_TERCERO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.VIGESIMO_CUARTO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.VIGESIMO_CUARTO_BODY)
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: t.VIGESIMO_QUINTO_TITLE, bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun(t.VIGESIMO_QUINTO_BODY)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 800, after: 400 },
                        children: [
                            new TextRun({ text: `HECHO Y FIRMADO en tres (3) originales de un mismo tenor y efecto, uno para cada una de las partes. En Punta Cana, a los ${contractDate}.`, bold: true })
                        ]
                    }),

                    // ANEXOS
                    ...(payload.clauses.qualityMemory ? [
                        new Paragraph({
                            pageBreakBefore: true,
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 1800, after: 400 },
                            children: [new TextRun({ text: t.ANEXO_I_TITLE, bold: true, size: 24 })]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: `${p.project.toUpperCase()} - Unidad ${p.unitNumber}`, size: 16, color: '666666' })]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 1000 },
                            children: [new TextRun(t.ANEXO_I_BODY)]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 400 },
                            children: [new TextRun({ text: "[ Espacio para adjuntar documento ]", color: '999999' })]
                        })
                    ] : []),

                    ...(payload.clauses.golfMembership ? [
                        new Paragraph({
                            pageBreakBefore: true,
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 1800, after: 400 },
                            children: [new TextRun({ text: t.ANEXO_II_TITLE, bold: true, size: 24 })]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: `${p.project.toUpperCase()} - Unidad ${p.unitNumber}`, size: 16, color: '666666' })]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 1000 },
                            children: [new TextRun(t.ANEXO_II_BODY)]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 400 },
                            children: [new TextRun({ text: "[ Espacio para adjuntar certificados ]", color: '999999' })]
                        })
                    ] : []),

                    new Paragraph({
                        pageBreakBefore: true,
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 1800, after: 400 },
                        children: [new TextRun({ text: t.ANEXO_III_TITLE, bold: true, size: 24 })]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: `${p.project.toUpperCase()} - Unidad ${p.unitNumber}`, size: 16, color: '666666' })]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 1000 },
                        children: [new TextRun(t.ANEXO_III_BODY)]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 400 },
                        children: [new TextRun({ text: "[ Espacio para adjuntar planos topográficos/arquitectónicos ]", color: '999999' })]
                    })

                ]
            }]
        });

        const buffer = await Packer.toBuffer(doc);

        return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${getDocumentFilename(payload, 'docx')}"`
            }
        });
    } catch (error: any) {
        console.error('DOCX Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate contract DOCX', details: error.message },
            { status: 500 }
        );
    }
}
