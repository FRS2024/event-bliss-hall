import { supabase } from '@/integrations/supabase/client';
import { Venue } from '@/types';

export const getAllVenues = async (): Promise<Venue[]> => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select(`
        *,
        venue_images (
          image_url,
          is_primary
        ),
        venue_features (
          feature_name
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return mapVenuesToInterface(data || []);
  } catch (error) {
    console.error('Error fetching venues:', error);
    return [];
  }
};

export const getFeaturedVenues = async (): Promise<Venue[]> => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select(`
        *,
        venue_images (
          image_url,
          is_primary
        ),
        venue_features (
          feature_name
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) throw error;

    return mapVenuesToInterface(data || []);
  } catch (error) {
    console.error('Error fetching featured venues:', error);
    return [];
  }
};

export const getVenueById = async (id: string): Promise<Venue | null> => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select(`
        *,
        venue_images (
          image_url,
          is_primary
        ),
        venue_features (
          feature_name
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const mappedVenues = mapVenuesToInterface([data]);
    return mappedVenues[0] || null;
  } catch (error) {
    console.error('Error fetching venue by ID:', error);
    return null;
  }
};

export const createBooking = async (bookingData: {
  venueId: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  guestCount: number;
  specialRequests?: string;
}) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Authentication required');

    // Get venue details to calculate price and get host_id
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .select('*, host_id')
      .eq('id', bookingData.venueId)
      .single();

    if (venueError) throw venueError;
    if (!venue) throw new Error('Venue not found');

    // Prevent booking own venue
    if (venue.host_id === user.user.id) {
      throw new Error('You cannot book your own venue');
    }

    // Check if venue is available on the selected date
    const { data: availability } = await supabase
      .from('venue_availability')
      .select('*')
      .eq('venue_id', bookingData.venueId)
      .eq('date', bookingData.eventDate)
      .eq('is_available', false)
      .maybeSingle();

    if (availability) {
      throw new Error('Venue is not available on the selected date');
    }

    // Calculate total price (prioritize day rate, then event rate, then hourly)
    let totalPrice = venue.price_per_day || venue.price_per_event || venue.price_per_hour || 0;

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        venue_id: bookingData.venueId,
        guest_id: user.user.id,
        host_id: venue.host_id,
        event_date: bookingData.eventDate,
        start_time: bookingData.startTime,
        end_time: bookingData.endTime,
        guest_count: bookingData.guestCount,
        total_price: totalPrice,
        special_requests: bookingData.specialRequests,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const createConversation = async (venueId: string, bookingId?: string) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Authentication required');

    // Get venue details to get host_id
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .select('host_id')
      .eq('id', venueId)
      .single();

    if (venueError) throw venueError;
    if (!venue) throw new Error('Venue not found');

    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('venue_id', venueId)
      .eq('guest_id', user.user.id)
      .eq('host_id', venue.host_id)
      .maybeSingle();

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        venue_id: venueId,
        guest_id: user.user.id,
        host_id: venue.host_id,
        booking_id: bookingId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

export const sendMessage = async (conversationId: string, content: string) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Authentication required');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.user.id,
        content
      })
      .select()
      .single();

    if (error) throw error;

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

const mapVenuesToInterface = (rawVenues: any[]): Venue[] => {
  return rawVenues.map(venue => {
    const primaryImage = venue.venue_images?.find((img: any) => img.is_primary)?.image_url;
    const images = venue.venue_images?.map((img: any) => img.image_url) || [];
    const amenities = venue.venue_features?.map((feature: any) => feature.feature_name) || [];
    
    // Determine the main price for display
    const price = venue.price_per_day || venue.price_per_hour || venue.price_per_event || 0;
    
    return {
      id: venue.id,
      name: venue.name,
      description: venue.description,
      location: `${venue.address}, ${venue.city}`,
      city: venue.city,
      address: venue.address,
      price,
      price_per_hour: venue.price_per_hour,
      price_per_day: venue.price_per_day,
      price_per_event: venue.price_per_event,
      capacity: venue.capacity,
      category: 'Event Space', // Default category since it's not in the database
      images: images.length > 0 ? images : [primaryImage || '/placeholder.svg'],
      amenities,
      rating: 4.5, // Default rating since reviews aren't implemented
      reviewCount: 0,
      availability: 'Available',
      hostId: venue.host_id,
      is_active: venue.is_active
    } as Venue;
  });
};
