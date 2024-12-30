// components/PaymentPage.tsx

import React, { useState, useEffect } from 'react';
import { UsageStats } from './UsageStats';
import { PricingTiers } from './PricingTiers';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiService } from '../services/api';
import type { UsageStats as UsageStatsType, UsageTier, APIError } from '../types';

export const PaymentPage: React.FC = () => {
  const [stats, setStats] = useState<UsageStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchUsageStats();
  }, []);

  const fetchUsageStats = async () => {
    try {
      const data = await apiService.getCurrentUsage();
      setStats(data);
    } catch (err) {
      setError((err as APIError).message || 'Failed to load usage data');
    } finally {
      setLoading(false);
    }
  };

  const handleTierSelect = async (tier: UsageTier) => {
    if (tier.name === 'Free' || tier.name === 'Enterprise') {
      return;
    }

    setProcessingPayment(true);
    setError(null);

    try {
      const { url } = await apiService.createCheckoutSession(tier.stripePriceId);
      window.location.href = url;
    } catch (err) {
      setError((err as APIError).message || 'Failed to create checkout session');
      setProcessingPayment(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Usage & Billing</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {stats && <UsageStats stats={stats} isLoading={loading} />}

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Available Plans</h2>
        <PricingTiers 
          currentUsage={stats?.currentUsage || 0}
          onSelectTier={handleTierSelect}
          isLoading={processingPayment}
        />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments?.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: payment.currency
                      }).format(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.creditsAdded.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${payment.status === 'succeeded' ? 'bg-green-100 text-green-800' : 
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
