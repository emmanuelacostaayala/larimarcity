// Spanish number-to-words for legal contract documents
// Output format: VEINTE MIL QUINIENTOS EUROS CON 47/100 CENTAVOS

const ONES = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE',
    'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];

const TENS = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];

const HUNDREDS = ['', 'CIEN', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS',
    'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

function integerToWords(n: number): string {
    if (n === 0) return 'CERO';
    if (n < 0) return 'MENOS ' + integerToWords(-n);

    let result = '';

    if (n >= 1_000_000) {
        const millions = Math.floor(n / 1_000_000);
        const rem = n % 1_000_000;
        if (millions === 1) result += 'UN MILLÓN';
        else result += integerToWords(millions) + ' MILLONES';
        if (rem > 0) result += ' ' + integerToWords(rem);
        return result;
    }

    if (n >= 1_000) {
        const thousands = Math.floor(n / 1_000);
        const rem = n % 1_000;
        if (thousands === 1) result += 'MIL';
        else result += integerToWords(thousands) + ' MIL';
        if (rem > 0) result += ' ' + integerToWords(rem);
        return result;
    }

    if (n >= 100) {
        const h = Math.floor(n / 100);
        const rem = n % 100;
        if (h === 1 && rem > 0) result += 'CIENTO';
        else result += HUNDREDS[h];
        if (rem > 0) result += ' ' + integerToWords(rem);
        return result;
    }

    if (n >= 20) {
        const t = Math.floor(n / 10);
        const rem = n % 10;
        result += TENS[t];
        if (rem > 0) result += ' Y ' + ONES[rem];
        return result;
    }

    return ONES[n];
}

/**
 * Converts a monetary amount to Spanish legal format.
 * Example: 2500.47, 'EUR' → "DOS MIL QUINIENTOS EUROS CON 47/100 CENTAVOS"
 */
export function amountToLegalSpanish(amount: number, currency: 'EUR' | 'USD'): string {
    const cents = Math.round(amount * 100) % 100;
    const whole = Math.floor(amount);
    const currencyWord = currency === 'EUR' ? 'EUROS' : 'DÓLARES';
    const centWord = 'CENTAVOS';

    const wholeWords = integerToWords(whole);
    const centsStr = String(cents).padStart(2, '0');

    return `${wholeWords} ${currencyWord} CON ${centsStr}/100 ${centWord}`;
}

/**
 * Full legal currency string combining words + numeric.
 * Example: "DOS MIL QUINIENTOS EUROS CON 00/100 CENTAVOS (2,500.00)"
 */
export function formatLegalCurrency(amount: number, currency: 'EUR' | 'USD'): string {
    const words = amountToLegalSpanish(amount, currency);
    const numeric = new Intl.NumberFormat('es-DO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
    return `${words} (${numeric})`;
}
