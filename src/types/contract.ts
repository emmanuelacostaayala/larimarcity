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
  constitutionData?: string; // Registry info
}

export type Party = PhysicalPerson | Company;

export type Currency = 'EUR' | 'USD';

export type PropertyType = 'Apartamento' | 'Villa' | 'TownHouse';

export interface Property {
  project: string;
  unitNumber: string;
  level: string | number;
  squareMeters: number;          // Total m² (exterior including terrace)
  interiorSqMeters?: number;     // m² interiores (for maintenance calc)
  terraceSqMeters?: number;      // m² de terraza
  rooms: number;
  bathrooms: number;
  airConditioners?: number;      // Aires acondicionados
  parkingSpaces?: number;
  propertyType?: PropertyType;
  // Villa-specific fields
  loteNumber?: string;           // e.g. "Lote 8"
  loteSqMeters?: number;         // e.g. 450
  level1SqMeters?: number;       // m² primer nivel (villas 2 pisos)
  level2SqMeters?: number;       // m² segundo nivel (villas 2 pisos)
}

export type InstallmentPeriodicity = 'Mensual' | 'Trimestral' | 'Semestral';

export interface Installment {
  amount: number;
  dueDate: string; // ISO date or "EN ENTREGA"
  label: string;   // e.g. "RESERVA", "INICIAL", "CUOTAS CONSTRUCCIÓN"
}

export interface PaymentPlan {
  currency: Currency;
  basePrice?: number;             // Original list price before discount (optional)
  totalPrice: number;             // Final negotiated price
  exchangeRate?: number;          // Forex rate EUR→USD (fetched from BCE, then locked)
  isCash: boolean;
  reservationAmount: number;
  reservationDate?: string;       // ISO date for reservation payment
  downPaymentAmount: number;
  downPaymentDate?: string;       // ISO date for down payment
  constructionInstallments: number;  // number of construction payments
  installmentPeriodicity?: InstallmentPeriodicity; // Mensual / Trimestral / Semestral
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
  coSigner?: PhysicalPerson;  // Second buyer (e.g. married couple)
  broker?: string;            // Broker name
  seller?: string;            // Closer/Vendedor name
  property: Property;
  paymentPlan: PaymentPlan;
  clauses: SpecialClauses;
}
