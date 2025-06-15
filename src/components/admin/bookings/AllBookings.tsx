
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, DollarSign, Users, TrendingUp, Search, Filter } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface BookingData {
  id: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  guest_count: number;
  total_price: number;
  status: string;
  special_requests: string | null;
  created_at: string;
  guest_name: string | null;
  guest_phone: string | null;
  venue_name: string | null;
  venue_city: string | null;
  host_name: string | null;
  host_business: string | null;
}

const AllBookings: React.FC = () => {
  const { hasPermission } = useAdminAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [dateFilter, setDateFilter] = React.useState('all');

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['admin-all-bookings', searchTerm, statusFilter, dateFilter],
    queryFn: async () => {
      console.log('Fetching all bookings...');

      // First get all bookings
      let bookingQuery = supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        bookingQuery = bookingQuery.eq('status', statusFilter);
      }

      const { data: bookingsData, error: bookingsError } = await bookingQuery;

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        throw bookingsError;
      }

      if (!bookingsData || bookingsData.length === 0) {
        return [];
      }

      // Get all unique IDs
      const guestIds = [...new Set(bookingsData.map(b => b.guest_id).filter(Boolean))];
      const hostIds = [...new Set(bookingsData.map(b => b.host_id).filter(Boolean))];
      const venueIds = [...new Set(bookingsData.map(b => b.venue_id).filter(Boolean))];

      // Fetch related data
      const [guestsData, hostsData, venuesData] = await Promise.all([
        guestIds.length > 0 
          ? supabase.from('profiles').select('id, full_name, phone').in('id', guestIds)
          : Promise.resolve({ data: [], error: null }),
        hostIds.length > 0
          ? supabase.from('profiles').select('id, full_name, business_name').in('id', hostIds)
          : Promise.resolve({ data: [], error: null }),
        venueIds.length > 0
          ? supabase.from('venues').select('id, name, city').in('id', venueIds)
          : Promise.resolve({ data: [], error: null })
      ]);

      // Create lookup maps
      const guestsMap = new Map(guestsData.data?.map(g => [g.id, g]) || []);
      const hostsMap = new Map(hostsData.data?.map(h => [h.id, h]) || []);
      const venuesMap = new Map(venuesData.data?.map(v => [v.id, v]) || []);

      // Combine data
      const combinedData = bookingsData.map(booking => {
        const guest = guestsMap.get(booking.guest_id);
        const host = hostsMap.get(booking.host_id);
        const venue = venuesMap.get(booking.venue_id);

        return {
          id: booking.id,
          event_date: booking.event_date,
          start_time: booking.start_time,
          end_time: booking.end_time,
          guest_count: booking.guest_count,
          total_price: booking.total_price,
          status: booking.status,
          special_requests: booking.special_requests,
          created_at: booking.created_at,
          guest_name: guest?.full_name || null,
          guest_phone: guest?.phone || null,
          venue_name: venue?.name || null,
          venue_city: venue?.city || null,
          host_name: host?.full_name || null,
          host_business: host?.business_name || null
        };
      });

      // Apply search filter
      if (searchTerm) {
        return combinedData.filter(booking => 
          booking.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.venue_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.host_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.host_business?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return combinedData;
    },
    enabled: hasPermission(['super_admin', 'platform_manager', 'support_agent']),
  });

  if (!hasPermission(['super_admin', 'platform_manager', 'support_agent'])) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">You don't have permission to view bookings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Bookings</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Loading bookings...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Bookings</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error loading bookings. Please try again.</p>
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

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const totalRevenue = bookings?.reduce((sum, booking) => sum + Number(booking.total_price), 0) || 0;
  const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
  const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
  const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Bookings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all platform bookings and reservations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{bookings?.length || 0} Total Bookings</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From all bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedBookings}</div>
            <p className="text-xs text-muted-foreground">
              Active bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedBookings}</div>
            <p className="text-xs text-muted-foreground">
              Successfully finished
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Bookings Management</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking Details</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings?.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">#{booking.id.slice(0, 8)}...</div>
                      <div className="text-sm text-gray-500">
                        {booking.guest_count} guests
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {booking.guest_name || 'Unnamed Guest'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.guest_phone || 'No phone'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.venue_name || 'Unknown Venue'}</div>
                      <div className="text-sm text-gray-500">{booking.venue_city || 'Unknown City'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{formatDate(booking.event_date)}</div>
                      <div className="text-sm text-gray-500">
                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">${Number(booking.total_price).toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
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

export default AllBookings;
