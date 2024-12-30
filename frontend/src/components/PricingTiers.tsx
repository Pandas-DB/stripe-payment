// components/PricingTiers.tsx

import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Package, Zap, Building } from 'lucide-react';
import type { UsageTier } from '../types';

interface PricingTiersProps {
  currentUsage: number;
  onSelectTier: (tier: UsageTier) => void;
  isLoading?: boolean;
}

const TIERS: UsageTier[] = [
  {
    name: 'Free',
    description: 'Perfect for testing and small projects',
    price: '€0',
    usage: '0-1,000',
    minUsage: 0,
    maxUsage: 1000,
    stripePriceId: 'free_tier',
    features: ['Basic API access', 'Community support'],
  },
  {
    name: 'Growth',
    description: 'For growing applications',
    price: '€9',
    usage: '1K-100K',
    minUsage: 1001,
    maxUsage: 100000,
    stripePriceId: 'price_growth_tier',
    features: ['Extended API access', 'Email support', 'Usage analytics'],
  },
  {
    name: 'Scale',
    description: 'For high-volume applications',
    price: '€79',
    usage: '100K-1M',
    minUsage: 100001,
    maxUsage: 1000000,
    stripePriceId: 'price_scale_tier',
    features: ['Priority API access', 'Premium support', 'Advanced analytics'],
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: 'Custom',
    usage: '1M+',
    minUsage: 1000001,
    maxUsage: Infinity,
    stripePriceId: 'price_enterprise_tier',
    features: ['Dedicated support', 'Custom integrations', 'SLA guarantee'],
  },
];

export const PricingTiers: React.FC<PricingTiersProps> = ({
  currentUsage,
  onSelectTier,
  isLoading = false,
}) => {
  const getIcon = (tierName: string) => {
    switch (tierName) {
      case 'Free':
        return Package;
      case 'Growth':
        return Zap;
      case 'Scale':
        return CreditCard;
      case 'Enterprise':
        return Building;
      default:
        return Package;
    }
  };

  const isCurrentTier = (tier: UsageTier) => 
    currentUsage >= tier.minUsage && currentUsage < tier.maxUsage;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {TIERS.map((tier) => {
        const Icon = getIcon(tier.name);
        const current = isCurrentTier(tier);
        
        return (
          <Card 
            key={tier.name}
            className={`relative ${current ? 'border-blue-500 border-2' : ''}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold">{tier.price}</p>
              <p className="text-sm text-gray-500">{tier.usage} calls</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
              <ul className="space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              {current ? (
                <div className="mt-4">
                  <Alert>
                    <AlertDescription>
                      Current tier based on your usage
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <Button 
                  className="w-full mt-4"
                  onClick={() => onSelectTier(tier)}
                  disabled={tier.name === 'Free' || tier.name === 'Enterprise' || isLoading}
                >
                  {isLoading ? 'Loading...' : tier.name === 'Enterprise' ? 'Contact Sales' : 'Select Plan'}
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
