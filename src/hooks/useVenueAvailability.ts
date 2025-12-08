import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, isBefore, isSameDay } from 'date-fns';

export const useVenueAvailability = (venueId: string | undefined) => {
  const { data: unavailableDates, isLoading } = useQuery({
    queryKey: ['venue-availability', venueId],
    queryFn: async () => {
      if (!venueId) return [];

      // Get dates marked as unavailable by host
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('venue_availability')
        .select('date, is_available')
        .eq('venue_id', venueId)
        .eq('is_available', false);

      if (availabilityError) {
        console.error('Error fetching availability:', availabilityError);
      }

      // Get dates with confirmed bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('event_date')
        .eq('venue_id', venueId)
        .eq('status', 'confirmed');

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
      }

      const unavailable: Date[] = [];

      // Add unavailable dates from venue_availability
      if (availabilityData) {
        availabilityData.forEach((item) => {
          unavailable.push(new Date(item.date));
        });
      }

      // Add booked dates
      if (bookingsData) {
        bookingsData.forEach((booking) => {
          unavailable.push(new Date(booking.event_date));
        });
      }

      return unavailable;
    },
    enabled: !!venueId,
  });

  const isDateAvailable = (date: Date): boolean => {
    const today = startOfDay(new Date());
    
    // Past dates are not available
    if (isBefore(startOfDay(date), today)) {
      return false;
    }

    // Check if date is in unavailable list
    if (unavailableDates) {
      return !unavailableDates.some((unavailableDate) => 
        isSameDay(unavailableDate, date)
      );
    }

    return true;
  };

  const isPastDate = (date: Date): boolean => {
    const today = startOfDay(new Date());
    return isBefore(startOfDay(date), today);
  };

  return {
    unavailableDates: unavailableDates || [],
    isLoading,
    isDateAvailable,
    isPastDate,
  };
};
