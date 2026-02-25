export type PartyType = 'Fisica' | 'Sociedad';

export interface BaseParty {
  type: PartyType;
  name: string;
  email?: string;
  phone?: string;
  address: string;
}

export interface PhysicalPerson extends BaseParty {
  type: 'Fisica';
  documentType: 'Pasaporte' | 'DNI' | 'Cedula';
  documentNumber: string;
  civilStatus: 'Soltero' | 'Casado' | 'Divorciado' | 'Viudo';
  nationality: string;
}

export interface Company extends BaseParty {
  type: 'Sociedad';
  rncCif: string; // RNC for DO, CIF for ES, etc.
  legalRepresentative: PhysicalPerson;
  constitutionData: string; // Registry info
}

export type Party = PhysicalPerson | Company;

export type Currency = 'EUR' | 'USD';

export interface Property {
  project: 'Prime Towers' | 'Breeze Towers' | 'Townhouses' | string;
  unitNumber: string;
  level: string | number;
  squareMeters: number;
  rooms: number;
  bathrooms: number;
  parkingSpaces?: number;
}

export interface Installment {
  amount: number;
  dueDate: string; // ISO date or "EN ENTREGA"
  label: string;   // e.g. "RESERVA", "INICIAL", "CUOTAS CONSTRUCCIÓN"
}

export interface PaymentPlan {
  currency: Currency;
  basePrice?: number;             // Original list price before discount (optional)
  totalPrice: number;            // Final negotiated price
  exchangeRate?: number;          // Forex rate to USD if currency is EUR (optional)
  isCash: boolean;
  reservationAmount: number;
  reservationDate?: string;       // ISO date for reservation payment
  downPaymentAmount: number;
  downPaymentDate?: string;       // ISO date for down payment
  constructionInstallments: number;  // number of monthly construction payments
  constructionStartDate?: string; // ISO date of first construction installment
  installments: Installment[];    // auto-computed or manual
  deliveryAmount: number;         // Saldo Contra Entrega
}

export interface SpecialClauses {
  earlyPaymentInterest: boolean; // pago_anticipado -> 7% annual
  golfMembership: boolean;
  qualityMemory: boolean; // Annex
  vacationRental?: boolean; // Rent suffix appending
}

export interface ContractPayload {
  contractId?: string;
  date: string; // ISO Date
  client: Party;
  property: Property;
  paymentPlan: PaymentPlan;
  clauses: SpecialClauses;
}
