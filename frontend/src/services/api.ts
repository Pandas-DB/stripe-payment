// services/api.ts

import { UsageStats, PaymentHistory, CheckoutResponse, APIError } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class APIService {
  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'An error occurred');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUsage(): Promise<UsageStats> {
    return this.fetch<UsageStats>('/usage');
  }

  async getPaymentHistory(): Promise<PaymentHistory[]> {
    return this.fetch<PaymentHistory[]>('/payments/history');
  }

  async createCheckoutSession(tierId: string): Promise<CheckoutResponse> {
    return this.fetch<CheckoutResponse>('/checkout/create', {
      method: 'POST',
      body: JSON.stringify({ tierId }),
    });
  }

  async getRemainingCredits(): Promise<{ credits: number }> {
    return this.fetch<{ credits: number }>('/credits/balance');
  }
}

export const apiService = new APIService();
