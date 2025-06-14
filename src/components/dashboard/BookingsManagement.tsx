
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { updateVenueAvailability } from '@/lib/api';
import { useUserRole } from '@/hooks/useUserRole';

const BookingsManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const userRole = useUserRole();

  // Host bookings query - for venues they own
  const { data: hostBookings, isLoading: hostLoading } = useQuery({
    queryKey: ['host-bookings'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          venues (
            name,
            city
          )
        `)
        .eq('host_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: userRole === 'host',
  });

  // Guest bookings query - for bookings they made
  const { data: guestBookings, isLoading: guestLoading } = useQuery({
    queryKey: ['guest-bookings'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          venues (
            name,
            city
          )
        `)
        .eq('guest_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: userRole === 'guest',
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ bookingId, status, venueId, eventDate }: { 
      bookingId: string; 
      status: string; 
      venueId: string; 
      eventDate: string; 
    }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) throw error;

      // Update venue availability based on booking status
      if (status === 'confirmed') {
        await updateVenueAvailability(venueId, eventDate, false);
      } else if (status === 'cancelled') {
        await updateVenueAvailability(venueId, eventDate, true);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['host-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['guest-bookings'] });
      const statusMessage = variables.status === 'confirmed' 
        ? 'Booking confirmed and venue availability updated'
        : variables.status === 'cancelled'
        ? 'Booking cancelled and venue availability updated'
        : 'Booking status updated successfully';
      toast.success(statusMessage);
    },
    onError: (error) => {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  });

  const handleStatusUpdate = (bookingId: string, status: string, venueId: string, eventDate: string) => {
    updateBookingMutation.mutate({ bookingId, status, venueId, eventDate });
  };

  // Determine which data to use based on user role
  const bookings = userRole === 'host' ? hostBookings : guestBookings;
  const isLoading = userRole === 'host' ? hostLoading : guestLoading;

  if (userRole === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading bookings...</div>
      </div>
    );
  }

  const getPageTitle = () => {
    return userRole === 'host' ? 'Bookings Management' : 'My Bookings';
  };

  const getPageDescription = () => {
    return userRole === 'host' 
      ? 'Manage your venue bookings and requests'
      : 'View and track your venue bookings';
  };

  const getEmptyStateTitle = () => {
    return userRole === 'host' ? 'No bookings yet' : 'No bookings yet';
  };

  const getEmptyStateDescription = () => {
    return userRole === 'host'
      ? 'Bookings will appear here when customers book your venues'
      : 'Your bookings will appear here once you make a reservation';
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{getPageTitle()}</h1>
          <p className="text-gray-600 dark:text-gray-400">{getPageDescription()}</p>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">{getEmptyStateTitle()}</h3>
            <p className="text-gray-600">{getEmptyStateDescription()}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{getPageTitle()}</h1>
        <p className="text-gray-600 dark:text-gray-400">{getPageDescription()}</p>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{booking.venues?.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {booking.venues?.city}
                  </div>
                </div>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Event Date</p>
                    <p className="text-sm text-gray-600">{new Date(booking.event_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Guests</p>
                    <p className="text-sm text-gray-600">{booking.guest_count}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Total Price</p>
                    <p className="text-sm text-gray-600">{booking.total_price} DA</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Time</p>
                  <p className="text-sm text-gray-600">
                    {booking.start_time || 'All day'} 
                    {booking.end_time && ` - ${booking.end_time}`}
                  </p>
                </div>
              </div>

              {booking.special_requests && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-1">Special Requests</p>
                  <p className="text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    {booking.special_requests}
                  </p>
                </div>
              )}

              {/* Host-specific actions */}
              {userRole === 'host' && booking.status === 'pending' && (
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleStatusUpdate(booking.id, 'confirmed', booking.venue_id, booking.event_date)}
                    disabled={updateBookingMutation.isPending}
                  >
                    Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStatusUpdate(booking.id, 'cancelled', booking.venue_id, booking.event_date)}
                    disabled={updateBookingMutation.isPending}
                  >
                    Decline
                  </Button>
                </div>
              )}

              {/* Guest-specific information */}
              {userRole === 'guest' && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {booking.status === 'pending' && 'Your booking request is pending host approval.'}
                    {booking.status === 'confirmed' && 'Your booking has been confirmed! Contact the host if you have any questions.'}
                    {booking.status === 'cancelled' && 'This booking has been cancelled.'}
                    {booking.status === 'completed' && 'This booking has been completed. We hope you had a great event!'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookingsManagement;
