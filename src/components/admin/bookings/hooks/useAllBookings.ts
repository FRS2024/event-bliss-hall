
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BookingWithDetails {
  id: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  guest_count: number;
  total_price: number;
  status: string;
  created_at: string;
  special_requests: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  venue_name: string | null;
  venue_city: string | null;
  host_name: string | null;
  host_business: string | null;
}

interface VenueData {
  id: string;
  name: string;
  city: string;
}

interface ProfileData {
  id: string;
  full_name: string;
  phone?: string;
  business_name?: string;
}

export const useAllBookings = (searchTerm: string, statusFilter: string, hasPermission: boolean) => {
  return useQuery({
    queryKey: ['admin-all-bookings', searchTerm, statusFilter],
    queryFn: async (): Promise<BookingWithDetails[]> => {
      console.log('Fetching all bookings...');

      // Base query for bookings
      let query = supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data: bookingsData, error: bookingsError } = await query;

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        throw bookingsError;
      }

      if (!bookingsData || bookingsData.length === 0) {
        return [];
      }

      // Get all unique IDs for related data
      const venueIds = [...new Set(bookingsData.map(b => b.venue_id).filter(Boolean))];
      const guestIds = [...new Set(bookingsData.map(b => b.guest_id).filter(Boolean))];
      const hostIds = [...new Set(bookingsData.map(b => b.host_id).filter(Boolean))];

      // Fetch related data in parallel
      const [venuesData, guestsData, hostsData] = await Promise.all([
        venueIds.length > 0 
          ? supabase.from('venues').select('id, name, city').in('id', venueIds)
          : Promise.resolve({ data: [], error: null }),
        guestIds.length > 0 
          ? supabase.from('profiles').select('id, full_name, phone').in('id', guestIds)
          : Promise.resolve({ data: [], error: null }),
        hostIds.length > 0
          ? supabase.from('profiles').select('id, full_name, business_name').in('id', hostIds)
          : Promise.resolve({ data: [], error: null })
      ]);

      // Create lookup maps with proper typing
      const venuesMap = new Map<string, VenueData>();
      const guestsMap = new Map<string, ProfileData>();
      const hostsMap = new Map<string, ProfileData>();

      // Populate maps
      venuesData.data?.forEach((v: VenueData) => venuesMap.set(v.id, v));
      guestsData.data?.forEach((g: ProfileData) => guestsMap.set(g.id, g));
      hostsData.data?.forEach((h: ProfileData) => hostsMap.set(h.id, h));

      // Combine data and apply search filter
      let result = bookingsData.map(booking => {
        const venue = venuesMap.get(booking.venue_id);
        const guest = guestsMap.get(booking.guest_id);
        const host = hostsMap.get(booking.host_id);

        return {
          id: booking.id,
          event_date: booking.event_date,
          start_time: booking.start_time,
          end_time: booking.end_time,
          guest_count: booking.guest_count,
          total_price: booking.total_price,
          status: booking.status,
          created_at: booking.created_at,
          special_requests: booking.special_requests,
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
        const searchLower = searchTerm.toLowerCase();
        result = result.filter(booking =>
          booking.venue_name?.toLowerCase().includes(searchLower) ||
          booking.guest_name?.toLowerCase().includes(searchLower) ||
          booking.host_name?.toLowerCase().includes(searchLower) ||
          booking.host_business?.toLowerCase().includes(searchLower) ||
          booking.id.toLowerCase().includes(searchLower)
        );
      }

      return result;
    },
    enabled: hasPermission,
  });
};
