
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, MessageSquare, DollarSign, Clock } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface DisputeData {
  id: string;
  content_id: string;
  reason: string;
  description: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
  flagged_by: string | null;
  admin_id: string | null;
  booking: {
    id: string;
    event_date: string;
    total_price: number;
    guest_count: number;
    venue: {
      name: string;
    } | null;
    guest: {
      full_name: string | null;
    } | null;
    host: {
      full_name: string | null;
      business_name: string | null;
    } | null;
  } | null;
}

const BookingDisputes: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: disputes, isLoading, error } = useQuery({
    queryKey: ['admin-booking-disputes', searchTerm],
    queryFn: async () => {
      console.log('Fetching booking disputes...');

      let query = supabase
        .from('flagged_content')
        .select(`
          *,
          booking:bookings!flagged_content_content_id_fkey(
            id,
            event_date,
            total_price,
            guest_count,
            venue:venues(name),
            guest:profiles!bookings_guest_id_fkey(full_name),
            host:profiles!bookings_host_id_fkey(full_name, business_name)
          )
        `)
        .eq('content_type', 'booking')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('reason', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching disputes:', error);
        throw error;
      }

      return (data || []).map(dispute => ({
        id: dispute.id,
        content_id: dispute.content_id,
        reason: dispute.reason,
        description: dispute.description,
        status: dispute.status,
        created_at: dispute.created_at,
        resolved_at: dispute.resolved_at,
        flagged_by: dispute.flagged_by,
        admin_id: dispute.admin_id,
        booking: dispute.booking
      })) as DisputeData[];
    },
    enabled: hasPermission(['super_admin', 'platform_manager', 'support_agent']),
  });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'destructive';
      case 'investigating': return 'secondary';
      case 'resolved': return 'default';
      default: return 'secondary';
    }
  };

  const pendingDisputes = disputes?.filter(d => d.status === 'pending').length || 0;
  const investigatingDisputes = disputes?.filter(d => d.status === 'investigating').length || 0;
  const resolvedDisputes = disputes?.filter(d => d.status === 'resolved').length || 0;
  const totalAmount = disputes?.reduce((sum, dispute) => sum + Number(dispute.booking?.total_price || 0), 0) || 0;

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDisputes}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investigating</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investigatingDisputes}</div>
            <p className="text-xs text-muted-foreground">
              Under review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedDisputes}</div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount at Risk</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From disputed bookings
            </p>
          </CardContent>
        </Card>
      </div>

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dispute Details</TableHead>
                <TableHead>Booking Info</TableHead>
                <TableHead>Parties</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes?.map((dispute) => (
                <TableRow key={dispute.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{dispute.reason}</div>
                      <div className="text-sm text-gray-500">
                        #{dispute.id.slice(0, 8)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{dispute.booking?.venue?.name || 'Unknown Venue'}</div>
                      <div className="text-sm text-gray-500">
                        {dispute.booking?.event_date ? formatDate(dispute.booking.event_date) : 'No date'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">
                        <strong>Guest:</strong> {dispute.booking?.guest?.full_name || 'Unknown'}
                      </div>
                      <div className="text-sm">
                        <strong>Host:</strong> {dispute.booking?.host?.business_name || dispute.booking?.host?.full_name || 'Unknown'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      ${Number(dispute.booking?.total_price || 0).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(dispute.status)}>
                      {dispute.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(dispute.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Investigate
                      </Button>
                      <Button variant="outline" size="sm">
                        Resolve
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingDisputes;
