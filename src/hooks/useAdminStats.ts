
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStats = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      console.log('Fetching admin dashboard stats...');

      // Get user counts
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, created_at');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Get venue counts
      const { data: venues, error: venuesError } = await supabase
        .from('venues')
        .select('id, is_active, created_at');

      if (venuesError) {
        console.error('Error fetching venues:', venuesError);
        throw venuesError;
      }

      // Get booking counts and revenue
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, status, total_price, created_at');

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        throw bookingsError;
      }

      // Get support tickets
      const { data: tickets, error: ticketsError } = await supabase
        .from('support_tickets')
        .select('id, status, priority, created_at');

      if (ticketsError) {
        console.error('Error fetching support tickets:', ticketsError);
        throw ticketsError;
      }

      // Get flagged content
      const { data: flaggedContent, error: flaggedError } = await supabase
        .from('flagged_content')
        .select('id, status, content_type, created_at');

      if (flaggedError) {
        console.error('Error fetching flagged content:', flaggedError);
        throw flaggedError;
      }

      // Calculate stats
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const totalUsers = profiles?.length || 0;
      const totalVenues = venues?.length || 0;
      const activeVenues = venues?.filter(v => v.is_active)?.length || 0;
      const totalBookings = bookings?.length || 0;
      const totalRevenue = bookings?.reduce((sum, booking) => sum + Number(booking.total_price || 0), 0) || 0;

      // Today's stats
      const todaysUsers = profiles?.filter(p => new Date(p.created_at) >= startOfToday)?.length || 0;
      const todaysBookings = bookings?.filter(b => new Date(b.created_at) >= startOfToday)?.length || 0;
      const todaysRevenue = bookings?.filter(b => new Date(b.created_at) >= startOfToday)
        ?.reduce((sum, booking) => sum + Number(booking.total_price || 0), 0) || 0;

      // Pending items
      const pendingVenues = venues?.filter(v => !v.is_active)?.length || 0;
      const pendingBookings = bookings?.filter(b => b.status === 'pending')?.length || 0;
      const openTickets = tickets?.filter(t => t.status === 'open')?.length || 0;
      const pendingFlags = flaggedContent?.filter(f => f.status === 'pending')?.length || 0;

      return {
        overview: {
          totalUsers,
          totalVenues,
          activeVenues,
          totalBookings,
          totalRevenue: totalRevenue.toFixed(2),
        },
        today: {
          newUsers: todaysUsers,
          newBookings: todaysBookings,
          revenue: todaysRevenue.toFixed(2),
        },
        pending: {
          venues: pendingVenues,
          bookings: pendingBookings,
          tickets: openTickets,
          flags: pendingFlags,
        },
        charts: {
          userGrowth: profiles?.map(p => ({
            date: new Date(p.created_at).toLocaleDateString(),
            count: 1
          })) || [],
          bookingTrends: bookings?.map(b => ({
            date: new Date(b.created_at).toLocaleDateString(),
            amount: Number(b.total_price || 0)
          })) || [],
        }
      };
    },
  });

  return { stats, isLoading, error };
};
