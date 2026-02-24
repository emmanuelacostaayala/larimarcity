import { PaymentPlan, Currency, Installment } from '../types/contract';

/**
 * Auto-generates the PLAN DE PAGOS installment rows from a PaymentPlan.
 * Returns an ordered list of rows matching the table in the legal document.
 */
export function buildInstallmentTable(plan: PaymentPlan): Installment[] {
    const rows: Installment[] = [];

    if (plan.isCash) {
        // Cash: single payment for the full amount
        rows.push({
            label: 'PAGO AL CONTADO',
            amount: plan.totalPrice,
            dueDate: plan.reservationDate || 'EN FIRMA',
        });
        return rows;
    }

    // 1. Reserva
    if (plan.reservationAmount > 0) {
        rows.push({
            label: 'RESERVA',
            amount: plan.reservationAmount,
            dueDate: plan.reservationDate || '',
        });
    }

    // 2. Inicial
    if (plan.downPaymentAmount > 0) {
        rows.push({
            label: 'INICIAL',
            amount: plan.downPaymentAmount,
            dueDate: plan.downPaymentDate || '',
        });
    }

    // 3. Construction installments (monthly)
    const count = plan.constructionInstallments || 0;
    if (count > 0) {
        // Amount to distribute during construction
        const total = plan.totalPrice;
        const alreadyCommitted = (plan.reservationAmount || 0) + (plan.downPaymentAmount || 0) + (plan.deliveryAmount || 0);
        const constructionTotal = Math.max(0, total - alreadyCommitted);
        const installmentAmount = Math.round((constructionTotal / count) * 100) / 100;

        const startDate = plan.constructionStartDate ? new Date(plan.constructionStartDate) : new Date();

        for (let i = 0; i < count; i++) {
            const d = new Date(startDate);
            d.setMonth(d.getMonth() + i);
            rows.push({
                label: 'CUOTAS CONSTRUCCIÓN',
                amount: installmentAmount,
                dueDate: d.toISOString().split('T')[0],
            });
        }
    }

    // 4. Contra entrega
    if (plan.deliveryAmount > 0) {
        rows.push({
            label: 'CONTRA ENTREGA',
            amount: plan.deliveryAmount,
            dueDate: 'EN ENTREGA',
        });
    }

    return rows;
}

/** Formats a date string like "25/03/2025" from an ISO date */
export function formatPaymentDate(isoDate: string): string {
    if (!isoDate || isoDate === 'EN ENTREGA' || isoDate === 'EN FIRMA') return isoDate;
    try {
        const d = new Date(isoDate);
        const day = String(d.getUTCDate()).padStart(2, '0');
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const year = d.getUTCFullYear();
        return `${day}/${month}/${year}`;
    } catch {
        return isoDate;
    }
}
