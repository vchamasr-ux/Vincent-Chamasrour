
export enum OnboardingStep {
  WELCOME = 'WELCOME',
  VERIFICATION = 'VERIFICATION',
  KYC = 'KYC',
  IDENTITY = 'IDENTITY',
  INTERESTS = 'INTERESTS',
  ANALYSIS = 'ANALYSIS',
  AI_SETUP = 'AI_SETUP',
  CARD_SELECTION = 'CARD_SELECTION',
  DASHBOARD = 'DASHBOARD'
}

export interface Persona {
  personaName: string;
  description: string;
  suggestedPockets: string[];
}

export interface AIMode {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface AISettings {
  modeId: string;
  goals: string[];
  accountsLinked: boolean;
  welcomeMessage?: string;
}

export interface UserState {
  name: string;
  phoneNumber?: string;
  email: string;
  address?: string;
  dob?: string;
  ssnLast4?: string;
  interests: string[];
  persona: Persona | null;
  aiSettings: AISettings | null;
  selectedCardId: string;
}

export interface CardDesign {
  id: string;
  name: string;
  gradient: string;
  textColor: string;
}

export interface InterestOption {
  id: string;
  label: string;
  emoji: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
}

export type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'LOAN' | 'INVESTMENT';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  accountNumber: string;
  limit?: number; // For credit
  dueDate?: string; // For loans/credit
  apy?: number; // For savings
  isLocked?: boolean; // New: Card lock state
}

export interface GhostCard {
  id: string;
  name: string;
  number: string;
  cvc: string;
  expiry: string;
  status: 'ACTIVE' | 'BURNED';
  maxSpend: number;
}

export interface SharedTabMember {
  name: string;
  avatarColor: string;
  balance: number; // Positive = Owed to them, Negative = They owe
}

export interface SharedTab {
  id: string;
  name: string;
  emoji: string;
  totalSpend: number;
  myBalance: number; // Positive = I am owed, Negative = I owe
  members: SharedTabMember[];
}

export interface PocketHistory {
  date: string;
  balance: number;
}

export interface SmartPocket {
  id: string;
  name: string;
  emoji: string;
  balance: number;
  goal: number;
  color: string;
  autoSave: boolean;
  history?: PocketHistory[]; // For detail chart
}

export interface Contact {
  id: string;
  name: string;
  handle: string; // Zelle handle (email/phone)
  avatarColor: string;
  recent?: boolean;
}

export interface Perk {
  id: string;
  merchant: string;
  offer: string;
  category: string;
  expires: string;
  logoBg: string;
  activated: boolean;
  aiReason?: string; // New: AI justification
}

export interface SocialComment {
  id: string;
  user: string;
  text: string;
  time: string;
}

export interface SquadMember {
  name: string;
  avatarColor: string;
  progress: number; // 0-100
  status: string;
}

export interface SocialGroupData {
  goalName: string;
  members: SquadMember[];
}

export interface SocialDebtFreeData {
  count: number;
  friends: string[];
}

export interface SocialPost {
  id: string;
  user: string;
  avatarColor: string;
  type: 'SAVING' | 'GOAL' | 'MILESTONE';
  content: string;
  time: string;
  likes: number;
  comments: SocialComment[];
  metric?: string; // e.g. "$120 saved"
  hasLiked?: boolean; // Local state
  groupData?: SocialGroupData; // For squad goals
  debtData?: SocialDebtFreeData; // For debt free
}

export interface Transaction {
  id: number;
  merchant: string;
  amount: number;
  category: string;
  date: string;
  recurring: boolean;
  icon?: string; // Optional logo
  location?: string;
  status?: 'Completed' | 'Pending';
}
