
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertTriangle } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useBookingDisputes } from './hooks/useBookingDisputes';
import DisputeMetricsCards from './components/DisputeMetricsCards';
import DisputesTable from './components/DisputesTable';
import { calculateDisputeMetrics } from './utils/disputeUtils';

const BookingDisputes: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: disputes, isLoading, error } = useBookingDisputes(
    searchTerm, 
    hasPermission(['super_admin', 'platform_manager', 'support_agent'])
  );

  if (!hasPermission(['super_admin', 'platform_manager', 'support_agent'])) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">You don't have permission to view disputes.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Disputes</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Loading disputes...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Disputes</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error loading disputes. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const metrics = calculateDisputeMetrics(disputes);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Disputes</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage booking disputes and resolution processes
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <AlertTriangle className="h-3 w-3" />
            <span>{disputes?.length || 0} Total Disputes</span>
          </Badge>
        </div>
      </div>

      <DisputeMetricsCards metrics={metrics} />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Dispute Resolution Center</CardTitle>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search disputes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DisputesTable disputes={disputes || []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingDisputes;
