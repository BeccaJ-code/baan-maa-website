// =============================================================================
// BAAN MAA DOG RESCUE - Type Definitions
// =============================================================================

// =============================================================================
// User Types
// =============================================================================

export type Role = 'ADMIN' | 'EDITOR' | 'DOG_MANAGER';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
  exp?: number;
  iat?: number;
}

// =============================================================================
// Dog Types
// =============================================================================

export type DogStatus = 'AVAILABLE' | 'ADOPTED' | 'SPONSORED' | 'FOSTERED' | 'MEDICAL' | 'DECEASED';
export type DogSize = 'SMALL' | 'MEDIUM' | 'LARGE';
export type DogSex = 'MALE' | 'FEMALE';

export interface Dog {
  id: string;
  name: string;
  slug: string;
  status: string; // DogStatus values stored as string in SQLite
  age: string | null;
  sex: string | null; // DogSex values stored as string in SQLite
  size: string | null; // DogSize values stored as string in SQLite
  breed: string | null;
  shortDescription: string | null;
  fullDescription: string | null;
  rescueStory: string | null;
  goodWithKids: boolean;
  goodWithDogs: boolean;
  goodWithCats: boolean;
  houseTrained: boolean;
  traits: string[];
  images: string[];
  featuredImage: string | null;
  sponsorshipGoal: number | null;
  sponsorshipTotal: number;
  intakeDate: Date | null;
  adoptedDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DogFilters {
  status?: DogStatus | DogStatus[];
  size?: DogSize | DogSize[];
  sex?: DogSex;
  goodWithKids?: boolean;
  goodWithDogs?: boolean;
  goodWithCats?: boolean;
}

// =============================================================================
// Event Types
// =============================================================================

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  date: Date;
  endDate: Date | null;
  location: string | null;
  isOnline: boolean;
  featuredImage: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// Project Types
// =============================================================================

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  goalAmount: number | null;
  raisedAmount: number;
  featuredImage: string | null;
  isActive: boolean;
  isPriority: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// Form Types
// =============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}

export interface AdoptionFormData {
  // Personal info
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;

  // Dog info
  dogId: string;
  dogName: string;

  // Living situation
  homeType: 'house' | 'apartment' | 'farm' | 'other';
  hasGarden: boolean;
  gardenFenced: boolean;
  rentOrOwn: 'rent' | 'own';
  landlordApproval?: boolean;

  // Household
  adultsInHome: number;
  childrenInHome: number;
  childrenAges?: string;
  allAgree: boolean;

  // Pet experience
  currentPets: string;
  previousDogs: boolean;
  vetName?: string;
  vetPhone?: string;

  // Work & lifestyle
  workSchedule: string;
  hoursAlone: number;
  exercisePlan: string;

  // Additional
  whyAdopt: string;
  additionalInfo?: string;

  honeypot?: string;
}

export interface VolunteerFormData {
  name: string;
  email: string;
  phone: string;
  country: string;

  // Volunteer type
  volunteerType: 'onsite' | 'remote' | 'foster' | 'transport';

  // Availability
  availability: string;
  startDate?: string;

  // Skills & experience
  experience: string;
  skills: string[];

  // Additional
  motivation: string;
  additionalInfo?: string;

  honeypot?: string;
}

// =============================================================================
// Donation Types
// =============================================================================

export type Currency = 'gbp' | 'usd' | 'eur' | 'thb';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
  minAmount: number;
  decimalDigits: number;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  gbp: { code: 'gbp', symbol: '£', name: 'British Pound', minAmount: 1, decimalDigits: 2 },
  usd: { code: 'usd', symbol: '$', name: 'US Dollar', minAmount: 1, decimalDigits: 2 },
  eur: { code: 'eur', symbol: '€', name: 'Euro', minAmount: 1, decimalDigits: 2 },
  thb: { code: 'thb', symbol: '฿', name: 'Thai Baht', minAmount: 20, decimalDigits: 0 },
};

export interface DonationConfig {
  projectId?: string;
  title: string;
  description?: string;
  presetAmounts: { amount: number; label?: string }[];
  allowCustomAmount: boolean;
  oneTimeAvailable: boolean;
  monthlyAvailable: boolean;
  defaultType: 'once' | 'monthly';
}

export interface CheckoutRequest {
  amount: number;
  currency: Currency;
  donationType: 'once' | 'monthly';
  projectId?: string;
  projectName?: string;
  successUrl: string;
  cancelUrl: string;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
