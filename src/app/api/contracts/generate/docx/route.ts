import { NextRequest, NextResponse } from 'next/server';
import { ContractPayload } from '@/types/contract';
import { Document, Paragraph, TextRun, Packer, AlignmentType, Header, Footer, PageNumber } from 'docx';

export async function POST(req: NextRequest) {
    try {
        const payload: ContractPayload = await req.json();

        if (!payload.client || !payload.property || !payload.paymentPlan || !payload.clauses) {
            return NextResponse.json({ error: 'Invalid Payload' }, { status: 400 });
        }

        const formatCurrency = (amount: number, currency: string) => {
            return new Intl.NumberFormat('es-DO', { style: 'currency', currency }).format(amount);
        };

        const c = payload.client;
        const p = payload.property;
        const pay = payload.paymentPlan;
        const contractDate = new Date(payload.date || new Date()).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

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
                            new TextRun({ text: "CONTRATO DE OPCIÓN DE COMPRAVENTA DE INMUEBLE", bold: true, size: 24 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun({ text: "ENTRE: ", bold: true }),
                            new TextRun("Por una parte "),
                            new TextRun({ text: "INGENIERÍA Y ESTRUCTURAS DEL CARIBE -INECAR SRL", bold: true }),
                            new TextRun(", sociedad comercial organizada y existente de conformidad con las leyes de la República Dominicana, Registro Mercantil número 15387LA, y Registro Nacional de Contribuyentes (RNC) número 1-32-43471-4, con domicilio social establecido en el Boulevard Primero de Noviembre No. 801, Aqua Business Center, Punta Cana Village, Punta Cana, provincia La Altagracia R.D., representada por el señor "),
                            new TextRun({ text: "ÁLVARO MECA RUBIO", bold: true }),
                            new TextRun(", apoderado en virtud de acta de asamblea de fecha 2 de julio del año 2025, de nacionalidad española, mayor de edad, soltero, abogado, portador del pasaporte No. PAU716840, y D.N.I. y N.I.F. No. 23.835.758-F, domiciliado y residente en el residencial Punta Cana Village, Punta Cana, provincia la Altagracia, República Dominicana, quien en lo adelante del presente contrato se denominará, ”EL PROPIETARIO”, o por su propio nombre.")
                        ]
                    }),
                    renderBeneficiarioParagraph(),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun("Cuando EL PROPIETARIO y EL BENEFICIARIO sean designados de manera conjunta en el presente contrato, se les denominarán como “LAS PARTES”.")
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: "P R E Á M B U L O", bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun({ text: "POR CUANTO (1): ", bold: true }),
                            new TextRun("EL PROPIETARIO es promotora de un proyecto turístico hotelero denominado “LARIMAR CITY & RESORT”, el cual se desarrollará en los inmuebles identificados como: 1) Parcela No. 67-B247, Distrito Catastral No. 11/3ra., Certificado de Título No. 95-313 con un área de 2,548,943.50 Mts.2; 2) 3000537221, Parcela No. 67-B, Distrito Catastral No. 11/3ra... [El proyecto contará con un paseo estilo mediterráneo al borde del farallón de Higüey...]")
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: "PRIMERO: OBJETO DEL CONTRATO.", bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun("EL PROPIETARIO, por medio del presente contrato le da formal opción de compra con todas las garantías ordinarias y de derecho, a EL BENEFICIARIO, el cual acepta, libre de cargas, gravámenes y todo tipo de deuda, y a su vez se compromete a pagar, dentro del proyecto “LARIMAR CITY & RESORT”, el inmueble que comercialmente se describe a continuación:")
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
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: "TERCERO: DEL PRECIO Y LA FORMA DE PAGO.", bold: true, size: 20 })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun("El precio total convenido y pactado por LAS PARTES para la presente OPCIÓN DE COMPRA es por la cantidad de "),
                            new TextRun({ text: formatCurrency(pay.totalPrice, pay.currency), bold: true }),
                            new TextRun(", el cual será pagado en la cuenta de EL PROPIETARIO según el siguiente plan de pagos:")
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 100 },
                        children: [
                            new TextRun({ text: "PAGO DE RESERVA: ", bold: true }),
                            new TextRun(`${formatCurrency(pay.reservationAmount, pay.currency)}, monto que EL PROPIETARIO declara haber recibido en fechas anteriores.`)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 100 },
                        children: [
                            new TextRun({ text: "PAGO INICIAL: ", bold: true }),
                            new TextRun(`${formatCurrency(pay.downPaymentAmount, pay.currency)}, monto que EL BENEFICIARIO depositará en la cuenta de EL PROPIETARIO.`)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: { after: 200 },
                        children: [
                            new TextRun({ text: "SALDO CONTRA ENTREGA: ", bold: true }),
                            new TextRun(`${formatCurrency(pay.deliveryAmount, pay.currency)}, lo cual equivale al saldo restante del monto total de la vivienda y que serán cancelados con la entrega del apartamento.`)
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 800, after: 400 },
                        children: [
                            new TextRun({ text: `HECHO Y FIRMADO en tres (3) originales de un mismo tenor y efecto, uno para cada una de las partes. En Punta Cana, a los ${contractDate}.`, bold: true })
                        ]
                    })
                ]
            }]
        });

        const buffer = await Packer.toBuffer(doc);

        return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="Contract_${payload.client.name.replace(/\s+/g, '_')}_${payload.property.unitNumber}.docx"`
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
