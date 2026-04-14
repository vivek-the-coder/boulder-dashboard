export interface Bid {
  vendor: string;
  amount: number;
  received: string;
  status: 'recommended' | 'backup' | 'excluded' | 'preferred' | 'pending';
  scopeComplete: 'Complete' | 'Partial' | 'Incomplete';
  inclusions: string;
  exclusions: string;
  alternates: string;
  qualifications: string;
  leveled: boolean;
  preferred: boolean;
  notes: string;
  rank: number | string;
}

export interface Risk {
  icon: string;
  label: string;
  desc: string;
}

export interface Package {
  id: number;
  order: number;
  name: string;
  trade: string;
  pm: string;
  project: string;
  csi: string;
  dueDate: string;
  onSiteDate: string | null;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: string;
  budget: number;
  lowBid: number | null;
  selectedVendor: string | null;
  awardAmount: number | null;
  risk: 'High' | 'Medium' | 'Low';
  longLead: boolean;
  urgent: boolean;
  overdue: boolean;
  bidsReceived: number;
  coverageCount: number;
  contractStatus: string;
  dropboxFolder: string;
  warranties: string;
  vendorData: string;
  notes: string;
  risks: Risk[];
  contractSteps: string[];
  contractProgress: number;
}

export interface User {
  name: string;
  email: string;
  role: string;
  password: string;
  joined?: string;
  prefs?: Record<string, boolean>;
}

export type ViewType = 
  | 'all' 
  | 'urgent' 
  | 'overdue' 
  | 'this-week' 
  | 'upcoming' 
  | 'ready-award' 
  | 'awarded' 
  | 'executed' 
  | 'bidding' 
  | 'on-hold'
  | 'long-lead'
  | 'missing-coverage'
  | 'high-risk'
  | 'contract-pending'
  | 'by-project'
  | 'by-pm'
  | 'by-trade';
