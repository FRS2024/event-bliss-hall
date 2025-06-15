
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
  booking_event_date: string | null;
  booking_total_price: number | null;
  booking_guest_count: number | null;
  venue_name: string | null;
  guest_name: string | null;
  host_name: string | null;
  host_business: string | null;
}

const BookingDisputes: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: disputes, isLoading, error } = useQuery({
    queryKey: ['admin-booking-disputes', searchTerm],
    queryFn: async () => {
      console.log('Fetching booking disputes...');

      // First get flagged content for bookings
      let query = supabase
        .from('flagged_content')
        .select('*')
        .eq('content_type', 'booking')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('reason', `%${searchTerm}%`);
      }

      const { data: flaggedData, error: flaggedError } = await query;

      if (flaggedError) {
        console.error('Error fetching flagged content:', flaggedError);
        throw flaggedError;
      }

      if (!flaggedData || flaggedData.length === 0) {
        return [];
      }

      // Get all unique booking IDs
      const bookingIds = [...new Set(flaggedData.map(f => f.content_id).filter(Boolean))];

      if (bookingIds.length === 0) {
        return flaggedData.map(dispute => ({
          id: dispute.id,
          content_id: dispute.content_id,
          reason: dispute.reason,
          description: dispute.description,
          status: dispute.status,
          created_at: dispute.created_at,
          resolved_at: dispute.resolved_at,
          flagged_by: dispute.flagged_by,
          admin_id: dispute.admin_id,
          booking_event_date: null,
          booking_total_price: null,
          booking_guest_count: null,
          venue_name: null,
          guest_name: null,
          host_name: null,
          host_business: null
        }));
      }

      // Fetch booking data
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, event_date, total_price, guest_count, venue_id, guest_id, host_id')
        .in('id', bookingIds);

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        throw bookingsError;
      }

      // Get all unique IDs for related data
      const venueIds = [...new Set(bookingsData?.map(b => b.venue_id).filter(Boolean) || [])];
      const guestIds = [...new Set(bookingsData?.map(b => b.guest_id).filter(Boolean) || [])];
      const hostIds = [...new Set(bookingsData?.map(b => b.host_id).filter(Boolean) || [])];

      // Fetch related data
      const [venuesData, guestsData, hostsData] = await Promise.all([
        venueIds.length > 0 
          ? supabase.from('venues').select('id, name').in('id', venueIds)
          : Promise.resolve({ data: [], error: null }),
        guestIds.length > 0 
          ? supabase.from('profiles').select('id, full_name').in('id', guestIds)
          : Promise.resolve({ data: [], error: null }),
        hostIds.length > 0
          ? supabase.from('profiles').select('id, full_name, business_name').in('id', hostIds)
          : Promise.resolve({ data: [], error: null })
      ]);

      // Create lookup maps
      const bookingsMap = new Map(bookingsData?.map(b => [b.id, b]) || []);
      const venuesMap = new Map(venuesData.data?.map(v => [v.id, v]) || []);
      const guestsMap = new Map(guestsData.data?.map(g => [g.id, g]) || []);
      const hostsMap = new Map(hostsData.data?.map(h => [h.id, h]) || []);

      // Combine data
      return flaggedData.map(dispute => {
        const booking = bookingsMap.get(dispute.content_id);
        const venue = booking ? venuesMap.get(booking.venue_id) : null;
        const guest = booking ? guestsMap.get(booking.guest_id) : null;
        const host = booking ? hostsMap.get(booking.host_id) : null;

        return {
          id: dispute.id,
          content_id: dispute.content_id,
          reason: dispute.reason,
          description: dispute.description,
          status: dispute.status,
          created_at: dispute.created_at,
          resolved_at: dispute.resolved_at,
          flagged_by: dispute.flagged_by,
          admin_id: dispute.admin_id,
          booking_event_date: booking?.event_date || null,
          booking_total_price: booking?.total_price || null,
          booking_guest_count: booking?.guest_count || null,
          venue_name: venue?.name || null,
          guest_name: guest?.full_name || null,
          host_name: host?.full_name || null,
          host_business: host?.business_name || null
        };
      });
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
  const totalAmount = disputes?.reduce((sum, dispute) => sum + Number(dispute.booking_total_price || 0), 0) || 0;

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
                      <div className="font-medium">{dispute.venue_name || 'Unknown Venue'}</div>
                      <div className="text-sm text-gray-500">
                        {dispute.booking_event_date ? formatDate(dispute.booking_event_date) : 'No date'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">
                        <strong>Guest:</strong> {dispute.guest_name || 'Unknown'}
                      </div>
                      <div className="text-sm">
                        <strong>Host:</strong> {dispute.host_business || dispute.host_name || 'Unknown'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      ${Number(dispute.booking_total_price || 0).toLocaleString()}
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
