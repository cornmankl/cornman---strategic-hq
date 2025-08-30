import type { ReactNode } from 'react';

// Discriminated union for different card types in the Product section
export type ProductCardData = GeneratorCardData | ImageGeneratorCardData;

export interface ImageGeneratorCardData {
  id: string;
  type: 'image'; // Discriminating property
  title: string;
  description: string;
  buttonText: string;
  placeholder: string;
}

export interface GeneratorCardData {
  id: string;
  type: 'generator'; // Discriminating property
  title: string;
  description: string;
  buttonText: string;
  prompt: string;
  onSaveAsProject?: (title: string) => void;
}

export interface ComposerCardData {
  id: string;
  title: 'Instagram' | 'TikTok' | 'X (Twitter)' | 'Facebook' | 'YouTube';
  description: string;
  generateButtonText: string;
  postButtonText: string;
  scheduleButtonText: string;
  promptGenerator: () => string;
  postUrl: string;
  icon: ReactNode;
  onSchedule: (content: string) => void;
}

export interface ScheduledPost {
  id: string;
  platform: 'Instagram' | 'TikTok' | 'X (Twitter)' | 'Facebook' | 'YouTube';
  icon: ReactNode;
  content: string;
  scheduledAt: string;
  publishedAt?: string;
  status: 'scheduled' | 'publishing' | 'published';
}

// --- SIMULATED BACKEND & BUSINESS OS TYPES ---

export interface Sale {
  id: string;
  product: string;
  amount: number;
  time: string;
  customerId: string;
  // Additional properties needed by MobileApp.tsx
  items?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  createdAt: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  threshold: number; // Low stock warning threshold
  unit: string; // e.g., 'kg', 'pcs', 'liter'
  cost: number; // Cost per unit
  // Additional properties needed by MobileApp.tsx
  price: number;
  category: string;
  supplier: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  lastSeen: string;
  totalSpent: number;
}

export interface Invoice {
  id: string;
  customerName: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

export interface Financials {
  totalRevenue: number;
  cogs: number;
  expenses: number;
  profit: number;
  goal: number;
}

// --- PROJECT C.R.E.W. TYPES ---
export interface ProjectTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'Perancangan' | 'Dalam Perlaksanaan' | 'Selesai';
  tasks: ProjectTask[];
}

export interface RoadmapPhase {
  id: string;
  title: string;
  status: 'Complete' | 'In Progress' | 'Planned';
  weeks: number;
  tasks: string[];
}
