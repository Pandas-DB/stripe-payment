// types/index.ts

export interface UsageTier {
  name: string;
  description: string;
  price: string;
  usage: string;
  features: string[];
  minUsage: number;
  maxUsage: number;
  stripePriceId: string;
}

export interface UsageStats {
  currentUsage: number;
  periodStart: string;
  periodEnd: string;
  remainingCredits: number;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  createdAt: string;
  creditsAdded: number;
}

export interface APIError {
  message: string;
  code?: string;
}

export interface CheckoutResponse {
  url: string;
}
