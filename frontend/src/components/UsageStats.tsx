// components/UsageStats.tsx

import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import type { UsageStats } from '../types';

interface UsageStatsProps {
  stats: UsageStats;
  isLoading?: boolean;
}

export const UsageStats: React.FC<UsageStatsProps> = ({ stats, isLoading = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getUsagePercentage = () => {
    const nextTierThreshold = stats.currentUsage < 1000 ? 1000 
      : stats.currentUsage < 100000 ? 100000 
      : stats.currentUsage < 1000000 ? 1000000 
      : Infinity;
    
    return Math.min((stats.currentUsage / nextTierThreshold) * 100, 100);
  };

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Current Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">{stats.currentUsage.toLocaleString()} calls</p>
              <p className="text-sm text-gray-500">
                {formatDate(stats.periodStart)} - {formatDate(stats.periodEnd)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{stats.remainingCredits.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Credits remaining</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Usage</span>
              <span>{getUsagePercentage().toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${getUsagePercentage()}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
