
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
