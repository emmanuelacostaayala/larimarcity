import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ContractPayload } from '@/types/contract';
import { contractTemplates as t } from '@/constants/contractTemplates';

const styles = StyleSheet.create({
    page: {
        paddingTop: 60,
        paddingBottom: 60,
        paddingHorizontal: 60,
        fontFamily: 'Times-Roman',
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
        fontFamily: 'Times-Bold',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    subtitle: {
        fontSize: 10,
        fontFamily: 'Times-Bold',
        marginTop: 15,
        marginBottom: 10,
    },
    paragraph: {
        marginBottom: 10,
        textAlign: 'left',
    },
    bold: {
        fontFamily: 'Times-Bold',
    },
    signatureBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 80,
    },
    signatureLine: {
        width: '40%',
        borderTopWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
        paddingTop: 10,
    },
    pageBreak: { break: true }
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

    const contractDate = new Date(payload.date || new Date()).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    const day = new Date(payload.date || new Date()).getDate();
    const month = new Date(payload.date || new Date()).toLocaleDateString('es-ES', { month: 'long' });
    const year = new Date(payload.date || new Date()).getFullYear();

    const renderBeneficiario = () => {
        if (c.type === 'Fisica') {
            return (
                <Text style={styles.paragraph}>
                    Y por la otra parte, el señor <Text style={styles.bold}>{c.name}</Text>, de nacionalidad {c.nationality || '_______'}, mayor de edad, con PASAPORTE Nº <Text style={styles.bold}>{c.documentNumber}</Text>, domiciliado en {c.address}, y quienes en lo sucesivo para el presente contrato se denominarán “EL BENEFICIARIO” o por su propio nombre.
                </Text>
            );
        } else {
            return (
                <Text style={styles.paragraph}>
                    Y por la otra parte, <Text style={styles.bold}>{c.name}</Text>, sociedad mercantil organizada bajo las leyes de la República Dominicana, RNC/CIF Nº <Text style={styles.bold}>{c.rncCif}</Text>, con domicilio en {c.address}, y quienes en lo sucesivo para el presente contrato se denominarán “EL BENEFICIARIO” o por su propio nombre.
                </Text>
            );
        }
    };

    const renderBankDetails = () => {
        if (pay.currency === 'EUR') {
            return (
                <View style={styles.paragraph}>
                    <Text>Banco beneficiario:</Text>
                    <Text style={styles.bold}>Banco SANTANDER, S. A.</Text>
                    <Text>C. de Ferraz, 43, Moncloa – Aravaca, 28008 Madrid, España,</Text>
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
    };

    return (
        <Document>
            <Page size="A4" style={styles.page} wrap={true}>
                {/* Header that repeats */}
                <Text style={styles.header} fixed>Larimar City - {p.project} - Unidad {p.unitNumber}</Text>

                <Text style={styles.title}>{t.TITLE}</Text>

                <Text style={styles.paragraph}>{t.PARTIES_INTRO}</Text>
                {renderBeneficiario()}
                <Text style={styles.paragraph}>{t.DEFINITIONS}</Text>

                <Text style={styles.title}>{t.PREAMBULO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.POR_CUANTO_1}</Text>
                <Text style={styles.paragraph}>{t.POR_CUANTO_2A}</Text>
                <Text style={styles.paragraph}>{t.POR_CUANTO_3}</Text>
                <Text style={styles.paragraph}>{t.POR_CUANTO_4}</Text>

                <Text style={styles.subtitle}>{t.PRIMERO_TITLE}</Text>
                <Text style={styles.paragraph}>
                    {t.PRIMERO_BODY}
                    <Text style={styles.bold}> “{p.project.toUpperCase()} - Apartamento No.{p.unitNumber}”</Text>, ubicado en el {p.level} nivel con una extensión superficial total de {p.squareMeters} m2 de construcción. Dicho apartamento consta de {p.rooms} habitación(es), {p.bathrooms} baño(s), área de cocina, área de lavado, dentro del Proyecto denominado “LARIMAR CITY & RESORT”.
                </Text>
                {payload.clauses.qualityMemory && (
                    <Text style={styles.paragraph}>Se adjunta el ANEXO I MEMORIA DE CALIDADES donde se detalla el equipamiento y acabados del apartamento del presente contrato.</Text>
                )}
                <Text style={styles.paragraph}>{t.PRIMERO_PARRAFO_I}</Text>
                <Text style={styles.paragraph}>{t.PRIMERO_PARRAFO_II}</Text>
                <Text style={styles.paragraph}>{t.PRIMERO_PARRAFO_III}</Text>

                <Text style={styles.subtitle}>{t.SEGUNDO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.SEGUNDO_BODY}</Text>

                <Text style={styles.subtitle}>{t.TERCERO_TITLE}</Text>
                <Text style={styles.paragraph}>
                    {t.TERCERO_BODY_1}<Text style={styles.bold}>{formatCurrency(pay.totalPrice, pay.currency)}</Text>{t.TERCERO_BODY_2}
                </Text>
                {!pay.isCash && (
                    <>
                        <Text style={styles.paragraph}>La suma de <Text style={styles.bold}>{formatCurrency(pay.reservationAmount || 0, pay.currency)}</Text>, {t.TERCERO_RESERVA}</Text>
                        <Text style={styles.paragraph}>La suma de <Text style={styles.bold}>{formatCurrency(pay.downPaymentAmount || 0, pay.currency)}</Text>, {t.TERCERO_INICIAL}</Text>
                    </>
                )}
                <Text style={styles.paragraph}>{t.TERCERO_WARNING}</Text>
                <Text style={styles.paragraph}>Un último pago de <Text style={styles.bold}>{formatCurrency(pay.deliveryAmount || 0, pay.currency)}</Text>, {t.TERCERO_ENTREGA}</Text>
                <Text style={styles.paragraph}>{t.TERCERO_PARRAFO_I}</Text>
                <Text style={styles.paragraph}>{t.TERCERO_PARRAFO_II}</Text>
                <Text style={styles.paragraph}>{t.TERCERO_PARRAFO_III}</Text>
                <Text style={styles.paragraph}>{t.TERCERO_PARRAFO_IV}</Text>
                <Text style={styles.paragraph}>{t.TERCERO_PARRAFO_V}</Text>
                <Text style={styles.paragraph}>{t.TERCERO_PARRAFO_VI}</Text>
                <Text style={styles.paragraph}>
                    {t.TERCERO_PARRAFO_VII_A}{pay.currency === 'EUR' ? 'euros (€)' : 'Dólares (USD)'}{t.TERCERO_PARRAFO_VII_B}
                </Text>
                {renderBankDetails()}
                <Text style={styles.paragraph}>{t.TERCERO_PARRAFO_VIII}</Text>

                <Text style={styles.subtitle}>{t.CUARTO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.CUARTO_BODY}</Text>
                <Text style={styles.paragraph}>{t.CUARTO_PARRAFO_I}</Text>
                <Text style={styles.paragraph}>{t.CUARTO_PARRAFO_II}</Text>
                <Text style={styles.paragraph}>{t.CUARTO_PARRAFO_III}</Text>
                <Text style={styles.paragraph}>{t.CUARTO_PARRAFO_IV}</Text>
                <Text style={styles.paragraph}>{t.CUARTO_PARRAFO_V}</Text>

                <Text style={styles.subtitle}>{t.QUINTO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.QUINTO_BODY}</Text>

                <Text style={styles.subtitle}>{t.SEXTO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.SEXTO_BODY}</Text>

                <Text style={styles.subtitle}>{t.SEPTIMO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.SEPTIMO_BODY}</Text>

                <Text style={styles.subtitle}>{t.OCTAVO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.OCTAVO_BODY}</Text>

                <Text style={styles.subtitle}>{t.NOVENO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.NOVENO_BODY}</Text>

                <Text style={styles.subtitle}>{t.DECIMO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.DECIMO_BODY}</Text>

                <Text style={styles.subtitle}>{t.UNDECIMO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.UNDECIMO_BODY} {p.squareMeters} {t.UNDECIMO_BODY_B}</Text>

                <Text style={styles.subtitle}>{t.DUODECIMO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.DUODECIMO_BODY}</Text>

                <Text style={styles.subtitle}>{t.D_TERCERO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.D_TERCERO_BODY}</Text>

                <Text style={styles.subtitle}>{t.D_CUARTO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.D_CUARTO_BODY}</Text>

                {payload.clauses.earlyPaymentInterest && (
                    <>
                        <Text style={styles.subtitle}>DÉCIMO QUINTO: PAGO ANTICIPADO DE INTERESES.</Text>
                        <Text style={styles.paragraph}>
                            LAS PARTES acuerdan que EL BENEFICIARIO recibirá un interés equivalente al siete por ciento (7%) anual sobre los montos que decida abonar de manera anticipada al cronograma de construcción, hasta el momento de la entrega formal de la unidad.
                        </Text>
                    </>
                )}

                {payload.clauses.golfMembership && (
                    <>
                        <Text style={styles.subtitle}>DÉCIMO SEXTO: MEMBRESÍA DEL CLUB DE GOLF.</Text>
                        <Text style={styles.paragraph}>
                            EL PROPIETARIO por este medio otorga a EL BENEFICIARIO una membresía honorífica permanente para el uso del Campo de Golf y el Country Club dentro de las instalaciones del proyecto Larimar City & Resort, exenta de tarifas de inscripción, quedando sujeta únicamente a las cuotas de mantenimiento regulares una vez habilitado el campo.
                        </Text>
                    </>
                )}

                <Text style={styles.subtitle}>{t.D_QUINTO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.D_QUINTO_BODY}</Text>

                <Text style={styles.subtitle}>{t.D_SEXTO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.D_SEXTO_BODY}</Text>

                <Text style={styles.subtitle}>{t.D_SEPTIMO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.D_SEPTIMO_BODY}</Text>

                <Text style={styles.subtitle}>{t.D_OCTAVO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.D_OCTAVO_BODY}</Text>

                <Text style={styles.subtitle}>{t.D_NOVENO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.D_NOVENO_BODY}</Text>

                <Text style={styles.subtitle}>{t.VIGESIMO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.VIGESIMO_BODY}</Text>

                <Text style={styles.subtitle}>{t.VIGESIMO_PRIMERO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.VIGESIMO_PRIMERO_BODY}</Text>

                <Text style={styles.subtitle}>{t.VIGESIMO_SEGUNDO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.VIGESIMO_SEGUNDO_BODY}</Text>

                <Text style={styles.subtitle}>{t.VIGESIMO_TERCERO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.VIGESIMO_TERCERO_BODY}</Text>

                <Text style={styles.subtitle}>{t.VIGESIMO_CUARTO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.VIGESIMO_CUARTO_BODY}</Text>

                <Text style={styles.subtitle}>{t.VIGESIMO_QUINTO_TITLE}</Text>
                <Text style={styles.paragraph}>{t.VIGESIMO_QUINTO_BODY}</Text>

                <Text style={[styles.paragraph, { marginTop: 40, textAlign: 'center', fontFamily: 'Times-Bold' }]} break>
                    {t.HECHO_Y_FIRMADO_1} ({day}) días del mes de {month.toUpperCase()} del año {year}.
                </Text>

                <View style={styles.signatureBlock}>
                    <View style={styles.signatureLine}>
                        <Text style={styles.bold}>ÁLVARO MECA RUBIO</Text>
                        <Text>Por: EL PROPIETARIO</Text>
                    </View>
                    <View style={styles.signatureLine}>
                        <Text style={styles.bold}>{c.name.toUpperCase()}</Text>
                        <Text>Por: EL BENEFICIARIO</Text>
                    </View>
                </View>

                {/* Notary Page */}
                <Text style={[styles.paragraph, { marginTop: 100 }]} break>
                    {t.NOTARY_TEXT_1}<Text style={styles.bold}>{c.name.toUpperCase()}</Text>{t.NOTARY_TEXT_2}({day}) días del mes de {month.toUpperCase()} del año {year}.
                </Text>

                <View style={[styles.signatureBlock, { marginTop: 60, justifyContent: 'center' }]}>
                    <View style={styles.signatureLine}>
                        <Text style={styles.bold}>DR. FRANKLIN CASTILLO CALDERON</Text>
                        <Text>Abogado Notario</Text>
                    </View>
                </View>

                {/* Footer that repeats on all pages */}
                <Text style={styles.footer} fixed>Larimar City & Resort | Contrato de Opcion de Compraventa</Text>
            </Page>
        </Document>
    );
};
