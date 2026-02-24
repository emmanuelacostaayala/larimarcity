export type ClientType = 'PERSONA_FISICA' | 'SOCIEDAD';
export type Currency = 'EUR' | 'USD';
export type ProjectType = 'PRIME_TOWERS' | 'BREEZE_TOWERS' | 'TOWNHOUSES';

export interface PersonClient {
  type: 'PERSONA_FISICA';
  fullName: string;
  passportOrDni: string;
  civilStatus: string;
  address: string;
  email: string;
  phone: string;
}

export interface CompanyClient {
  type: 'SOCIEDAD';
  companyName: string;
  rncOrCif: string;
  legalRepresentative: string;
  representativeId: string;
  address: string;
  email: string;
  phone: string;
}

export type Client = PersonClient | CompanyClient;

export interface PropertyDetails {
  project: ProjectType;
  unitNumber: string;
  level: string;
  squareMeters: number;
  bedrooms: number;
  bathrooms: number;
}

export interface PaymentPlan {
  isUpfront: boolean; // If true, skip quotas and generate single payment clause
  currency: Currency;
  totalPrice: number;
  // Below fields are required if isUpfront is false
  reserveAmount?: number;
  initialAmount?: number;
  monthlyQuotasCount?: number;
  monthlyQuotaAmount?: number;
  deliveryBalance?: number;
}

export interface SpecialClauses {
  earlyPaymentInterest: boolean; // if true, inflates text with 7% annual interest clause for early payment
  golfMembership: boolean; // if true, includes golf club membership text and table
}

export interface ContractData {
  contractId: string;
  contractDate: string; // YYYY-MM-DD
  client: Client;
  property: PropertyDetails;
  payment: PaymentPlan;
  clauses: SpecialClauses;
}
