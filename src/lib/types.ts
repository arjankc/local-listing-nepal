export type LanguageMix = 'english' | 'nepali' | 'bilingual'

export interface BusinessBrief {
  businessName: string
  category: string
  location: string
  phone: string
  website: string
  services: string
  differentiators: string
  targetCustomer: string
  languageMix: LanguageMix
}

export interface ModelOption {
  id: string
  label: string
  vramHint: string
}

export interface ParsedSection {
  title: string
  body: string
}

export const EMPTY_BRIEF: BusinessBrief = {
  businessName: '',
  category: '',
  location: '',
  phone: '',
  website: '',
  services: '',
  differentiators: '',
  targetCustomer: '',
  languageMix: 'bilingual',
}

export const REQUIRED_HEADINGS = [
  'Google Business — Short description',
  'Google Business — Full description',
  'Suggested categories and services',
  'Facebook — About',
  'Facebook — Starter posts',
  'Marketplace listing (if applicable)',
  'Nepali — Short description',
  'Nepali — Full description',
  'Local search phrases',
  'Assumptions / questions for the business',
] as const
