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
  dueDate: string; // ISO date or description
  description?: string;
}

export interface PaymentPlan {
  currency: Currency;
  totalPrice: number;
  isCash: boolean;
  reservationAmount: number;
  downPaymentAmount: number;
  installments: Installment[];
  deliveryAmount: number; // Saldo Contra Entrega
}

export interface SpecialClauses {
  earlyPaymentInterest: boolean; // pago_anticipado -> 7% annual
  golfMembership: boolean;
  qualityMemory: boolean; // Annex
}

export interface ContractPayload {
  contractId?: string;
  date: string; // ISO Date
  client: Party;
  property: Property;
  paymentPlan: PaymentPlan;
  clauses: SpecialClauses;
}
