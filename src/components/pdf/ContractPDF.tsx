import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ContractPayload } from '@/types/contract';

// Create styles
const styles = StyleSheet.create({
    page: {
        paddingTop: 60,
        paddingBottom: 60,
        paddingHorizontal: 60,
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.5,
    },
    header: {
        position: 'absolute',
        top: 30,
        right: 60,
        fontSize: 8,
        color: '#666',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 60,
        right: 60,
        fontSize: 8,
        color: '#666',
        textAlign: 'center',
    },
    title: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    paragraph: {
        marginBottom: 10,
        textAlign: 'justify',
    },
    bold: {
        fontFamily: 'Helvetica-Bold',
    },
    subtitle: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        marginTop: 15,
        marginBottom: 10,
    },
    table: {
        display: "flex",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginTop: 10,
        marginBottom: 10
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row",
    },
    tableCol: {
        width: "33%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableCell: {
        margin: 5,
        fontSize: 10,
    }
});

interface ContractPDFProps {
    payload: ContractPayload;
}

export const ContractPDF = ({ payload }: ContractPDFProps) => {
    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('es-DO', { style: 'currency', currency }).format(amount);
    };

    const c = payload.client;
    const p = payload.property;
    const pay = payload.paymentPlan;

    // Format dates nicely
    const contractDate = new Date(payload.date || new Date()).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    // Dinamic parts based on Client Type
    const renderBeneficiario = () => {
        if (c.type === 'Fisica') {
            return (
                <Text>Y por la otra parte, <Text style={styles.bold}>{c.name}</Text>, de nacionalidad {c.nationality}, mayor de edad, con estado civil {c.civilStatus}, con {c.documentType} Nº <Text style={styles.bold}>{c.documentNumber}</Text>, domiciliado en {c.address}, y quienes en lo sucesivo para el presente contrato se denominarán "EL BENEFICIARIO" o por su propio nombre.</Text>
            );
        } else {
            return (
                <Text>Y por la otra parte, <Text style={styles.bold}>{c.name}</Text>, sociedad mercantil organizada bajo las leyes, RNC/CIF Nº <Text style={styles.bold}>{c.rncCif}</Text>, con domicilio en {c.address}, representada por <Text style={styles.bold}>{c.legalRepresentative?.name}</Text>, provisto de {c.legalRepresentative?.documentType} Nº <Text style={styles.bold}>{c.legalRepresentative?.documentNumber}</Text>, y quienes en lo sucesivo para el presente contrato se denominarán "EL BENEFICIARIO" o por su propio nombre.</Text>
            );
        }
    };

    const renderBankDetails = () => {
        if (pay.currency === 'EUR') {
            return (
                <View style={styles.paragraph}>
                    <Text>Banco beneficiario:</Text>
                    <Text style={styles.bold}>Banco SANTANDER, S. A.</Text>
                    <Text>C. de Ferraz, 43, Moncloa – Aravaca, 28008 Madrid, España</Text>
                    <Text>SWIFT: BSCHESMMXXX</Text>
                    <Text>IBAN: ES27 0049 6660 7827 1630 0554</Text>
                    <Text>Beneficiario: INGENIERIA Y ESTRUCTURAS DEL CARIBE, INECAR, S.R.L.</Text>
                    <Text>RNC: 1-32-43471-4</Text>
                    <Text>Dirección: Boulevard 1º de Noviembre No. 801, Edificio Aqua Business Center, Suite No. L-301, Tercer Piso, Punta Cana Village, Punta Cana, Higüey, La Altagracia, República Dominicana.</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.paragraph}>
                    <Text>Banco beneficiario:</Text>
                    <Text style={styles.bold}>Banco BHD, S. A.</Text>
                    <Text>Santo Domingo, República Dominicana</Text>
                    <Text>Cuenta en Dólares (USD): 123456789</Text>
                    <Text>Beneficiario: INGENIERIA Y ESTRUCTURAS DEL CARIBE, INECAR, S.R.L.</Text>
                    <Text>RNC: 1-32-43471-4</Text>
                    <Text>Dirección: Boulevard 1º de Noviembre No. 801, Edificio Aqua Business Center, Suite No. L-301, Tercer Piso, Punta Cana Village, Punta Cana, Higüey, La Altagracia, República Dominicana.</Text>
                </View>
            );
        }
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header} fixed>
                    Larimar City - {p.project} - {p.unitNumber}
                </Text>

                <Text style={styles.title}>CONTRATO DE OPCIÓN DE COMPRAVENTA DE INMUEBLE</Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>ENTRE:</Text> Por una parte <Text style={styles.bold}>INGENIERÍA Y ESTRUCTURAS DEL CARIBE -INECAR SRL</Text>, sociedad comercial organizada y existente de conformidad con las leyes de la República Dominicana, Registro Mercantil número 15387LA, y Registro Nacional de Contribuyentes (RNC) número 1-32-43471-4, con domicilio social establecido en el Boulevard Primero de Noviembre No. 801, Aqua Business Center, Punta Cana Village, Punta Cana, provincia La Altagracia R.D., representada por el señor <Text style={styles.bold}>ÁLVARO MECA RUBIO</Text>, apoderado en virtud de acta de asamblea de fecha 2 de julio del año 2025, de nacionalidad española, mayor de edad, soltero, abogado, portador del pasaporte No. PAU716840, y D.N.I. y N.I.F. No. 23.835.758-F, domiciliado y residente en el residencial Punta Cana Village, Punta Cana, provincia la Altagracia, República Dominicana, quien en lo adelante del presente contrato se denominará, ”EL PROPIETARIO”, o por su propio nombre.
                </Text>

                <Text style={styles.paragraph}>
                    {renderBeneficiario()}
                </Text>

                <Text style={styles.paragraph}>
                    Cuando EL PROPIETARIO y EL BENEFICIARIO sean designados de manera conjunta en el presente contrato, se les denominarán como “LAS PARTES”.
                </Text>

                <Text style={styles.title}>P R E Á M B U L O</Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>POR CUANTO (1):</Text> EL PROPIETARIO es promotora de un proyecto turístico hotelero denominado “LARIMAR CITY & RESORT”, el cual se desarrollará en los inmuebles identificados como: 1) Parcela No. 67-B247, Distrito Catastral No. 11/3ra., Certificado de Título No. 95-313 con un área de 2,548,943.50 Mts.2; 2) 3000537221, Parcela No. 67-B, Distrito Catastral No. 11/3ra., Certificado de Título No. 71-5 con un área de 115,521.22 MTS.2, más la resultante No. 505557281503, matrícula No. 3000320428, con una superficie de 314,431 MTS.2, así como también la Resultante No. 505557142449, matrícula No. 3000005302, con una superficie de 123,417.17 metros cuadrados; 3) Parcela No. 67-B-285 Distrito Catastral No. 11/3ra., matrícula 1000012047, con una superficie de 337,969.47 metros cuadrados, Parcela No. 67-B, Distrito Catastral No. 11/3ra., con una superficie de 567,778.57 metros cuadrados, así como la Parcela No. 67-B del Distrito Catastral No. 11/3ra. con una superficie de 276,698.40 metros cuadrados, ubicados en el Paraje Villa Jina, Higüey, la Altagracia. El proyecto contará con un paseo estilo mediterráneo al borde del farallón de Higüey, sobre el cual se desarrollarán un conjunto de opciones gastronómicas, hoteleras y de comercio con socios especializados. Por detrás de esta primera línea el proyecto cuenta con más de un millón de suelo para el desarrollo de unidades residenciales y/o vacacionales de renta corta, aproximadamente 990.000 m2 de suelo destinados para un proyecto de golf y country club con su propio espacio residencial [en lo adelante “El Proyecto”];
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>POR CUANTO (2):</Text> EL BENEFICIARIO ha declarado su intención de comprar un (01) apartamento del Proyecto “LARIMAR CITY & RESORT”, que será desarrollado por EL PROPIETARIO, y éste a su vez está en disposición de otorgarle a EL BENEFICIARIO una OPCIÓN DE COMPRA sobre dicho apartamento, el cual será descrito más adelante en el presente contrato.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>POR CUANTO (3):</Text> EL BENEFICIARIO tiene conocimiento del proyecto arquitectónico de “LARIMAR CITY & RESORT”, así como las características del mismo, que les fueron suministradas por EL PROPIETARIO.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>POR CUANTO (4):</Text> LAS PARTES contratantes se garantizan recíprocamente lo siguiente:
                    (a) La entidad comercial que suscribe el presente acuerdo es una sociedad debidamente organizada y existente bajo las leyes de la República Dominicana, y que posee todos los poderes requeridos para conducir sus actividades como lo hace al presente...
                    (b) Las personas físicas que firman el presente contrato, tanto personalmente como en nombre y representación de la empresa que representa, gozan de la más amplia capacidad.
                </Text>

                <Text style={styles.paragraph}>
                    POR LO TANTO y en el entendido de que este preámbulo forma parte directa e intrínseca del presente acto, las partes contratantes, SE HAN CONVENIDO Y PACTADO LO SIGUIENTE:
                </Text>

                <Text style={styles.subtitle}>PRIMERO: OBJETO DEL CONTRATO.</Text>
                <Text style={styles.paragraph}>
                    EL PROPIETARIO, por medio del presente contrato le da formal opción de compra con todas las garantías ordinarias y de derecho, a EL BENEFICIARIO, el cual acepta, libre de cargas, gravámenes y todo tipo de deuda, y a su vez se compromete a pagar, dentro del proyecto “LARIMAR CITY & RESORT”, el inmueble que comercialmente se describe a continuación:
                </Text>
                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>“{p.project.toUpperCase()} - Unidad {p.unitNumber}”</Text>, ubicado en el nivel {p.level} con una extensión superficial total de {p.squareMeters} m2 de construcción. Dicho apartamento consta de {p.rooms} habitación(es), {p.bathrooms} baño(s), área de cocina, área de lavado, dentro del Proyecto denominado “LARIMAR CITY & RESORT”.
                </Text>

                {payload.clauses.qualityMemory && (
                    <Text style={styles.paragraph}>
                        Se adjunta el ANEXO I MEMORIA DE CALIDADES donde se detalla el equipamiento y acabados del apartamento del presente contrato.
                    </Text>
                )}

                <Text style={styles.subtitle}>SEGUNDO: JUSTIFICACIÓN DEL DERECHO DE PROPIEDAD.</Text>
                <Text style={styles.paragraph}>
                    EL PROPIETARIO justifica su derecho de propiedad sobre los inmuebles dentro de los cuales se construye el Proyecto “LARIMAR CITY & RESORT”, mediante el contrato de venta de inmueble suscrito entre la sociedad INGENIERIA Y ESTRUCTURAS DEL CARIBE - INECAR, SRL y los propietarios correspondientes.
                </Text>

                <Text style={styles.subtitle}>TERCERO: DEL PRECIO Y LA FORMA DE PAGO.</Text>
                <Text style={styles.paragraph}>
                    El precio total convenido y pactado por LAS PARTES para la presente OPCIÓN DE COMPRA es por la cantidad de <Text style={styles.bold}>{formatCurrency(pay.totalPrice, pay.currency)}</Text>, el cual será pagado en la cuenta de EL PROPIETARIO según el siguiente plan de pagos:
                </Text>

                <Text style={styles.paragraph}>
                    PAGO DE RESERVA: <Text style={styles.bold}>{formatCurrency(pay.reservationAmount, pay.currency)}</Text>, monto que EL PROPIETARIO declara haber recibido en fechas anteriores, como pago de reserva de la unidad.
                </Text>
                <Text style={styles.paragraph}>
                    PAGO INICIAL: <Text style={styles.bold}>{formatCurrency(pay.downPaymentAmount, pay.currency)}</Text>, monto que EL BENEFICIARIO depositará en la cuenta de EL PROPIETARIO.
                </Text>
                <Text style={styles.paragraph}>
                    SALDO CONTRA ENTREGA: <Text style={styles.bold}>{formatCurrency(pay.deliveryAmount, pay.currency)}</Text>, lo cual equivale al saldo restante del monto total de la vivienda y que serán cancelados con la entrega del apartamento.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>PÁRRAFO I:</Text> Se aclara que el monto total del apartamento incluye el costo de notarización del contrato.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={styles.bold}>PÁRRAFO II:</Text> LAS PARTES acuerdan que todos los pagos deberán realizarse sin necesidad de requerimiento alguno, por transferencia en {pay.currency === 'EUR' ? 'euros (€)' : 'dólares (US$)'}, a la siguiente cuenta bancaria. Será indispensable colocar el código del inmueble adquirido en el concepto de la transferencia.
                </Text>

                {renderBankDetails()}

                {/* Dynamic Special Clauses rendered if true */}
                {payload.clauses.earlyPaymentInterest && (
                    <>
                        <Text style={styles.subtitle}>CLÁUSULA ESPECIAL: PAGO ANTICIPADO DE INTERESES.</Text>
                        <Text style={styles.paragraph}>
                            LAS PARTES acuerdan que EL BENEFICIARIO recibirá un interés equivalente al siete por ciento (7%) anual sobre los montos que decida abonar de manera anticipada al cronograma de construcción, hasta el momento de la entrega formal de la unidad.
                        </Text>
                    </>
                )}

                {payload.clauses.golfMembership && (
                    <>
                        <Text style={styles.subtitle}>CLÁUSULA ESPECIAL: MEMBRESÍA DEL CLUB DE GOLF.</Text>
                        <Text style={styles.paragraph}>
                            EL PROPIETARIO por este medio otorga a EL BENEFICIARIO una membresía honorífica permanente para el uso del Campo de Golf y el Country Club dentro de las instalaciones del proyecto Larimar City & Resort, exenta de tarifas de inscripción, quedando sujeta únicamente a las cuotas de mantenimiento regulares una vez habilitado el campo.
                        </Text>
                    </>
                )}

                <Text style={styles.subtitle}>CUARTO: DE LA ENTREGA Y DE LA SUSCRIPCIÓN DEL CONTRATO DEFINITIVO.</Text>
                <Text style={styles.paragraph}>
                    EL BENEFICIARIO reconoce y acepta que la fecha estimada de entrega del apartamento será “aproximadamente” en el mes de DICIEMBRE del año (2026), entendiéndose que el apartamento podría estar listo antes...
                </Text>

                <Text style={[styles.paragraph, { marginTop: 40, textAlign: 'center', fontFamily: 'Helvetica-Bold' }]}>
                    HECHO Y FIRMADO en tres (3) originales de un mismo tenor y efecto, uno para cada una de las partes. En Punta Cana, a los {contractDate}.
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 80 }}>
                    <View style={{ width: '40%', borderTopWidth: 1, borderColor: '#000', alignItems: 'center', paddingTop: 10 }}>
                        <Text style={styles.bold}>ÁLVARO MECA RUBIO</Text>
                        <Text>Por: EL PROPIETARIO</Text>
                    </View>
                    <View style={{ width: '40%', borderTopWidth: 1, borderColor: '#000', alignItems: 'center', paddingTop: 10 }}>
                        <Text style={styles.bold}>{c.name}</Text>
                        <Text>Por: EL BENEFICIARIO</Text>
                    </View>
                </View>

                <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                    `Larimar City & Resort | Contrato de Opcion de Compraventa | Pág. ${pageNumber} de ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    );
};
