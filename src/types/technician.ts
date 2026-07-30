export interface TechnicianApplication {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  serviceCategories: string[];
  skills: string;
  experience: number;
  license: string;
  availableDays: string[];
  availableFrom: string;
  availableTo: string;
  about: string;
  declarationAccepted: boolean;
}
