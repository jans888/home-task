import type { WhyInterested, PropertyType } from '../support/types';

export interface FormData {
  zipCode: string;
  whyInterested: WhyInterested[];
  propertyType: PropertyType;
  name: string;
  email: string;
  phone: string;
}

export const validFormData: FormData = {
  zipCode: '68901',
  whyInterested: ['Safety', 'Therapy'],
  propertyType: 'Owned House / Condo',
  name: 'Jan Test',
  email: 'jan.test@example.com',
  phone: '3135551212',
};

export interface SorryFlowData {
  outOfAreaZipCode: string;
  email: string;
  confirmationMessage: string;
}

export const sorryFlowData: SorryFlowData = {
  outOfAreaZipCode: '11111', // Invalid or out-of-area ZIP code
  email: 'jan.sorry@example.com',
  confirmationMessage: 'Thank you for your interest, we will contact you when our service becomes available in your area!'
};

export const invalidFormData = {
  zipCode: '11111', // Invalid or unsupported ZIP
};
