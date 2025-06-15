
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DisputeData } from '../types';

interface VenueData {
  id: string;
  name: string;
}

interface ProfileData {
  id: string;
  full_name: string;
  business_name?: string;
}

interface BookingData {
  id: string;
  event_date: string;
  total_price: number;
  guest_count: number;
  venue_id: string;
  guest_id: string;
  host_id: string;
}

export const useBookingDisputes = (searchTerm: string, hasPermission: boolean) => {
  return useQuery({
    queryKey: ['admin-booking-disputes', searchTerm],
    queryFn: async (): Promise<DisputeData[]> => {
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

      // Create lookup maps with proper typing
      const bookingsMap = new Map<string, BookingData>();
      const venuesMap = new Map<string, VenueData>();
      const guestsMap = new Map<string, ProfileData>();
      const hostsMap = new Map<string, ProfileData>();

      // Populate maps
      bookingsData?.forEach(b => bookingsMap.set(b.id, b));
      venuesData.data?.forEach((v: VenueData) => venuesMap.set(v.id, v));
      guestsData.data?.forEach((g: ProfileData) => guestsMap.set(g.id, g));
      hostsData.data?.forEach((h: ProfileData) => hostsMap.set(h.id, h));

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
    enabled: hasPermission,
  });
};
