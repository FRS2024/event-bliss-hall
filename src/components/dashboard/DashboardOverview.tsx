
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import VenuesList from './VenuesList';

const DashboardOverview: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      console.log('Fetching dashboard stats for user:', user.user.id);

      const [venuesResult, bookingsResult] = await Promise.all([
        supabase
          .from('venues')
          .select('*')
          .eq('host_id', user.user.id),
        supabase
          .from('bookings')
          .select('*')
          .eq('host_id', user.user.id)
      ]);

      if (venuesResult.error) {
        console.error('Error fetching venues:', venuesResult.error);
        throw venuesResult.error;
      }

      if (bookingsResult.error) {
        console.error('Error fetching bookings:', bookingsResult.error);
        throw bookingsResult.error;
      }

      const venues = venuesResult.data || [];
      const bookings = bookingsResult.data || [];

      const totalRevenue = bookings.reduce((sum, booking) => 
        sum + Number(booking.total_price || 0), 0);

      return {
        totalVenues: venues.length,
        totalBookings: bookings.length,
        totalRevenue,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
      };
    },
  });

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your venues and track your performance</p>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2 text-red-600">Error loading dashboard</h3>
            <p className="text-gray-600">Please try refreshing the page or contact support if the issue persists.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your venues and track your performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : (stats?.totalVenues || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : (stats?.totalBookings || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : `${(stats?.totalRevenue || 0).toFixed(2)} DA`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : (stats?.pendingBookings || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <VenuesList />
    </div>
  );
};

export default DashboardOverview;
